-- =====================================================
-- 0008_shop_orders.sql
-- BrandG 쇼핑몰 다중 상품 결제 지원 (Phase X-2)
--
-- 핵심 원칙:
--   - 기존 사주(premium-saju) 결제 흐름 100% 호환
--   - order_kind 기본값 'saju' — kind 안 보내면 자동 사주 처리
--   - shop 모드는 명시적으로 kind='shop' 일 때만 활성화
--   - 기존 row 는 모두 자동 'saju' 채워짐
-- =====================================================
-- 이 마이그레이션이 추가하는 것:
--   1. order_kind enum ('saju' | 'shop')
--   2. orders 테이블 변경:
--      - kind 컬럼 (NOT NULL DEFAULT 'saju')
--      - product_id NULL 허용 (shop 은 order_items 에 다중)
--      - 배송 정보 6 컬럼 (모두 nullable, kind='shop' 시 4개 필수)
--      - 무결성 constraint 2개
--   3. order_items 테이블 (장바구니 다중 상품, 가격/이름 snapshot)
--   4. order_items RLS 정책 (SELECT 본인 주문만, INSERT/UPDATE 는 service role)
--
-- 깨뜨리지 않는 것:
--   - 기존 orders 모든 row: kind='saju' 자동 채워짐
--   - 기존 saju 결제 API 흐름 (kind 미지정 시 자동 saju)
--   - orders 기존 RLS 정책
--   - orders_user_or_guest constraint (0001 기준)
--   - saju_inputs / saju_results / reviews FK
-- =====================================================


-- ───────────────────────────────────────────────
-- 1) order_kind enum
-- ───────────────────────────────────────────────
create type public.order_kind as enum ('saju', 'shop');


-- ───────────────────────────────────────────────
-- 2) orders 테이블 변경
-- ───────────────────────────────────────────────

-- 2-a. kind 컬럼 — 기본값 'saju' 로 모든 기존 row 자동 채움
alter table public.orders
  add column kind public.order_kind not null default 'saju';

-- 2-b. product_id NULL 허용 (shop 주문은 order_items 사용. saju 는 그대로 NOT NULL 강제 — constraint 로)
alter table public.orders
  alter column product_id drop not null;

-- 2-c. 배송 정보 컬럼 (모두 nullable. kind='shop' 일 때만 채움)
alter table public.orders add column shipping_recipient text;
alter table public.orders add column shipping_phone     text;
alter table public.orders add column shipping_zip       text;
alter table public.orders add column shipping_addr1     text;
alter table public.orders add column shipping_addr2     text;  -- 상세 주소 (선택)
alter table public.orders add column shipping_memo      text;  -- 배송 메모 (선택)

-- 2-d. 무결성 — saju 주문은 product_id 필수 (기존 데이터 모두 충족)
alter table public.orders
  add constraint orders_saju_product_required check (
    kind <> 'saju' or product_id is not null
  );

-- 2-e. 무결성 — shop 주문은 배송 정보 4개 필수 (memo/addr2 는 선택)
alter table public.orders
  add constraint orders_shop_shipping_required check (
    kind <> 'shop' or (
      shipping_recipient is not null
      and shipping_phone is not null
      and shipping_zip is not null
      and shipping_addr1 is not null
    )
  );


-- ───────────────────────────────────────────────
-- 3) order_items 테이블 신규
-- ───────────────────────────────────────────────
-- 장바구니 다중 상품 저장.
-- product_name_snapshot / unit_price 는 주문 시점 값 보존
-- (상품 가격이 나중에 바뀌어도 주문 기록은 변하지 않음).
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name_snapshot text not null,
  qty integer not null check (qty > 0),
  unit_price integer not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create index order_items_order_idx   on public.order_items(order_id);
create index order_items_product_idx on public.order_items(product_id);


-- ───────────────────────────────────────────────
-- 4) order_items RLS 정책
-- ───────────────────────────────────────────────
alter table public.order_items enable row level security;

-- SELECT: 본인 주문의 아이템만 조회 (로그인 사용자)
-- 게스트는 service role 경유 API 로만 조회 가능 (기존 orders 와 동일 패턴)
create policy "users read own order_items"
  on public.order_items
  for select
  to authenticated
  using (
    order_id in (
      select id from public.orders
      where user_id = auth.uid()
    )
  );

-- INSERT / UPDATE / DELETE 정책 없음 → 기본 거부
-- service role (API route) 만 변경 가능. 일반 사용자는 변조 불가.


-- =====================================================
-- 다음 단계 (별도 phase, 사용자 사전 승인 필요):
--   Phase X-3: /api/orders/create 분기 + /api/orders/confirm 분기
--   Phase X-4: /checkout/[orderId] 다중 아이템 표시 + /checkout/success 분기
--   Phase X-5: /checkout-demo submit 핸들러를 실제 /api/orders/create 호출로 전환
--   Phase X-6: /mypage/orders 다중 아이템 분기 표시
-- =====================================================
