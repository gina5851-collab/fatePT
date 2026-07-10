// =====================================================
// 리딩 결과 JSON 스키마 — 모든 서비스 공통 출력 계약
// =====================================================
import { z } from "zod";

export const readingResultSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  sections: z
    .array(
      z.object({
        position: z.string().min(1),
        cardName: z.string().optional(),
        orientation: z.enum(["upright", "reversed"]).optional(),
        interpretation: z.string().min(1),
      }),
    )
    .min(1),
  advice: z.string().min(1),
  closing: z.string().min(1),
});

export type ReadingResultParsed = z.infer<typeof readingResultSchema>;
