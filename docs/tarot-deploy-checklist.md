# 타로 리딩(readings) 운영 반영 순서 체크리스트

`feat/tarot-readings-mvp` (PR #5) 를 운영에 반영할 때 **반드시 아래 순서**로 진행한다.

## ⚠️ 왜 순서가 중요한가 (문제 2 — 배포 순서 이슈)

이 브랜치의 결제 confirm 라우트(`src/app/api/orders/confirm/route.ts`)는
`orders.service_type`·`orders.public_token` 컬럼을 조회한다.
이 컬럼들은 `supabase/migrations/0009_readings.sql` 로 추가된다.

따라서 **마이그레이션(0009) 적용 전에 이 코드가 운영 트래픽을 받으면,
사주 결제 confirm 을 포함한 모든 결제 confirm 이 컬럼 부재로 실패**한다.
→ 반드시 코드 배포보다 **먼저** 마이그레이션을 적용한다. (코드 버그 아님 — 순서 문제)

## 반영 순서

1. **[DB] 마이그레이션 적용 (코드 배포 전)**
   - 스테이징 Supabase 에 `0009_readings.sql` 적용 → 성공 확인
   - `products`, `orders` 에 `service_type` 컬럼 존재 확인
   - `reading_inputs`, `readings` 테이블 생성 확인
   - `orders.public_token` 부분 유니크 인덱스 생성 확인
   - 기존 행의 `service_type` 이 `'saju'` 기본값으로 채워졌는지 확인

2. **[DB] 마이그레이션 성공 검증**
   - RLS 정책(`reading_inputs`, `readings`)이 적용됐는지 확인
   - service_role(서버 라우트) 조회/수정이 정상 동작하는지 확인

3. **[Seed] 타로 상품 시드**
   - `pnpm seed:products` 실행 (사주 + 타로 3종 upsert)
   - `products` 에 `tarot-daily`(990) / `tarot-inner-mind`(2970) / `tarot-relationship`(4950)
     이 `service_type='tarot'` 로 들어갔는지 확인
   - `/products` 목록에 타로가 섞이지 않는지, `/tarot` 에만 노출되는지 확인

4. **[회귀] 사주 결제 confirm 스모크**
   - 사주 상품 테스트 주문 → Toss(테스트키) 승인 → confirm → 사주 결과 생성까지
     기존과 동일하게 동작하는지 확인 (응답 `{ resultId }`, `/results/[id]` 이동)

5. **[신규] 타로 주문/결제 테스트**
   - `tarot-daily`(자동발행): 결제 → confirm → 즉시 `published` → `/tarot/result/[token]` 노출
   - `tarot-inner-mind`/`tarot-relationship`(검수형): 결제 → `drawn` 상태 → 고객은 '준비 중'
     → `/admin/readings` 에서 초안 생성 → 수정 → 발행 → 고객 노출 확인
   - 미결제·미발행 결과가 URL 만으로 노출되지 않는지 확인

6. **[배포] 운영 반영**
   - 위 1~5 모두 통과 후에만 Vercel 운영 배포 또는 트래픽 전환
   - 배포 직후 사주/타로 결제를 각각 1건씩 실제 확인

## 롤백 메모
- 코드만 롤백해도 `0009` 로 추가된 컬럼/테이블은 가산적이라 기존 사주 동작에 영향 없음.
- 단, 코드가 신규 컬럼을 읽으므로 **코드 롤백 시에도 마이그레이션은 유지**하는 것이 안전.
