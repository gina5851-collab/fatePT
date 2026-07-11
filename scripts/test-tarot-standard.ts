// =====================================================
// 타로 기준 v1 자동 검증 — pnpm test:tarot
// =====================================================
// DB 없이 순수 로직만 검증한다 (드로우/스프레드/스키마/단일 소스/가격 규칙).

import { readFileSync } from "node:fs";
import {
  TAROT_PRODUCTS,
  getTarotProduct,
  allowedSpreads,
  LEGACY_TAROT_SLUG_MAP,
  legacyTarotSlugFor,
  expandSlugsWithLegacy,
  pickRowForSlug,
} from "../src/lib/readings/services/tarot/config";
import { SPREADS } from "../src/lib/readings/services/tarot/spreads";
import { tarotService, tarotInputSchema } from "../src/lib/readings/services/tarot";
import { productsSeed } from "../src/config/products.seed";

let failed = 0;
function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "✓" : "✗"} ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failed++;
}

// ── 1. 기준 v1 상품 값 (단일 소스 자체 검증) ──
const std = {
  "tarot-one-card": { name: "원 카드 타로", price: 1000, originalPrice: undefined, cardCount: 1, publish: "auto" },
  "tarot-three-card": { name: "3 카드 타로", price: 3800, originalPrice: undefined, cardCount: 3, publish: "auto" },
  "tarot-celtic-cross": { name: "켈틱 크로스 타로", price: 5800, originalPrice: 8700, cardCount: 10, publish: "auto" },
} as const;

check("타로 상품이 정확히 3종", TAROT_PRODUCTS.length === 3);
for (const [slug, e] of Object.entries(std)) {
  const p = getTarotProduct(slug);
  check(`${slug} 존재`, !!p);
  if (!p) continue;
  check(`${slug} 이름='${e.name}'`, p.name === e.name, p.name);
  check(`${slug} 판매가=${e.price}`, p.price === e.price, String(p.price));
  check(`${slug} 정상가=${e.originalPrice ?? "없음"}`, p.originalPrice === e.originalPrice, String(p.originalPrice));
  check(`${slug} 카드수=${e.cardCount}`, p.cardCount === e.cardCount, String(p.cardCount));
  check(`${slug} 자동 발행`, p.publish === e.publish, p.publish);
  check(`${slug} 카드수=스프레드 포지션 수`, SPREADS[p.spread].length === p.cardCount);
}

// ── 2. 드로우 — 장수 정확 + 중복 없음 (시드 다수) ──
const SEEDS = ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8", "i9", "j10"];
for (const [slug, spread, n] of [
  ["tarot-one-card", "daily", 1],
  ["tarot-three-card", "three-card-time", 3],
  ["tarot-three-card", "three-card-relation", 3],
  ["tarot-three-card", "three-card-flow", 3],
  ["tarot-celtic-cross", "celtic-cross", 10],
] as const) {
  let allOk = true;
  let dupFree = true;
  for (const seed of SEEDS) {
    const d = tarotService.draw!({ question: null, spread }, `${slug}-${seed}`);
    if (d.cards.length !== n) allOk = false;
    if (new Set(d.cards.map((c) => c.cardId)).size !== d.cards.length) dupFree = false;
  }
  check(`${spread}: ${n}장 정확히 드로우 (${SEEDS.length}회)`, allOk);
  check(`${spread}: 중복 카드 없음 (${SEEDS.length}회)`, dupFree);
}

// ── 3. 켈틱 크로스 포지션 1~10 순서 고정 ──
const CELTIC_EXPECTED = [
  "현재 상황", "도전 또는 장애물", "의식적 목표", "무의식 또는 기반", "과거의 영향",
  "가까운 미래", "나의 접근 방식", "외부 영향", "희망과 두려움", "최종 결과",
];
check(
  "켈틱 크로스 포지션 정의 순서 = 기준 v1",
  JSON.stringify(SPREADS["celtic-cross"].map((p) => p.label)) === JSON.stringify(CELTIC_EXPECTED),
);
for (const seed of SEEDS.slice(0, 3)) {
  const d = tarotService.draw!({ question: null, spread: "celtic-cross" }, seed);
  check(
    `켈틱 드로우 포지션 순서 고정 (seed=${seed})`,
    JSON.stringify(d.cards.map((c) => c.position)) === JSON.stringify(CELTIC_EXPECTED),
  );
}

