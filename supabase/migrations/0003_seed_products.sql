-- =====================================================
-- 상품 시드 (가격대만 다른 단순 라인업)
-- =====================================================
-- 수강생은 src/config/products.seed.ts 를 수정하고
-- pnpm seed:products 로 다시 채우면 됩니다.

insert into public.products (slug, name, description, price, display_order, is_active)
values
  ('today-fortune', '오늘의 운세 한 줄', '아침에 가볍게 보는 오늘 하루 흐름 한 문장', 4900, 10, true),
  ('basic-saju', '기본 사주 풀이', '사주 4기둥 기반 종합 성향 / 운의 흐름 리포트', 9900, 20, true),
  ('love-saju', '연애·궁합 리포트', '내 연애 패턴과 잘 맞는 사람 유형 분석', 19900, 30, true),
  ('premium-saju', '프리미엄 종합 풀이', '대운 / 세운 / 직업운 / 재물운 / 건강운 통합 리포트', 49900, 40, true)
on conflict (slug) do nothing;
