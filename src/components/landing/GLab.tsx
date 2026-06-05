// "G 연구소" — 40+ 자기관리 콘텐츠 카드. 정적 데모.
// 실제 콘텐츠 작성/라우팅은 별도 phase. 현재는 카드 UI만.

const G_LAB_POSTS = [
  {
    eyebrow: "동안이G",
    title: "30대 후반부터, 스킨케어는 빼는 싸움",
    summary: "단계는 줄이고 농도를 올리는 게 정답인 이유.",
    gradient: "from-sky-200 via-cyan-300 to-blue-400",
  },
  {
    eyebrow: "건강이G",
    title: "영양제 첫걸음 — 3개월만 진심으로",
    summary: "처음엔 5종만. 컨디션 기록과 함께 시작하세요.",
    gradient: "from-lime-200 via-emerald-300 to-green-500",
  },
  {
    eyebrow: "힐링이G",
    title: "일주일에 한 번, 홈스파 루틴",
    summary: "20분 욕조 + 5분 클레이로 끝나는 일요일 밤.",
    gradient: "from-purple-200 via-pink-300 to-rose-400",
  },
  {
    eyebrow: "가벼워지G",
    title: "5분 부기 케어, 자기 전 루틴",
    summary: "스트레칭 1세트 + 마사지 3분 = 다음 날 다리.",
    gradient: "from-sky-200 via-blue-300 to-indigo-400",
  },
  {
    eyebrow: "편안하G",
    title: "갱년기, 미리 준비하는 사람들",
    summary: "40 전후, 이너밸런스부터 살짝 챙겨 두세요.",
    gradient: "from-purple-200 via-violet-300 to-pink-400",
  },
];

export function GLab() {
  return (
    <section className="container py-12 border-t border-hairline">
      <div className="text-center mb-7">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1.5">G LAB</p>
        <h2 className="text-[20px] md:text-[22px] font-bold text-ink">G 연구소</h2>
        <p className="mt-2 text-[13px] text-body max-w-sm mx-auto">
          40+ 자기관리의 작은 정답을, 한 편씩 정리해 둘게요.
        </p>
      </div>

      <div className="-mx-4 px-4 overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {G_LAB_POSTS.map((p) => (
            <article
              key={p.title}
              className="group w-[240px] shrink-0 cursor-default"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-2.5 left-2.5 rounded bg-white/90 text-[10px] font-bold text-ink px-2 py-0.5">
                  {p.eyebrow}
                </span>
                <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white/90 text-[10px] font-mono text-ink px-2 py-0.5">
                  준비 중
                </span>
              </div>
              <p className="mt-2.5 text-[13px] font-semibold text-ink leading-snug line-clamp-2">{p.title}</p>
              <p className="mt-1 text-[11px] text-body leading-relaxed line-clamp-2">{p.summary}</p>
            </article>
          ))}
        </div>
      </div>

      <p className="text-center mt-5 text-[12px] text-mute">
        G 연구소 콘텐츠는 곧 열려요.
      </p>
    </section>
  );
}
