// =====================================================
// 타로 기준 v1 자동 검증 — pnpm test:tarot
// =====================================================
// DB 없이 순수 로직만 검증한다 (드로우/스프레드/스키마/단일 소스/가격 규칙).

import { readFileSync } from "node:fs";
import { TAROT_PRODUCTS, getTarotProduct, allowedSpreads } from "../src/lib/readings/services/tarot/config";
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

// ── 결과 ──
if (failed > 0) {
  console.error(`\n✗ 실패 ${failed}건`);
  process.exit(1);
}
console.log("\n✓ 타로 기준 v1 검증 전부 통과");
