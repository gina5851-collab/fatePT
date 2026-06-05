import Link from "next/link";

// "G 연구소" — 40+ 자기관리 콘텐츠 매거진. 정적 데모.
// "준비 중" 라벨 제거. 실제 매거진 카드처럼 보이게 — 컬럼 / 읽는 시간 / 작가 표시.

const G_LAB_POSTS = [
  {
    eyebrow: "동안이G LAB",
    title: "30대 후반부터, 스킨케어는 빼는 싸움",
    summary: "단계는 줄이고 농도를 올리는 게 정답인 이유.",
    author: "지나 ED",
    readingTime: "4분",
    gradient: "from-sky-400 via-cyan-500 to-blue-600",
  },
  {
    eyebrow: "건강이G LAB",
    title: "영양제 첫걸음 — 3개월만 진심으로",
    summary: "처음엔 5종만. 컨디션 기록과 함께 시작하세요.",
    author: "건강팀",
    readingTime: "6분",
    gradient: "from-lime-400 via-emerald-500 to-green-600",
  },
  {
    eyebrow: "힐링이G LAB",
    title: "일주일에 한 번, 홈스파 루틴",
    summary: "20분 욕조 + 5분 클레이로 끝나는 일요일 밤.",
    author: "지나 ED",
    readingTime: "5분",
    gradient: "from-purple-400 via-pink-500 to-rose-600",
  },
  {
    eyebrow: "가벼워지G LAB",
    title: "5분 부기 케어, 자기 전 루틴",
    summary: "스트레칭 1세트 + 마사지 3분 = 다음 날 다리.",
    author: "운동팀",
    readingTime: "4분",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
  },
  {
    eyebrow: "편안하G LAB",
    title: "갱년기, 미리 준비하는 사람들",
    summary: "40 전후, 이너밸런스부터 살짝 챙겨 두세요.",
    author: "닥터노트",
    readingTime: "7분",
    gradient: "from-purple-400 via-violet-500 to-pink-600",
  },
];

export function GLab() {
  return (
    <section className="container py-12 border-t border-hairline">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1.5">G LAB</p>
          <h2 className="text-[22px] md:text-[24px] font-bold text-ink">G 연구소</h2>
          <p className="mt-1 text-[13px] text-body">40+ 자기관리의 작은 정답을 정리합니다.</p>
        </div>
      </div>

      <div className="-mx-4 px-4 overflow-x-auto">
        <div className="flex gap-3 pb-3">
          {G_LAB_POSTS.map((p) => (
            <article key={p.title} className="group block w-[260px] shrink-0 cursor-default">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_55%)]" />
                <span className="absolute top-2.5 left-2.5 rounded bg-white/95 text-[10px] font-bold text-ink px-2 py-0.5">
                  {p.eyebrow}
                </span>
                <span className="absolute bottom-2.5 right-2.5 rounded bg-black/40 text-[10px] text-white font-mono px-2 py-0.5">
                  {p.readingTime} READ
                </span>
              </div>
              <p className="mt-2.5 text-[13px] font-bold text-ink leading-snug line-clamp-2 min-h-[2.6em]">{p.title}</p>
              <p className="mt-1 text-[11px] text-body leading-relaxed line-clamp-2">{p.summary}</p>
              <p className="mt-1.5 text-[10px] text-mute font-mono">EDITOR · {p.author}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
