-- =====================================================
-- 운명PT 리포트: MBTI 저장 + 분석 원본(analysis) 보관
-- =====================================================
-- 1) saju_inputs.mbti — /start 퍼널에서 받은 MBTI (없으면 NULL)
-- 2) saju_results.analysis — 만세력 API 응답 원본(JSON). 결과 페이지가
--    buildDunmyeongReport 로 리포트를 재구성하는 데 사용. 없으면(구버전/mock) NULL.

alter table public.saju_inputs
  add column if not exists mbti text;

alter table public.saju_results
  add column if not exists analysis jsonb;
