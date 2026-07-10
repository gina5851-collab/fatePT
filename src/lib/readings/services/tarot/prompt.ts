// =====================================================
// 타로 해석 프롬프트 빌더 — JSON 결과 계약
// =====================================================
// 사주 프롬프트(lib/saju/prompt.ts)와 완전히 분리. 타로 전용.
// AI 에는 상품유형·질문·스프레드·각 카드(이름/정역/포지션/키워드/의미)·문체·버전을 전달한다.

import type { BuiltPrompt, PromptContext } from "../../types";
import { getCard } from "./cards";
import { SPREADS, SPREAD_LABEL } from "./spreads";
import type { TarotSpreadKind } from "./config";

// 프롬프트 버전 — 프롬프트 구조/톤 변경 시 올린다. readings.prompt_version 에 저장.
// v2: 스프레드 라벨·포지션 의미 주입 + 카드 조합 종합·행동 조언 강화 (기준 v1: 1/3/10장)
export const TAROT_PROMPT_VERSION = "tarot-v2";

const SYSTEM = `당신은 FatePT의 타로 리더입니다. 뽑힌 카드를 근거로 따뜻하고 명료하게 이야기를 풀어냅니다.

원칙
- 반드시 제공된 카드의 이름·정역방향·포지션·키워드·의미에 근거해 해석합니다. 없는 카드를 지어내지 않습니다.
- 각 포지션에는 [포지션 의미]가 함께 제공됩니다. 그 의미의 자리에서 카드를 읽습니다.
- 단정적 예언이나 공포 조장을 하지 않습니다("반드시 헤어진다", "큰일 난다" 금지). 가능성·경향·조언으로 표현합니다.
- 한국어 존댓말로, 위로가 되면서도 현실적인 조언을 담습니다.
- 카드 하나하나의 해석에서 끝내지 말고, 카드들이 서로 어떻게 이어지는지(조합의 흐름)를 summary 와 advice 에서 종합합니다.
- advice 는 반드시 "지금 할 수 있는 구체적 행동"으로 끝냅니다.
- 질문이 있으면 그 질문에 답하는 방향으로 해석을 모읍니다.
- 10장 켈틱 크로스는 1→10 포지션의 서사(현재→장애물→목표→기반→과거→가까운 미래→접근→외부→희망과 두려움→최종 결과)를 하나의 이야기로 엮습니다.

반드시 아래 JSON 형식 '하나'만 출력합니다. 코드펜스나 설명 문장을 덧붙이지 마세요.
{
  "title": "리딩 제목(짧게)",
  "summary": "카드 조합 전체의 흐름 2-4문장 종합",
  "sections": [
    { "position": "포지션명", "cardName": "카드명(정/역)", "orientation": "upright|reversed", "interpretation": "이 포지션 의미 자리에서의 해석 3-5문장" }
  ],
  "advice": "카드 조합을 종합한 뒤, 지금 할 수 있는 구체적 행동 조언 2-4문장",
  "closing": "따뜻한 마무리 한두 문장"
}`;

export function buildTarotPrompt(ctx: PromptContext): BuiltPrompt {
  const spreadKind = ctx.draw.spread as TarotSpreadKind;
  const positions = SPREADS[spreadKind] ?? [];
  const hintByLabel = new Map(positions.map((p) => [p.label, p.hint]));

  const cardLines = ctx.draw.cards.map((c, i) => {
    const card = getCard(c.cardId);
    const ori = c.orientation === "upright" ? "정방향" : "역방향";
    const kws =
      card == null
        ? ""
        : (c.orientation === "upright" ? card.uprightKeywords : card.reversedKeywords).join(", ");
    const meaning =
      card == null ? "" : c.orientation === "upright" ? card.uprightMeaning : card.reversedMeaning;
    const name = card ? `${card.nameKo} (${card.nameEn})` : c.cardId;
    const hint = hintByLabel.get(c.position) ?? "";
    return `${i + 1}. [포지션] ${c.position}${hint ? `\n   - 포지션 의미: ${hint}` : ""}\n   - 카드: ${name} · ${ori}\n   - 키워드: ${kws}\n   - 의미: ${meaning}`;
  });

  const user = `[상품] ${ctx.productName}
[스프레드] ${SPREAD_LABEL[spreadKind] ?? ctx.draw.spread} (${ctx.draw.cards.length}장)
[고객 질문] ${ctx.question?.trim() ? ctx.question.trim() : "(질문 없음 — 지금 흐름 전반)"}

[뽑힌 카드]
${cardLines.join("\n")}

위 카드들을 근거로 각 포지션을 해석하고, 카드 조합의 흐름을 종합한 뒤 행동 조언으로 마무리하세요. 지정된 JSON 형식으로만 응답하고, sections 는 위 카드 순서·포지션과 정확히 일치해야 합니다.`;

  return { system: SYSTEM, user, version: TAROT_PROMPT_VERSION };
}
