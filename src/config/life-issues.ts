// =====================================================
// "생활문제 → 추천 G" 매핑 — 홈 Hero 직후 chip 진입 + 별도 기획전 섹션 참조.
// 정적 데이터. DB 무관.
// =====================================================

export type LifeIssue = {
  id: string;
  issue: string;        // "요즘 화장이 안 받아요"
  category_slug: string; // → /categories/{slug}
  emoji: string;
};

export const LIFE_ISSUES: LifeIssue[] = [
  { id: "skin-dry",       issue: "요즘 화장이 안 받아요",       category_slug: "good-skin",       emoji: "💧" },
  { id: "sleep-bad",      issue: "잠을 푹 못 자요",            category_slug: "good-recovery",   emoji: "🛁" },
  { id: "leg-heavy",      issue: "오후만 되면 다리가 무거워요",   category_slug: "good-balance",    emoji: "🌬️" },
  { id: "supplements",    issue: "영양제 챙기는 게 어려워요",     category_slug: "good-health",     emoji: "🌿" },
  { id: "period-cycle",   issue: "생리 전후 컨디션이 흔들려요",   category_slug: "good-inner-care", emoji: "🌸" },
  { id: "scalp-itchy",    issue: "두피가 답답해요",            category_slug: "good-skin",       emoji: "💧" },
  { id: "tired-evening",  issue: "퇴근하고 풀어지질 않아요",     category_slug: "good-recovery",   emoji: "🛁" },
  { id: "immune",         issue: "환절기 면역이 걱정돼요",       category_slug: "good-health",     emoji: "🌿" },
];

// 기획전 (큰 매거진 카드용) — 묶음 단위.
export type LifeIssuePlan = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  category_slug: string;
  productSlugs: string[];
  cover: string; // gradient classes for cover
};

export const LIFE_ISSUE_PLANS: LifeIssuePlan[] = [
  {
    id: "monthly-rescue",
    eyebrow: "한 달 케어 키트",
    title: "생리 전후, 컨디션 미리 잡는 한 달",
    body: "유산균·이너밸런스·Y존 케어를 묶어서, 흔들리는 주간에 의지가 되는 키트.",
    category_slug: "good-inner-care",
    productSlugs: ["inner-lactobacillus", "inner-daily-care-capsule", "inner-y-zone-serum"],
    cover: "from-rose-300 via-pink-400 to-fuchsia-500",
  },
  {
    id: "office-leg-care",
    eyebrow: "오피스 다리 케어",
    title: "앉아 있는 하루, 가벼움을 만드는 3종",
    body: "부기 캡슐 + 종아리 크림 + 마사지 롤러. 책상 옆에 두는 루틴.",
    category_slug: "good-balance",
    productSlugs: ["balance-edema-capsule", "balance-calf-cream", "balance-massage-roller"],
    cover: "from-sky-300 via-blue-400 to-indigo-500",
  },
  {
    id: "sunday-night-spa",
    eyebrow: "일요일 밤 홈스파",
    title: "주말의 마무리를 풀어주는 20분",
    body: "입욕솔트 + 클레이 마스크 + 라벤더 디퓨저. 한 번에 끝나는 자기 돌봄.",
    category_slug: "good-recovery",
    productSlugs: ["recovery-bath-salt", "recovery-clay-mask", "recovery-lavender-diffuser"],
    cover: "from-purple-300 via-pink-400 to-rose-500",
  },
];
