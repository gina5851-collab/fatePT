-- =====================================================
-- Readings 도메인 — 확장형 리딩 서비스 (첫 구현: Tarot)
-- =====================================================
-- 설계 원칙
--   - 사주(saju) 기존 테이블(saju_inputs / saju_results)은 건드리지 않는다.
--   - products / orders 는 service_type 으로 서비스를 구분(가산적 컬럼, 기본값 'saju').
--   - 서비스별 입력/결과는 범용 reading_inputs / readings 에 jsonb 로 저장.
--   - 향후 oracle / runes / astrology / mbti 등은 스키마 변경 없이 service_type 값만 추가.
-- 이 마이그레이션은 전부 가산적(add column if not exists / create table)이라
-- 기존 데이터·쿼리에 영향을 주지 않는다.

-- ─── 공용 확장: products / orders ───────────────────
alter table public.products
  add column if not exists service_type text not null default 'saju';

alter table public.orders
  add column if not exists service_type text not null default 'saju';

-- 고객 결과 URL 노출용 안전 토큰. 내부 UUID 대신 이 값으로 조회(타로 결과).
alter table public.orders
  add column if not exists public_token text;
create unique index if not exists orders_public_token_idx
  on public.orders(public_token) where public_token is not null;

-- 광고 유입 추적(UTM 등). 사주/타로 공통.
alter table public.orders
  add column if not exists source text;

-- 리딩 세부 진행 상태(결제 status enum 은 그대로 두고 별도 컬럼으로).
alter table public.orders
  add column if not exists reading_status text;

create index if not exists orders_service_type_idx
  on public.orders(service_type, created_at desc);

-- ─── reading_inputs — 범용 입력 ─────────────────────
-- payload 예) 타로: { "question": "...", "spread": "relationship" }
create table if not exists public.reading_inputs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  service_type text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ─── readings — 범용 결과 ───────────────────────────
-- status: drawn | generating | draft | published | failed
--   drawn      = 카드 드로우 완료(검수형 상품, AI 생성 대기)
--   generating = AI 생성 중(전이 상태)
--   draft      = AI 초안 생성됨(관리자 검수 대기)
--   published  = 발행됨(고객 노출)
--   failed     = 생성 실패(관리자 재생성 필요)
create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  service_type text not null,
  draw_record jsonb,                       -- 뽑기형만: { seed, cards:[{position,cardId,orientation}] }
  prompt_version text,
  model text,
  raw_response jsonb,                       -- LLM 원본 응답(파싱 전)
  draft_result jsonb,                       -- 검수 전 결과(JSON)
  final_result jsonb,                       -- 검수/수정 후 최종 결과(JSON)
  status text not null default 'drawn',
  error_log text,                           -- 마지막 실패 사유
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists readings_status_idx on public.readings(service_type, status);
create index if not exists readings_order_idx on public.readings(order_id);

-- updated_at 자동 갱신
create or replace function public.touch_readings_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists readings_set_updated_at on public.readings;
create trigger readings_set_updated_at
  before update on public.readings
  for each row execute procedure public.touch_readings_updated_at();

-- ─── RLS ────────────────────────────────────────────
-- 원칙: 미결제/미발행 결과는 고객에게 노출하지 않는다.
--   - 쓰기(드로우/생성/검수/발행)와 토큰 조회는 service_role(서버 라우트)만.
--   - 로그인 고객은 '본인 주문 + published' 결과만 select 가능.
alter table public.reading_inputs enable row level security;
alter table public.readings enable row level security;

drop policy if exists "reading_inputs via own order" on public.reading_inputs;
create policy "reading_inputs via own order"
  on public.reading_inputs for select
  using (exists (
    select 1 from public.orders o
    where o.id = reading_inputs.order_id and o.user_id = auth.uid()
  ));

drop policy if exists "readings published via own order" on public.readings;
create policy "readings published via own order"
  on public.readings for select
  using (
    status = 'published'
    and exists (
      select 1 from public.orders o
      where o.id = readings.order_id and o.user_id = auth.uid()
    )
  );

-- 게스트/토큰 기반 결과 조회는 서버 라우트에서 service_role + public_token 매칭으로 처리.
