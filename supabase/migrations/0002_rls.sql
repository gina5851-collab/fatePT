-- =====================================================
-- Row Level Security 정책
-- =====================================================
-- 원칙:
--   - 일반 사용자는 본인 데이터만 select/update
--   - products는 공개 read
--   - 결제 confirm / LLM 생성 / 환불은 service_role 키로만 (서버 route handler)

-- ─── profiles ────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "profiles self select"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles self update"
  on public.profiles for update
  using (auth.uid() = id);

-- ─── products ────────────────────────────────────────
alter table public.products enable row level security;

create policy "products public read"
  on public.products for select
  using (is_active = true);

-- ─── orders ──────────────────────────────────────────
alter table public.orders enable row level security;

create policy "orders self select"
  on public.orders for select
  using (auth.uid() = user_id);

-- guest 주문 조회는 서버 route handler에서 service_role + order_id 매칭으로 처리

-- ─── saju_inputs ─────────────────────────────────────
alter table public.saju_inputs enable row level security;

create policy "saju_inputs via own order"
  on public.saju_inputs for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = saju_inputs.order_id and o.user_id = auth.uid()
    )
  );

-- ─── saju_results ────────────────────────────────────
alter table public.saju_results enable row level security;

create policy "saju_results via own order"
  on public.saju_results for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = saju_results.order_id and o.user_id = auth.uid()
    )
  );

-- ─── reviews ─────────────────────────────────────────
alter table public.reviews enable row level security;

create policy "reviews public read"
  on public.reviews for select
  using (is_public = true);

create policy "reviews self insert"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews self update"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "reviews self delete"
  on public.reviews for delete
  using (auth.uid() = user_id);
