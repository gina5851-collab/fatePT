-- =====================================================
-- 결제 수단 추가: 토스 자동결제 + 무통장입금(계좌이체)
-- =====================================================
-- PG 심사 통과 전, 무통장입금으로 먼저 매출을 받을 수 있도록.
-- payment_method = 'bank_transfer' 인 주문은 관리자가 /admin/orders 에서
-- 입금 확인 후 수동으로 paid 처리 → 결과지 생성합니다.

alter table public.orders
  add column if not exists payment_method text not null default 'toss'
    check (payment_method in ('toss', 'bank_transfer'));

-- 무통장입금 시 입금자명(대조용). 토스 결제 주문은 null.
alter table public.orders
  add column if not exists depositor_name text;

create index if not exists orders_pending_bank_idx
  on public.orders(status, payment_method);
