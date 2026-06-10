// "G 연구소" — 콘텐츠 매거진. 그라데이션 대신 SVG scene (인물+패키지) 카드.

type Scene = "skinRoutine" | "supplements" | "homespa" | "stretching" | "menopause";

const POSTS: Array<{ eyebrow: string; title: string; summary: string; author: string; readingTime: string; scene: Scene; bg: string; ink: string }> = [
  { eyebrow: "동안이G LAB", title: "스킨케어, 빼는 단계부터", summary: "30대 후반 이후엔 더하기보다 정리. 첫 3단계 만들기.", author: "지나 ED", readingTime: "4분", scene: "skinRoutine",  bg: "#E5EDF1", ink: "#2C3E50" },
  { eyebrow: "건강이G LAB", title: "영양제 첫걸음 5종",      summary: "필요한 것부터, 3개월만 진심으로 먹어보기.",            author: "건강팀", readingTime: "6분", scene: "supplements",  bg: "#EBEFE0", ink: "#3A4A2C" },
  { eyebrow: "힐링이G LAB", title: "일요일 밤 30분 회복",      summary: "20분 욕조 + 5분 클레이로 끝나는 자기 돌봄.",         author: "지나 ED", readingTime: "5분", scene: "homespa",      bg: "#EFE4EE", ink: "#4A3A5C" },
  { eyebrow: "가벼워지G LAB", title: "5분 부기 케어 루틴",     summary: "스트레칭 + 마사지 = 다음 날 가벼운 다리.",          author: "운동팀", readingTime: "4분", scene: "stretching",   bg: "#E1E8EE", ink: "#2C3A52" },
  { eyebrow: "편안하G LAB", title: "갱년기, 미리 준비하기",     summary: "40 전후, 이너밸런스부터 살짝 챙겨 두세요.",          author: "닥터노트", readingTime: "7분", scene: "menopause",    bg: "#F1E2E9", ink: "#5A2E48" },
];