// ── 4. 잘못된 spreadKind 거부 ──
check("스키마: 구 spread 'inner-mind' 거부", !tarotInputSchema.safeParse({ question: null, spread: "inner-mind" }).success);
check("스키마: 구 spread 'relationship' 거부", !tarotInputSchema.safeParse({ question: null, spread: "relationship" }).success);
check("스키마: 임의 spread 'foo' 거부", !tarotInputSchema.safeParse({ question: null, spread: "foo" }).success);
const three = getTarotProduct("tarot-three-card")!;
const one = getTarotProduct("tarot-one-card")!;
check("3카드 허용 스프레드 = 3구성", JSON.stringify(allowedSpreads(three).sort()) === JSON.stringify(["three-card-flow", "three-card-relation", "three-card-time"]));
check("원카드에 celtic-cross 비허용", !(allowedSpreads(one) as string[]).includes("celtic-cross"));
// 주문 API 로직과 동일한 규칙: 허용 외 값은 기본 스프레드로 대체
const pick = (p: typeof three, kind: string) => ((allowedSpreads(p) as string[]).includes(kind) ? kind : p.spread);
check("주문 규칙: 원카드에 'celtic-cross' 요청 → 기본 'daily'", pick(one, "celtic-cross") === "daily");
check("주문 규칙: 3카드에 '나/상대/관계' 요청 → 반영", pick(three, "three-card-relation") === "three-card-relation");

// ── 5. 가격 규칙 — originalPrice 는 결제 금액에 쓰이지 않는다 ──
for (const tp of TAROT_PRODUCTS) {
  const seedRow = productsSeed.find((s) => s.slug === tp.slug);
  check(`seed: ${tp.slug} price=${tp.price} (판매가만 DB로)`, seedRow?.price === tp.price, String(seedRow?.price));
  check(`seed: ${tp.slug} 에 originalPrice 미포함`, seedRow != null && !("originalPrice" in seedRow) && !("original_price" in (seedRow as object)));
}
const orderRoute = readFileSync("src/app/api/readings/[service]/orders/route.ts", "utf8");
check("주문 API: amount 는 DB product.price 사용", orderRoute.includes("amount: product.price"));
check("주문 API: originalPrice 미참조", !orderRoute.includes("originalPrice"));
const confirmRoute = readFileSync("src/app/api/orders/confirm/route.ts", "utf8");
check("confirm API: originalPrice 미참조", !confirmRoute.includes("originalPrice"));
check("confirm API: DB 주문 금액 검증 유지", confirmRoute.includes("order.amount !== amount"));

// ── 6. 무중단 전환 — DB 상태 모의 테스트 ──
type Row = { id: string; slug: string; price: number; is_active: boolean; service_type: string };
const NEW_SLUGS = ["tarot-one-card", "tarot-three-card", "tarot-celtic-cross"] as const;

// 매핑 무결성
check("LEGACY 매핑 3건 정확", JSON.stringify(LEGACY_TAROT_SLUG_MAP) === JSON.stringify({
  "tarot-daily": "tarot-one-card",
  "tarot-inner-mind": "tarot-three-card",
  "tarot-relationship": "tarot-celtic-cross",
}));
check("구 slug 는 UI 상품 정의(TAROT_PRODUCTS)에 미포함",
  TAROT_PRODUCTS.every((p) => !(p.slug in LEGACY_TAROT_SLUG_MAP)));

// [상태 A] SQL 실행 전 — DB 에 구 slug 행만 존재 (운영 현재 가격 그대로)
const DB_A: Row[] = [
  { id: "old-1", slug: "tarot-daily", price: 990, is_active: true, service_type: "tarot" },
  { id: "old-3", slug: "tarot-inner-mind", price: 2970, is_active: true, service_type: "tarot" },
  { id: "old-10", slug: "tarot-relationship", price: 4950, is_active: true, service_type: "tarot" },
];
for (const s of NEW_SLUGS) {
  const pick = pickRowForSlug(s, DB_A);
  check(`[A·SQL 전] 신 slug '${s}' → 구 DB 행 fallback 조회 성공`, !!pick.row && pick.usedLegacy);
  check(`[A·SQL 전] '${s}' 주문은 구 product_id·DB price 사용`,
    pick.row?.id === DB_A.find((r) => r.slug === legacyTarotSlugFor(s))?.id &&
    pick.row?.price === DB_A.find((r) => r.slug === legacyTarotSlugFor(s))?.price);
}

