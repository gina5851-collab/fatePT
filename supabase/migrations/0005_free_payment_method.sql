-- =====================================================
-- 무료 키트: payment_method 에 'free' 허용
-- =====================================================
-- 무료 진단도 주문(0원, status=paid, payment_method='free')으로 기록해
-- "하루 1회" 제한을 카운트한다. 기존 체크 제약을 교체한다.

alter table public.orders drop constraint if exists orders_payment_method_check;

alter table public.orders
  add constraint orders_payment_method_check
  check (payment_method in ('toss', 'bank_transfer', 'free'));
