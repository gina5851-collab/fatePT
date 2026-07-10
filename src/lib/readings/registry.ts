// =====================================================
// 리딩 서비스 레지스트리 — service_type → 모듈
// =====================================================
// 신규 서비스 추가 시 여기 한 줄만 등록하면 엔진/라우트/어드민이 인식한다.
// 현재 등록: tarot 하나. (oracle/runes/astrology/mbti 등은 향후 추가)

import type { ReadingService, ServiceType } from "./types";
import { tarotService } from "./services/tarot";

const REGISTRY: Partial<Record<ServiceType, ReadingService<unknown>>> = {
  tarot: tarotService as ReadingService<unknown>,
};

export function getReadingService(type: string): ReadingService<unknown> | null {
  return REGISTRY[type as ServiceType] ?? null;
}

export function isReadingService(type: string): boolean {
  return getReadingService(type) !== null;
}

// UI/어드민 필터용 — 현재 활성 서비스 목록
export function activeReadingServiceTypes(): ServiceType[] {
  return Object.keys(REGISTRY) as ServiceType[];
}