export function GLab() {
  return (
    <section className="container py-10 border-t border-hairline">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1">G LAB</p>
          <h2 className="text-[20px] md:text-[24px] font-bold text-ink">G 연구소</h2>
          <p className="mt-1 text-[12px] text-body">40+ 자기관리의 작은 정답.</p>
        </div>
      </div>

      <div className="-mx-4 px-4 overflow-x-auto">
        <div className="flex gap-3 pb-3">
          {POSTS.map((p) => (
            <article key={p.title} className="block w-[260px] shrink-0">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden" style={{ backgroundColor: p.bg }}>
                <SceneSVG scene={p.scene} ink={p.ink} />
                <span className="absolute top-2.5 left-2.5 rounded bg-white/95 text-[10px] font-bold text-ink px-2 py-0.5 z-10">
                  {p.eyebrow}
                </span>
                <span className="absolute bottom-2.5 right-2.5 rounded bg-black/55 text-[10px] text-white font-mono px-2 py-0.5 z-10">
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

function SceneSVG({ scene, ink }: { scene: Scene; ink: string }) {
  if (scene === "skinRoutine") {
    // 거울 앞 인물 실루엣 + 세럼 병
    return (
      <svg viewBox="0 0 260 195" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax meet">
        {/* mirror frame */}
        <rect x="40" y="20" width="100" height="130" rx="50" fill="#FBFAF7" stroke={ink} strokeWidth="2" opacity="0.85" />
        {/* face silhouette inside mirror */}
        <circle cx="90" cy="70" r="22" fill={ink} opacity="0.5" />
        <path d="M68 100 Q 90 95 112 100 L 116 135 L 64 135 Z" fill={ink} opacity="0.5" />
        {/* serum bottle on the right */}
        <rect x="178" y="80" width="38" height="60" rx="3" fill={ink} opacity="0.85" />
        <rect x="186" y="68" width="22" height="14" rx="2" fill={ink} />
        <rect x="184" y="94" width="26" height="34" rx="1" fill="#FBFAF7" />
        <text x="197" y="115" textAnchor="middle" fontSize="6" fontWeight="700" fill={ink} fontFamily="ui-monospace, monospace">VITA C</text>
        {/* counter line */}
        <line x1="20" y1="160" x2="240" y2="160" stroke={ink} strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }
  if (scene === "supplements") {
    // 5 capsules in a row
    return (
      <svg viewBox="0 0 260 195" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax meet">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${30 + i * 44} ${78 + (i % 2 === 0 ? 0 : 12)})`}>
            <rect x="0" y="0" width="36" height="20" rx="10" fill={ink} opacity={0.55 + (i % 3) * 0.1} />
            <rect x="0" y="0" width="18" height="20" rx="10" fill={ink} />
            <circle cx="9" cy="8" r="2" fill="#FBFAF7" opacity="0.6" />
          </g>
        ))}
        {/* table line */}
        <line x1="20" y1="150" x2="240" y2="150" stroke={ink} strokeWidth="1" opacity="0.4" />
        {/* a small bottle */}
        <rect x="180" y="40" width="44" height="56" rx="3" fill={ink} opacity="0.4" />
        <rect x="186" y="32" width="32" height="10" rx="2" fill={ink} opacity="0.85" />
      </svg>
    );
  }
  if (scene === "homespa") {
    // bathtub silhouette + candle
    return (
      <svg viewBox="0 0 260 195" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax meet">
        {/* bathtub */}
        <path d="M30 100 Q 30 86 50 86 L 200 86 Q 220 86 220 100 L 220 140 Q 220 160 200 160 L 50 160 Q 30 160 30 140 Z" fill={ink} opacity="0.55" />
        {/* water */}
        <rect x="50" y="100" width="150" height="46" fill="#FBFAF7" opacity="0.55" />
        <path d="M50 110 Q 70 106 90 110 T 130 110 T 170 110 T 200 110 L 200 130 L 50 130 Z" fill={ink} opacity="0.15" />
        {/* candle */}
        <rect x="232" y="100" width="14" height="46" fill={ink} opacity="0.75" />
        <path d="M239 96 Q 237 88 239 84 Q 241 88 239 96 Z" fill={ink} />
        {/* legs */}
        <rect x="50" y="160" width="8" height="14" fill={ink} opacity="0.7" />
        <rect x="200" y="160" width="8" height="14" fill={ink} opacity="0.7" />
      </svg>
    );
  }
  if (scene === "stretching") {
    // person stretching + roller
    return (
      <svg viewBox="0 0 260 195" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax meet">
        {/* roller */}
        <rect x="22" y="150" width="216" height="14" rx="7" fill={ink} opacity="0.55" />
        <ellipse cx="24" cy="157" rx="4" ry="9" fill={ink} />
        <ellipse cx="236" cy="157" rx="4" ry="9" fill={ink} />
        {/* leg silhouette (calf on roller) */}
        <path d="M90 60 Q 110 50 130 65 L 150 130 Q 152 150 130 152 L 90 152 Q 80 152 80 140 L 80 90 Q 80 70 90 60 Z" fill={ink} opacity="0.55" />
        {/* foot */}
        <ellipse cx="115" cy="156" rx="14" ry="5" fill={ink} opacity="0.7" />
        {/* arrow indicating motion */}
        <path d="M180 80 Q 200 70 220 80" fill="none" stroke={ink} strokeWidth="2" opacity="0.6" />
        <path d="M218 78 L 222 82 L 215 86 Z" fill={ink} opacity="0.6" />
      </svg>
    );
  }
  // menopause — calendar + capsule
  return (
    <svg viewBox="0 0 260 195" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax meet">
      {/* calendar */}
      <rect x="40" y="40" width="120" height="110" rx="6" fill="#FBFAF7" stroke={ink} strokeWidth="2" opacity="0.85" />
      <rect x="40" y="40" width="120" height="22" rx="6" fill={ink} opacity="0.85" />
      {[0, 1, 2].map((row) => (
        [0, 1, 2, 3, 4].map((col) => (
          <circle key={`${row}-${col}`} cx={56 + col * 22} cy={78 + row * 20} r="3" fill={ink} opacity={0.3 + (row * 5 + col) * 0.05} />
        ))
      )).flat()}
      <circle cx={120} cy={118} r="6" fill={ink} />
      {/* capsule */}
      <rect x="180" y="90" width="60" height="24" rx="12" fill={ink} opacity="0.55" />
      <rect x="180" y="90" width="30" height="24" rx="12" fill={ink} />
    </svg>
  );
}
