-- =====================================================
-- 게스트 무료 진단 주문 허용
-- =====================================================
-- CLAUDE.md 정책: 무료 진단은 게스트 허용 (orders.user_id = null).
-- 기존 orders_user_or_guest 는 user_id OR guest_email 필수라 게스트 무료 insert 가 500.
-- payment_method = 'free' 인 주문만 user_id·guest_email 동시 null 허용.
-- 일반 주문(토스/무통장)은 기존과 동일: user_id 또는 guest_email 필요.

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_or_guest;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_user_or_guest CHECK (
    payment_method = 'free'
    OR user_id IS NOT NULL
    OR guest_email IS NOT NULL
  );
