-- =====================================================
-- 타로 상품 기준 v1 적용 — Production 수동 SQL
-- =====================================================
-- 기준: docs/TAROT_PRODUCT_STANDARD.md
-- 대상: public.products 의 타로 3행만. 사주 상품·주문·고객 데이터는 건드리지 않는다.
-- 실행: Supabase SQL Editor 에서 1회. (전체 seed 금지 — 이 파일만 사용)
--
-- 변경 내용:
--   tarot-daily        : 이름 '원 카드 타로',   가격  990 → 1000
--   tarot-inner-mind   : 이름 '3 카드 타로',    가격 2970 → 3800
--   tarot-relationship : slug 를 'tarot-celtic-cross' 로 교체(행 유지·id 보존),
--                        이름 '켈틱 크로스 타로', 가격 4950 → 5800
--   ※ 정상가 8,700원은 프런트 표기 전용 — DB에는 저장하지 않음(컬럼 없음).

do $$
declare
  tarot_orders integer;
  tarot_rows integer;
begin
  -- ── 가드 1: 타로 주문이 하나라도 있으면 중단 (slug 교체 안전 조건) ──
  select count(*) into tarot_orders from public.orders where service_type = 'tarot';
  if tarot_orders > 0 then
    raise exception '중단: 타로 주문이 % 건 존재합니다. slug 교체/가격 변경 전 별도 검토가 필요합니다.', tarot_orders;
  end if;

  -- ── 가드 2: 기대한 타로 3행이 정확히 존재해야 함 ──
  select count(*) into tarot_rows from public.products
   where service_type = 'tarot'
     and slug in ('tarot-daily', 'tarot-inner-mind', 'tarot-relationship');
  if tarot_rows <> 3 then
    raise exception '중단: 기대한 타로 slug 3행이 아닙니다 (현재 % 행). 상태 확인 필요.', tarot_rows;
  end if;

  -- ── 타로 3행만 갱신 (WHERE 에 service_type=''tarot'' 고정 — 사주 상품 불가침) ──
  update public.products
     set name = '원 카드 타로',
         description = '한 장으로 받는 핵심 메시지와 오늘의 조언',
         price = 1000
   where slug = 'tarot-daily' and service_type = 'tarot';

  update public.products
     set name = '3 카드 타로',
         description = '세 장으로 읽는 상황의 앞뒤 — 구성은 내가 선택',
         price = 3800
   where slug = 'tarot-inner-mind' and service_type = 'tarot';

  update public.products
     set slug = 'tarot-celtic-cross',
         name = '켈틱 크로스 타로',
         description = '10장으로 펼치는 가장 깊은 정통 리딩',
         price = 5800
   where slug = 'tarot-relationship' and service_type = 'tarot';

  raise notice '타로 기준 v1 적용 완료 (3행 갱신, 주문 0건 확인됨)';
end $$;

-- ── 실행 후 검증 (읽기 전용) ──
-- 1) 타로 3행 최종 상태
select slug, name, price, display_order, is_active, service_type
  from public.products where service_type = 'tarot' order by display_order;
-- 기대: tarot-daily/원 카드 타로/1000, tarot-inner-mind/3 카드 타로/3800, tarot-celtic-cross/켈틱 크로스 타로/5800 (전부 active)

-- 2) 사주 상품 불변 확인 (이름·가격 스냅샷)
select slug, name, price, is_active from public.products
 where service_type <> 'tarot' order by display_order;

-- 3) 데이터 행 수 불변 확인
select
  (select count(*) from public.orders)         as orders,
  (select count(*) from public.saju_inputs)    as saju_inputs,
  (select count(*) from public.saju_results)   as saju_results,
  (select count(*) from public.reading_inputs) as reading_inputs,
  (select count(*) from public.readings)       as readings;
