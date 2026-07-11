-- =====================================================
-- 타로 상품 기준 v1 적용 — Production 수동 SQL (UPDATE 전용)
-- =====================================================
-- 기준: docs/TAROT_PRODUCT_STANDARD.md
-- 실행: Supabase SQL Editor 에서 1회. 전체 seed 금지 — 이 파일만 사용.
--
-- ── 실제 스키마 참조 관계 (0001_init.sql / 0009_readings.sql 기준) ──
--   orders.product_id        → products.id  (uuid FK — slug 아님)
--   reading_inputs.order_id  → orders.id    (products 직접 참조 없음)
--   readings.order_id        → orders.id    (products 직접 참조 없음)
--   ⇒ products.slug 는 어떤 테이블도 FK 로 참조하지 않으므로,
--     "같은 id 행의 slug UPDATE" 는 데이터 정합성을 깨지 않는다.
--   ⇒ 가드는 product_id 기준으로 orders 를 조회하고,
--     reading_inputs / readings 는 그 orders.id 를 통해 조회한다.
--
-- ── 변경 내용 (DELETE / INSERT 없음 — 기존 product id 유지) ──
--   tarot-daily        → slug 'tarot-one-card',    이름 '원 카드 타로',   가격 1000
--   tarot-inner-mind   → slug 'tarot-three-card',  이름 '3 카드 타로',    가격 3800
--   tarot-relationship → slug 'tarot-celtic-cross', 이름 '켈틱 크로스 타로', 가격 5800
--   ※ 정상가 8,700원은 프런트 표기 전용(originalPrice) — DB에는 컬럼도 값도 없다.

begin;

do $$
declare
  v_ids uuid[];
  v_rows integer;
  v_orders integer;
  v_reading_inputs integer;
  v_readings integer;
begin
  -- ── 현재 타로 3행과 product_id 확인 ──
  select array_agg(id), count(*) into v_ids, v_rows
    from public.products
   where service_type = 'tarot'
     and slug in ('tarot-daily', 'tarot-inner-mind', 'tarot-relationship');

  if v_rows <> 3 then
    raise exception '중단: 기대한 구 slug 타로 3행이 아닙니다 (현재 % 행). 이미 적용됐거나 상태가 다릅니다.', v_rows;
  end if;

  -- ── 가드: 해당 product_id 를 참조하는 데이터가 하나라도 있으면 전체 중단 ──
  select count(*) into v_orders
    from public.orders where product_id = any(v_ids);

  select count(*) into v_reading_inputs
    from public.reading_inputs ri
   where ri.order_id in (select o.id from public.orders o where o.product_id = any(v_ids));

  select count(*) into v_readings
    from public.readings r
   where r.order_id in (select o.id from public.orders o where o.product_id = any(v_ids));

  if v_orders > 0 or v_reading_inputs > 0 or v_readings > 0 then
    raise exception '중단: 타로 상품 참조 데이터 존재 (orders=%, reading_inputs=%, readings=%). UPDATE 를 진행하지 않습니다.',
      v_orders, v_reading_inputs, v_readings;
  end if;

  -- ── 0건 확인됨 → 기존 id 유지한 채 slug·이름·설명·가격만 UPDATE ──
  update public.products
     set slug = 'tarot-one-card',
         name = '원 카드 타로',
         description = '한 장으로 받는 핵심 메시지와 오늘의 조언',
         price = 1000
   where slug = 'tarot-daily' and service_type = 'tarot';

  update public.products
     set slug = 'tarot-three-card',
         name = '3 카드 타로',
         description = '세 장으로 읽는 상황의 앞뒤 — 구성은 내가 선택',
         price = 3800
   where slug = 'tarot-inner-mind' and service_type = 'tarot';

  update public.products
     set slug = 'tarot-celtic-cross',
         name = '켈틱 크로스 타로',
         description = '10장으로 펼치는 가장 깊은 정통 리딩',
         price = 5800
   where slug = 'tarot-relationship' and service_type = 'tarot';

  raise notice '타로 기준 v1 적용 완료 — 3행 UPDATE (참조 데이터 0건 확인, id 보존)';
end $$;

-- 결과가 기대와 다르면 commit 대신 `rollback;` 을 실행하세요.
commit;

-- =====================================================
-- 실행 후 검증 (읽기 전용)
-- =====================================================
-- 1) 타로 3행 최종 상태 — 기대:
--    tarot-one-card / 원 카드 타로 / 1000, tarot-three-card / 3 카드 타로 / 3800,
--    tarot-celtic-cross / 켈틱 크로스 타로 / 5800 (전부 is_active=true, service_type='tarot')
select slug, name, price, display_order, is_active, service_type
  from public.products where service_type = 'tarot' order by display_order;

-- 2) 사주 상품 불변 확인
select slug, name, price, is_active from public.products
 where service_type <> 'tarot' order by display_order;

-- 3) 데이터 행 수 불변 확인
select
  (select count(*) from public.orders)         as orders,
  (select count(*) from public.saju_inputs)    as saju_inputs,
  (select count(*) from public.saju_results)   as saju_results,
  (select count(*) from public.reading_inputs) as reading_inputs,
  (select count(*) from public.readings)       as readings;

-- =====================================================
-- ROLLBACK SQL — 적용 후 되돌려야 할 때 (동일 가드 원칙, id 보존)
-- =====================================================
-- begin;
-- update public.products
--    set slug = 'tarot-daily', name = '오늘의 타로',
--        description = '지금 나에게 필요한 한 장의 메시지', price = 990
--  where slug = 'tarot-one-card' and service_type = 'tarot';
-- update public.products
--    set slug = 'tarot-inner-mind', name = '그 사람의 속마음',
--        description = '3장으로 읽는 그 사람의 진짜 마음', price = 2970
--  where slug = 'tarot-three-card' and service_type = 'tarot';
-- update public.products
--    set slug = 'tarot-relationship', name = '우리 관계의 흐름',
--        description = '5장으로 보는 두 사람의 관계 흐름', price = 4950
--  where slug = 'tarot-celtic-cross' and service_type = 'tarot';
-- commit;
