"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { generateDraft, publishReading, unpublishReading, saveFinalResult } from "@/lib/readings/engine";
import { readingResultSchema } from "@/lib/readings/schema";

async function assertAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("관리자 인증이 필요합니다");
  }
}

function orderIdOf(formData: FormData): string {
  const id = String(formData.get("orderId") ?? "");
  if (!id) throw new Error("주문 id 가 누락되었습니다");
  return id;
}

// AI 초안 생성 / 재생성 (기존 초안 덮어씀)
// force: 관리자는 draft/published 등 상태 무관 재생성 — 자동 재개 경로의 claim 제한을 받지 않는다
export async function generateDraftAction(formData: FormData) {
  await assertAdmin();
  const orderId = orderIdOf(formData);
  await generateDraft(orderId, { force: true });
  revalidatePath(`/admin/readings/${orderId}`);
  revalidatePath("/admin/readings");
}

// 관리자 수정본 저장 (JSON textarea) — 발행하지 않음
export async function saveFinalAction(formData: FormData) {
  await assertAdmin();
  const orderId = orderIdOf(formData);
  const raw = String(formData.get("finalJson") ?? "");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("JSON 형식이 올바르지 않습니다");
  }
  const validated = readingResultSchema.parse(parsed);
  await saveFinalResult(orderId, validated);
  revalidatePath(`/admin/readings/${orderId}`);
}

// 검수 완료 → 발행 (수정본이 있으면 그걸, 없으면 초안을 최종본으로)
export async function publishAction(formData: FormData) {
  await assertAdmin();
  const orderId = orderIdOf(formData);
  await publishReading(orderId);
  revalidatePath(`/admin/readings/${orderId}`);
  revalidatePath("/admin/readings");
}

// 발행 취소 (고객 노출 중단)
export async function unpublishAction(formData: FormData) {
  await assertAdmin();
  const orderId = orderIdOf(formData);
  await unpublishReading(orderId);
  revalidatePath(`/admin/readings/${orderId}`);
  revalidatePath("/admin/readings");
}
