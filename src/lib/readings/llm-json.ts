// =====================================================
// LLM JSON 생성 래퍼 — 기존 사주 LLM 호출기(llm.ts)를 그대로 재사용
// =====================================================
// 사주 계산 로직과 완전히 분리된 순수 LLM 호출부만 재사용한다.
// JSON 파싱 실패 시 제한된 횟수만큼 재시도하고, 원본/모델/프롬프트버전을 함께 반환.

import { z } from "zod";
import { generateInterpretation } from "@/lib/saju/llm";
import type { BuiltPrompt } from "./types";

export type LlmJsonResult<T> = {
  parsed: T | null;
  raw: string; // LLM 원본 텍스트(파싱 전)
  provider: string;
  model: string;
  promptVersion: string;
  error?: string;
};

// ```json ... ``` 코드펜스나 앞뒤 잡텍스트를 제거하고 JSON 본문만 추출
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return text.slice(first, last + 1);
  }
  return text.trim();
}

export async function generateJson<T>(
  prompt: BuiltPrompt,
  schema: z.ZodType<T>,
  opts: { maxRetries?: number } = {},
): Promise<LlmJsonResult<T>> {
  const maxRetries = opts.maxRetries ?? 2;
  let lastRaw = "";
  let provider = "";
  let model = "";
  let lastError = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // 재시도 시 JSON 규칙을 좀 더 강하게 덧붙인다.
    const userMsg =
      attempt === 0
        ? prompt.user
        : `${prompt.user}\n\n[중요] 반드시 유효한 JSON 객체 하나만 출력하세요. 코드펜스나 설명 문장을 덧붙이지 마세요.`;

    const res = await generateInterpretation({ system: prompt.system, user: userMsg });
    lastRaw = res.text;
    provider = res.provider;
    model = res.model;

    try {
      const jsonText = extractJson(res.text);
      const obj = JSON.parse(jsonText);
      const validated = schema.parse(obj);
      return {
        parsed: validated,
        raw: res.text,
        provider,
        model,
        promptVersion: prompt.version,
      };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      // 다음 시도로
    }
  }

  return {
    parsed: null,
    raw: lastRaw,
    provider,
    model,
    promptVersion: prompt.version,
    error: `JSON 파싱/검증 실패 (${maxRetries + 1}회 시도): ${lastError}`,
  };
}
