// =====================================================
// 타로 서비스 모듈 — ReadingService 구현체
// =====================================================
import { z } from "zod";
import type { ReadingService, DrawRecord, DrawnCard, PromptContext, BuiltPrompt, PublishPolicy } from "../../types";
import { createRng, seededShuffle } from "../../rng";
import { TAROT_CARDS, getCard } from "./cards";
import { getSpread } from "./spreads";
import { getTarotProduct } from "./config";
import { buildTarotPrompt } from "./prompt";

// 타로 입력 — 질문(선택)과 스프레드 종류 (기준 v1: 1장 / 3장 3구성 / 켈틱 10장)
export const tarotInputSchema = z.object({
  question: z.string().max(300).nullable(),
  spread: z.enum(["daily", "three-card-time", "three-card-relation", "three-card-flow", "celtic-cross"]),
});
export type TarotInput = z.infer<typeof tarotInputSchema>;

// 서버 드로우: 중복 방지 + 정/역방향 + 포지션 부여. seed 로 결정적 재현.
function drawTarot(input: TarotInput, seed: string): DrawRecord {
  const positions = getSpread(input.spread);
  const rng = createRng(seed);

  // 78장 셔플 후 필요한 수만큼 취함 → 중복 불가
  const shuffled = seededShuffle(TAROT_CARDS, rng);
  const picked = shuffled.slice(0, positions.length);
  // 방어적 검증 — 포지션 수만큼 뽑혔고 카드가 전부 서로 달라야 한다 (켈틱 10장 포함)
  if (picked.length !== positions.length || new Set(picked.map((c) => c.id)).size !== picked.length) {
    throw new Error(`타로 드로우 검증 실패: ${positions.length}장 요청, 고유 ${new Set(picked.map((c) => c.id)).size}장`);
  }

  const cards: DrawnCard[] = picked.map((card, i) => ({
    position: positions[i].label,
    cardId: card.id,
    // 정/역방향도 같은 rng 스트림에서 결정(재현 가능)
    orientation: rng() < 0.5 ? "reversed" : "upright",
  }));

  return { seed, spread: input.spread, cards };
}

export const tarotService: ReadingService<TarotInput> = {
  type: "tarot",
  inputSchema: tarotInputSchema,
  requiresDraw: true,
  draw: drawTarot,
  buildPrompt(ctx: PromptContext): BuiltPrompt {
    return buildTarotPrompt(ctx);
  },
  publishPolicy(productSlug: string): PublishPolicy {
    return getTarotProduct(productSlug)?.publish ?? "review";
  },
  cardName(cardId: string): string {
    const c = getCard(cardId);
    return c ? `${c.nameKo} (${c.nameEn})` : cardId;
  },
};