// [상태 B] SQL 실행 후 — DB 에 신 slug 행만 존재 (기준 v1 가격)
const DB_B: Row[] = [
  { id: "old-1", slug: "tarot-one-card", price: 1000, is_active: true, service_type: "tarot" },
  { id: "old-3", slug: "tarot-three-card", price: 3800, is_active: true, service_type: "tarot" },
  { id: "old-10", slug: "tarot-celtic-cross", price: 5800, is_active: true, service_type: "tarot" },
];
for (const s of NEW_SLUGS) {
  const pick = pickRowForSlug(s, DB_B);
  check(`[B·SQL 후] 신 slug '${s}' → 신 DB 행 직접 조회 (fallback 미사용)`, !!pick.row && !pick.usedLegacy && !pick.warning);
}
check("[B·SQL 후] 주문 금액 = 신 DB price (1000/3800/5800)",
  NEW_SLUGS.every((s, i) => pickRowForSlug(s, DB_B).row?.price === [1000, 3800, 5800][i]));

// [비정상] 신·구 동시 존재 → 신 slug 우선 + 경고
const DB_BOTH: Row[] = [...DB_A, ...DB_B.map((r) => ({ ...r, id: `dup-${r.id}` }))];
{
  const pick = pickRowForSlug("tarot-one-card", DB_BOTH);
  check("[동시 존재] 신 slug 행 우선 사용", pick.row?.slug === "tarot-one-card" && !pick.usedLegacy);
  check("[동시 존재] 경고 기록", !!pick.warning);
}

// [없음] 둘 다 없으면 명확한 상품 없음
check("[없음] 신·구 모두 없으면 row=null", pickRowForSlug("tarot-one-card", []).row === null);

// 사주 상품 영향 0 — legacy 매핑 비대상, 확장·선택 로직이 기존과 동일
check("사주: expandSlugsWithLegacy 는 사주 slug 를 확장하지 않음",
  JSON.stringify(expandSlugsWithLegacy(["inbody", "premium-saju", "crush-kit"])) ===
  JSON.stringify(["inbody", "premium-saju", "crush-kit"]));
const SAJU_ROW: Row = { id: "s1", slug: "inbody", price: 4900, is_active: true, service_type: "saju" };
check("사주: 정상 조회 동작 동일", pickRowForSlug("inbody", [SAJU_ROW]).row?.id === "s1");
check("사주: 없으면 null (fallback 없음)", pickRowForSlug("inbody", []).row === null);

// 호환 조회가 실제 적용됐는지 — 소스 검사
check("주문 API: fallback 조회 적용", orderRoute.includes("expandSlugsWithLegacy") && orderRoute.includes("pickRowForSlug"));
check("주문 API: 상품 설정은 신 slug 기준", orderRoute.includes("getTarotProduct(body.productSlug)"));
const catalogDb = readFileSync("src/lib/catalog-db.ts", "utf8");
check("catalog-db: fallback 조회 적용", catalogDb.includes("expandSlugsWithLegacy") && catalogDb.includes("pickRowForSlug"));

// ── 7. 결제 후 자동 발행 — 구 slug 주문 회귀 테스트 ──
// 장애 재현: 구 slug 행(fallback)으로 생성된 주문은 confirm 시 DB slug 가 구 slug 로
// 조회된다. publishPolicy 가 구 slug 를 모르면 'review' 로 오판 → LLM 생성·발행이
// 실행되지 않아 결과가 영구 '준비 중' 으로 남는다. (990원 실결제 장애 원인)
for (const [legacy, next] of Object.entries(LEGACY_TAROT_SLUG_MAP)) {
  check(`구 slug '${legacy}' → 상품 설정 정규화 조회`, getTarotProduct(legacy)?.slug === next);
  check(`구 slug '${legacy}' 발행정책 = auto (자동 발행)`, tarotService.publishPolicy(legacy) === "auto");
}
check("미등록 slug 발행정책 = review (안전 기본값 유지)", tarotService.publishPolicy("unknown-slug") === "review");

