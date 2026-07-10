# 타로 리딩(readings) 운영 반영 순서 체크리스트

`feat/tarot-readings-mvp` (PR #5) 를 운영에 반영할 때 **반드시 아래 순서**로 진행한다.

## ⚠️ 순서가 중요한 두 가지 이유

**(1) 마이그레이션은 코드 배포보다 먼저 (문제 2 — 배포 순서)**
결제 confirm 라우트(`src/app/api/orders/confirm/route.ts`)가 `orders.service_type`·`orders.public_token`
컬럼을 조회한다. 이 컬럼은 `0009_readings.sql` 로 추가된다.
→ 마이그레이션(0009) 적용 전에 **새 코드**가 운영 트래픽을 받으면 사주 결제 confirm 포함 모든
confirm 이 컬럼 부재로 실패한다. 반드시 **마이그레이션 → 코드 배포** 순서.
(기존 운영 코드는 새 컬럼을 조회하지 않으므로, 마이그레이션만 먼저 적용해도 무해하다.)

**(2) 타로 상품 시드는 코드 배포보다 나중에 (정정된 순서)**
기존 운영 코드에는 사주 목록에 `service_type='saju'` 필터가 없다.
→ 필터가 포함된 새 코드가 배포되기 **전에** 타로 상품을 시드하면, 기존 사주 상품 목록(`/products`,
랜딩 라인업)에 타로 상품이 노출된다. 반드시 **코드 배포 → (기존 서비스 재확인) → 타로 시드** 순서.

## 최종 운영 반영 순서

1. **Vercel PR checks 가 최신 커밋 기준 모두 success 인지 확인**
2. **Supabase 운영 DB 에 `0009_readings.sql` 만 먼저 적용** (타로 시드는 아직 실행하지 않음)
3. **마이그레이션 성공 확인 + 기존 사주 회귀 확인**
   - 컬럼/테이블/인덱스/RLS 생성 확인 (아래 "적용 직후 검증 쿼리")
   - 기존 운영 코드 그대로 사주 상품 조회·주문·결제 confirm 정상 동작 확인
     (기존 코드는 새 컬럼을 읽지 않으므로 영향 없어야 함)
4. **타로 상품 시드는 아직 실행하지 않음**
5. **PR #5 merge**
6. **Vercel 운영 배포 완료 확인** (새 코드 = service_type 필터/방어 포함)
7. **기존 FatePT 메인·사주 상품·주문·결제 회귀 스모크** (배포된 새 코드 기준)
8. **타로 상품 3종 시드 실행** (`pnpm seed:products` — 이 시점에야 타로가 DB 에 등장)
9. **`/products` 에 타로 미노출 / `/tarot` 에만 노출 확인**
10. **Toss 테스트키로 타로 주문·결제 E2E**
11. **오늘의 타로(tarot-daily) 자동발행 확인** (결제 → 즉시 published)
12. **속마음·관계흐름: draft → 관리자 검수 → published 확인**
13. **사주↔타로 교차추천 확인**

> 요약 흐름: **마이그레이션 → 기존 사주 회귀 확인 → PR merge·코드 배포 → 기존 서비스 재확인
> → 타로 상품 시드 → 타로 E2E**

## 적용 직후 검증 쿼리 (2단계 이후)

```sql
-- (a) products/orders 추가 컬럼 확인
select table_name, column_name, data_type, column_default, is_nullable
from information_schema.columns
where table_schema='public' and table_name in ('products','orders')
  and column_name in ('service_type','public_token','source','reading_status')
order by table_name, column_name;

-- (b) 신규 테이블 확인
select table_name from information_schema.tables
where table_schema='public' and table_name in ('reading_inputs','readings');

-- (c) 기존 행이 기본값 'saju' 로 채워졌는지
select service_type, count(*) from public.products group by 1;
select service_type, count(*) from public.orders   group by 1;

-- (d) 유니크 인덱스 / RLS 정책 확인
select indexname from pg_indexes
where schemaname='public' and tablename='orders' and indexname='orders_public_token_idx';
select tablename, policyname from pg_policies
where schemaname='public' and tablename in ('readings','reading_inputs');
```

## 기존 사주 결제 confirm 점검 절차 (3단계)

- 마이그레이션 직후, **아직 기존(구) 코드가 배포된 상태**에서:
  - 사주 상품 1건 테스트 주문 생성 → Toss 승인 → `/api/orders/confirm` → `{ resultId }` 응답 →
    `/results/[id]` 정상 로드까지 확인.
  - 또는 최근 사주 주문/`saju_results` 가 그대로 조회되는지 read-only 확인.
- 구 코드의 confirm SELECT 는 신규 컬럼을 참조하지 않으므로, 마이그레이션만으로는 동작이 바뀌지 않아야 한다.

## 적용 예상 시간 / 잠금 / 중단 가능성

- **예상 시간:** 소규모 데이터 기준 1초 미만.
- **컬럼 추가(`add column ... default 'saju'`):** PostgreSQL 11+ 는 상수 기본값이면 테이블 재작성 없이
  메타데이터만 갱신 → 매우 빠름(순간적 `ACCESS EXCLUSIVE` 락).
- **`public_token` 부분 유니크 인덱스 생성:** 인덱스 빌드 동안 `orders` 에 쓰기 락(읽기는 가능).
  소규모 테이블이라 밀리초 수준. (마이그레이션은 트랜잭션 내 실행이라 `CONCURRENTLY` 미사용)
- **중단 가능성:** 사실상 없음. 다만 장기 실행 트랜잭션이 있으면 `ALTER TABLE` 락이 잠시 대기할 수 있으므로
  **트래픽이 낮은 시간대 적용 권장**.

## 롤백 SQL 초안 (비상시)

⚠️ **주의:** 새 코드는 `service_type`·`public_token` 을 읽으므로, 이 롤백은 **코드도 함께 롤백할 때만** 실행한다.
컬럼/테이블 삭제 시 타로 데이터가 있으면 소실된다(런칭 전이면 데이터 없음).

```sql
begin;
drop trigger if exists readings_set_updated_at on public.readings;
drop function if exists public.touch_readings_updated_at();
drop table if exists public.readings;           -- 타로 결과(있으면 소실)
drop table if exists public.reading_inputs;     -- 타로 입력(있으면 소실)
drop index if exists public.orders_public_token_idx;
drop index if exists public.orders_service_type_idx;
alter table public.orders   drop column if exists reading_status;
alter table public.orders   drop column if exists source;
alter table public.orders   drop column if exists public_token;
alter table public.orders   drop column if exists service_type;
alter table public.products drop column if exists service_type;
commit;
```
