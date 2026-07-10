// =====================================================
// 안전 토큰 / seed 생성기 — 서비스 무관
// =====================================================
import { nanoid } from "nanoid";

// 고객 결과 URL 노출용 토큰. 내부 UUID 대신 이 값으로 조회한다.
// 추측 불가능하도록 충분히 긴 난수.
export function generatePublicToken(): string {
  return `rt_${nanoid(24)}`;
}

// 드로우 재현용 seed. draw_record 에 저장해 동일 결과를 재구성한다.
export function generateDrawSeed(): string {
  return nanoid(16);
}
