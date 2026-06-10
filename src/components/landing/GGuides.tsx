import Link from "next/link";
import { G_CATEGORIES } from "@/config/categories";

const GUIDE_BY_SLUG: Record<string, { eyebrow: string; title: string; summary: string }> = {
  "good-skin": {
    eyebrow: "동안이G 입문",
    title: "스킨케어, 빼는 단계부터",
    summary: "30대 후반 이후엔 더하기보다 정리. 첫 3단계 만들기.",
  },
  "good-health": {
    eyebrow: "건강이G 가이드",
    title: "영양제 첫걸음 5종",
    summary: "필요한 것부터, 3개월만 진심으로 먹어보기.",
  },
  "good-recovery": {
    eyebrow: "힐링이G 루틴",
    title: "일요일 밤 30분 회복",
    summary: "욕조·클레이·향. 한 번에 끝나는 자기 돌봄.",
  },
  "good-balance": {
    eyebrow: "가벼워지G 노트",
    title: "5분 부기 케어 루틴",
    summary: "스트레칭+마사지로 다음 날 다리 가벼움.",
  },
  "good-inner-care": {
    eyebrow: "편안하G 가이드",
    title: "한 달 케어 리듬 만들기",
    summary: "유산균·이너밸런스·Y존 — 흔들리는 주간에.",
  },
};

// "5대 G 가이드" — 카테고리별 입문 매거진 카드 5개.
export function GGuides() {
  return (
    <section className="container py-12 border-t border-hairline">
      <div className="mb-5">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1.5">G GUIDES</p>
        <h2 className="text-[22px] md:text-[24px] font-bold text-ink">5대 G 가이드</h2>
        <p className="mt-1 text-[13px] text-body">처음이라면 — 각 G의 입문 루틴을 정리해 두었어요.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {G_CATEGORIES.map((c) => {
          const g = GUIDE_BY_SLUG[c.slug];
          if (!g) return null;
          return (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="group block rounded-2xl border border-hairline bg-canvas hover:border-ink transition-colors overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-surface-soft flex items-center justify-center text-3xl">
                  <span aria-hidden>{c.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono tracking-[0.2em] text-mute">{g.eyebrow}</p>
                  <p className="mt-0.5 text-[14px] font-bold text-ink leading-snug line-clamp-1">{g.title}</p>
                  <p className="mt-1 text-[11px] text-body leading-relaxed line-clamp-2">{g.summary}</p>
                </div>
                <span className="shrink-0 text-mute group-hover:text-ink transition-colors" aria-hidden>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
