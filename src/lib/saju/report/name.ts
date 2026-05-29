// 결과 페이지 개인화 이름 helper
// - 절대 고정 이름 하드코딩 금지. 항상 이 helper로 처리.
// - "님" 중복 방지(민지님 → 민지), 빈 값이면 "고객".

export function getDisplayName(input?: string | null): string {
  const name = input?.trim();
  if (!name) return "고객";
  return name.replace(/님$/, "");
}

// 문장에서 "{name}님" 으로 붙일 때 사용
export function formatName(input?: string | null): string {
  return `${getDisplayName(input)}님`;
}

// 이름 소스 우선순위 해석:
// 1) 결제/입력 이름  2) 사주 입력폼 name  3) orders/metadata name  → 없으면 null
export function resolveName(
  ...candidates: Array<string | null | undefined>
): string {
  for (const c of candidates) {
    if (c && c.trim()) return c.trim();
  }
  return ""; // getDisplayName이 "고객"으로 처리
}
