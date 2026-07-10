// =====================================================
// Readings 공통 타입 — 서비스 무관 코어
// =====================================================
// Tarot MVP 에 실제로 필요한 범위만 정의한다.
// draw(뽑기형) 훅만 구현하며, compute/image/quiz 는 향후 서비스용으로
// 인터페이스 자리만 optional 로 남겨둔다(이번엔 미구현).

import type { z } from "zod";
import type { ServiceType, ReadingStatus } from "@/types/database";

export type { ServiceType, ReadingStatus };

// 뽑힌 카드 1장(뽑기형 서비스 공통: 타로/룬/오라클)
export type DrawnCard = {
  position: string; // 스프레드 포지션 라벨 (예: "상대의 속마음")
  cardId: string; // 카드 데이터의 id
  orientation: "upright" | "reversed";
};

// 드로우 기록 — 동일 결과 재현/조작방지용 seed 포함
export type DrawRecord = {
  seed: string;
  spread: string;
  cards: DrawnCard[];
};

// AI 결과 표준 JSON 계약(모든 리딩 서비스 공통 출력 형태)
export type ReadingResult = {
  title: string;
  summary: string;
  sections: {
    position: string;
    cardName?: string;
    orientation?: "upright" | "reversed";
    interpretation: string;
  }[];
  advice: string;
  closing: string;
};

// 발행 정책 — 자동발행 vs 관리자 검수 후 발행
export type PublishPolicy = "auto" | "review";

// 프롬프트 빌드에 필요한 문맥
export type PromptContext = {
  productSlug: string;
  productName: string;
  question: string | null;
  draw: DrawRecord;
};

export type BuiltPrompt = {
  system: string;
  user: string;
  version: string;
};

// 서비스 모듈 인터페이스.
// 이번 구현은 tarot 하나. requiresDraw=true 인 뽑기형만 실제 동작한다.
export interface ReadingService<Input = unknown> {
  type: ServiceType;
  // 입력 검증(타로: { question, spread })
  inputSchema: z.ZodType<Input>;
  // 뽑기형 여부. false 인 서비스(계산/문답/이미지형)는 이번에 미구현.
  requiresDraw: boolean;
  // seed 기반 결정적 드로우(중복방지·정역·포지션 부여). 서버에서만 호출.
  draw(input: Input, seed: string): DrawRecord;
  // 상품 slug 로 스프레드 종류 결정(드로우에 필요)
  buildPrompt(ctx: PromptContext): BuiltPrompt;
  // 상품별 발행 정책
  publishPolicy(productSlug: string): PublishPolicy;
  // 카드 id → 표시 이름(결과 렌더/프롬프트용)
  cardName(cardId: string): string;
}

export const READING_STATUS: Record<Uppercase<ReadingStatus>, ReadingStatus> = {
  DRAWN: "drawn",
  GENERATING: "generating",
  DRAFT: "draft",
  PUBLISHED: "published",
  FAILED: "failed",
};