// paid 주문 자동 복구 + 결과 URL 명시 — 소스 검사
check("confirm: paid 주문 미발행 리딩 자동 복구", /alreadyPaid[\s\S]*runPaidReading|runPaidReading[\s\S]*alreadyPaid/.test(confirmRoute));
check("confirm: 응답에 resultUrl 명시", confirmRoute.includes("resultUrl"));
const mypageOrders = readFileSync("src/app/mypage/orders/page.tsx", "utf8");
check("마이페이지: 타로 결과 링크 존재", mypageOrders.includes("/tarot/result/"));

// ── 8. 사용자 결과 복구 API — 보안·idempotent 검증 ──
// 관리자 로그인 없이 결제한 본인이 미발행 리딩을 복구한다. 결제·주문·드로우는
// 절대 새로 만들지 않는다 (990원 실결제 장애 복구 경로).
const recoverRoute = readFileSync("src/app/api/readings/[service]/recover/route.ts", "utf8");
check("recover: 로그인 세션 필수 (401)", recoverRoute.includes("getUser") && recoverRoute.includes("401"));
check("recover: 본인 주문만 (user_id 일치, 403)", recoverRoute.includes("order.user_id !== user.id") && recoverRoute.includes("403"));
check("recover: paid 아닌 주문 거부 (409)", recoverRoute.includes('order.status !== "paid"') && recoverRoute.includes("409"));
check("recover: published 는 기존 결과 반환 (재생성 없음)",
  recoverRoute.includes('"published"') && recoverRoute.includes("recovered: false"));
check("recover: generating 은 중복 생성 없이 진행 상태 반환", recoverRoute.includes('"generating"'));
check("recover: 엔진 재사용 — 직접 draw/INSERT 없음",
  recoverRoute.includes("runPaidReading") && !recoverRoute.includes(".draw(") && !recoverRoute.includes(".insert("));
check("recover: Toss 결제 승인 재호출 없음", !recoverRoute.includes("confirmTossPayment"));
check("recover: 리딩 서비스 한정 (사주 무영향)", recoverRoute.includes("isReadingService"));

// idempotent 근거 — 엔진과 스키마
const engineSrc = readFileSync("src/lib/readings/engine.ts", "utf8");
check("engine: 기존 드로우 재사용 (재드로우 없음)", engineSrc.includes("existing?.draw_record"));
check("engine: readings upsert onConflict order_id", engineSrc.includes('onConflict: "order_id"'));
const readingsMigration = readFileSync("supabase/migrations/0009_readings.sql", "utf8");
check("스키마: readings.order_id unique (물리적 중복 불가)", /order_id uuid not null unique/.test(readingsMigration));

// 사용자 화면 — 상태별 버튼
check("마이페이지: 복구 버튼(미발행) 분기", mypageOrders.includes("TarotRecoverButton"));
check("마이페이지: 생성 중 표시 분기", mypageOrders.includes("결과 생성 중"));
check("마이페이지: published 만 결과 보기 링크", mypageOrders.includes('=== "published"'));
const resultPage = readFileSync("src/app/tarot/result/[publicToken]/page.tsx", "utf8");
check("결과 대기 페이지: 복구 동작 포함", resultPage.includes("TarotRecoverButton"));
const recoverButton = readFileSync("src/components/tarot/TarotRecoverButton.tsx", "utf8");
check("복구 버튼: 실패 시 재시도만 (재결제 유도 없음)",
  recoverButton.includes("다시 시도") &&
  !recoverButton.includes("결제하기") &&
  !recoverButton.includes("/checkout") &&
  !recoverButton.includes("/products/"));

// ── 결과 ──
if (failed > 0) {
  console.error(`\n✗ 실패 ${failed}건`);
  process.exit(1);
}
console.log("\n✓ 타로 기준 v1 검증 전부 통과");
