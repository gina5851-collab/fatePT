// =====================================================
// 운명PT 자체 제작 그래픽 (CSS/SVG) — 외부 이미지 미사용
// =====================================================
// 히어로·상품 카드·섹션 배경에 쓰는 장식 요소들.
// 모두 aria-hidden 장식이며 색은 골드/네이비 팔레트를 따른다.

const GOLD = "#e8a11c";
const GOLD_SOFT = "#f3c76b";

/** 사주 원형 명식 차트 — 동심원 + 12지 스포크 + 사방 표식 */
export function SajuWheel({ className = "" }: { className?: string }) {
  const spokes = Array.from({ length: 12 }, (_, i) => (i * Math.PI * 2) / 12);
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden fill="none">
      <circle cx="200" cy="200" r="192" stroke={GOLD} strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="200" cy="200" r="160" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.2" />
      <circle cx="200" cy="200" r="118" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 6" />
      <circle cx="200" cy="200" r="76" stroke={GOLD} strokeOpacity="0.6" strokeWidth="1.2" />
      <circle cx="200" cy="200" r="6" fill={GOLD} fillOpacity="0.9" />
      {spokes.map((a, i) => (
        <line
          key={i}
          x1={200 + Math.cos(a) * 76}
          y1={200 + Math.sin(a) * 76}
          x2={200 + Math.cos(a) * 160}
          y2={200 + Math.sin(a) * 160}
          stroke={GOLD}
          strokeOpacity={i % 3 === 0 ? 0.55 : 0.25}
          strokeWidth="1"
        />
      ))}
      {spokes.map((a, i) => (
        <circle
          key={`d${i}`}
          cx={200 + Math.cos(a) * 160}
          cy={200 + Math.sin(a) * 160}
          r={i % 3 === 0 ? 4 : 2.2}
          fill={i % 3 === 0 ? GOLD : GOLD_SOFT}
          fillOpacity={i % 3 === 0 ? 0.95 : 0.55}
        />
      ))}
      {/* 사방(년월일시) 표식 */}
      {["年", "月", "日", "時"].map((ch, i) => {
        const a = (i * Math.PI) / 2 - Math.PI / 2;
        return (
          <text
            key={ch}
            x={200 + Math.cos(a) * 138}
            y={200 + Math.sin(a) * 138 + 5}
            textAnchor="middle"
            fontSize="15"
            fill={GOLD_SOFT}
            fillOpacity="0.85"
            fontFamily="serif"
          >
            {ch}
          </text>
        );
      })}
    </svg>
  );
}

/** 밤하늘 별밭 — 랜덤 대신 고정 좌표(빌드 안정) */
const STARS: [number, number, number][] = [
  [24, 30, 1.6], [80, 14, 1], [150, 44, 2], [210, 20, 1.2], [280, 52, 1.6],
  [340, 24, 1], [385, 70, 2.2], [50, 90, 1], [120, 110, 1.4], [250, 96, 1],
  [310, 120, 1.8], [368, 150, 1], [20, 160, 1.9], [90, 180, 1], [180, 154, 1.3],
  [235, 190, 2], [300, 170, 1], [355, 205, 1.4], [60, 230, 1.5], [140, 250, 1],
  [220, 236, 1.7], [290, 255, 1.1], [345, 270, 2], [30, 285, 1.2], [105, 295, 1.8],
];

export function StarField({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 310" className={className} aria-hidden>
      {STARS.map(([x, y, r], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill={i % 4 === 0 ? GOLD_SOFT : "#dbe4f5"}
          opacity={0.25 + (i % 5) * 0.14}
          className={i % 3 === 0 ? "animate-sf-twinkle" : undefined}
          style={i % 3 === 0 ? { animationDelay: `${(i % 7) * 0.55}s` } : undefined}
        />
      ))}
      {/* 별자리 선 */}
      <path d="M24 30 L150 44 L210 20 L280 52 M150 44 L120 110 L235 190" stroke="#8fa3cd" strokeOpacity="0.28" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

/** 타로 카드 1장 — 뒷면 문양 */
export function TarotCardBack({
  className = "",
  tilt = 0,
  glow = false,
}: {
  className?: string;
  tilt?: number;
  glow?: boolean;
}) {
  return (
    <svg viewBox="0 0 120 190" className={className} aria-hidden style={{ transform: `rotate(${tilt}deg)` }}>
      {glow && <ellipse cx="60" cy="95" rx="70" ry="100" fill={GOLD} opacity="0.10" />}
      <rect x="6" y="6" width="108" height="178" rx="10" fill="#0c1730" stroke={GOLD} strokeOpacity="0.8" strokeWidth="1.6" />
      <rect x="14" y="14" width="92" height="162" rx="7" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.8" />
      <circle cx="60" cy="80" r="30" fill="none" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.9" />
      <circle cx="60" cy="80" r="19" fill="none" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.5" />
      {[0, 1, 2, 3, 4].map((s) => {
        const a = (Math.PI * 2 * s) / 5 - Math.PI / 2;
        return <circle key={s} cx={60 + Math.cos(a) * 30} cy={80 + Math.sin(a) * 30} r="2.6" fill={GOLD} />;
      })}
      <path d="M60 118 l6 10 -6 10 -6 -10 z" fill={GOLD} fillOpacity="0.85" />
      <path d="M30 150 h60 M38 158 h44" stroke={GOLD} strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}

/** 타로 카드 팬 — 1/3/10장(켈틱 크로스) 차이를 시각화 */
export function TarotFan({ count, className = "" }: { count: 1 | 3 | 10; className?: string }) {
  const tilts =
    count === 1
      ? [0]
      : count === 3
        ? [-14, 0, 14]
        : [-36, -28, -20, -12, -4, 4, 12, 20, 28, 36];
  const sizeCls = count === 10 ? "w-[17%] max-w-[64px] -mx-[3.5%]" : "w-[38%] max-w-[96px] -mx-[7%]";
  // 주의: 여기서 position 클래스를 하드코딩하지 않는다 — 호출부가 absolute 배치를 넘길 수 있음.
  return (
    <div className={`flex items-end justify-center ${className}`} aria-hidden>
      {tilts.map((t, i) => (
        <div
          key={i}
          className={sizeCls}
          style={{ transform: `rotate(${t}deg) translateY(${Math.abs(t) * (count === 10 ? 0.55 : 0.9)}px)`, zIndex: 40 - Math.abs(t) }}
        >
          <TarotCardBack className="w-full h-auto drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)]" glow={t === 0} />
        </div>
      ))}
    </div>
  );
}

/** 재회 — 갈라졌다 다시 이어지는 두 선 */
export function ReunionLines({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} aria-hidden fill="none">
      <path d="M20 110 C 90 110, 120 50, 200 50 C 280 50, 310 104, 372 108" stroke={GOLD_SOFT} strokeWidth="2" strokeOpacity="0.85" />
      <path d="M20 110 C 90 110, 120 170, 200 170 C 268 170, 300 130, 360 114" stroke="#c98ab0" strokeWidth="2" strokeOpacity="0.8" strokeDasharray="1 0" />
      {/* 다시 만나는 지점의 빛 */}
      <circle cx="368" cy="110" r="18" fill={GOLD} opacity="0.14" />
      <circle cx="368" cy="110" r="7" fill={GOLD} opacity="0.35" />
      <circle cx="368" cy="110" r="3" fill={GOLD_SOFT} />
      <circle cx="20" cy="110" r="3" fill="#c98ab0" />
      {/* 거리의 별 */}
      <circle cx="200" cy="26" r="1.8" fill={GOLD_SOFT} opacity="0.7" />
      <circle cx="150" cy="196" r="1.6" fill="#c98ab0" opacity="0.7" />
      <circle cx="260" cy="200" r="1.4" fill={GOLD_SOFT} opacity="0.5" />
    </svg>
  );
}

/** 짝사랑 — 두 궤도가 스치는 순간 */
export function CrushOrbit({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} aria-hidden fill="none">
      <ellipse cx="200" cy="110" rx="170" ry="66" stroke="#e39ab8" strokeOpacity="0.5" strokeWidth="1.4" />
      <ellipse cx="200" cy="110" rx="110" ry="96" stroke={GOLD_SOFT} strokeOpacity="0.45" strokeWidth="1.2" transform="rotate(-18 200 110)" />
      <circle cx="330" cy="80" r="7" fill="#e39ab8" />
      <circle cx="330" cy="80" r="13" stroke="#e39ab8" strokeOpacity="0.4" />
      <circle cx="118" cy="176" r="6" fill={GOLD} />
      <circle cx="118" cy="176" r="12" stroke={GOLD} strokeOpacity="0.4" />
      {/* 교차 지점의 스파크 */}
      <path d="M262 148 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4 z" fill={GOLD_SOFT} opacity="0.9" />
    </svg>
  );
}

/** 인바디 — 좌표·측정 그래픽 */
export function MeasureGrid({ className = "" }: { className?: string }) {
  const bars = [46, 72, 58, 88, 64];
  return (
    <svg viewBox="0 0 400 220" className={className} aria-hidden fill="none">
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="40" y1={40 + i * 45} x2="360" y2={40 + i * 45} stroke="#7d8db2" strokeOpacity="0.25" strokeWidth="0.8" />
      ))}
      {bars.map((h, i) => (
        <g key={i}>
          <rect x={64 + i * 60} y={182 - h * 1.2} width="26" height={h * 1.2} rx="4" fill={i === 3 ? GOLD : "#41598c"} fillOpacity={i === 3 ? 0.95 : 0.75} />
          <circle cx={77 + i * 60} cy={176 - h * 1.2} r="3" fill={i === 3 ? GOLD_SOFT : "#8ba2d4"} />
        </g>
      ))}
      <path d="M64 130 L124 118 L184 132 L244 76 L304 104" stroke={GOLD_SOFT} strokeWidth="1.6" strokeOpacity="0.9" />
    </svg>
  );
}

/** 자유형 문(門) — 무료 맛보기·시작 그래픽 */
export function GateArch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" className={className} aria-hidden fill="none">
      <path d="M120 200 L120 96 A80 80 0 0 1 280 96 L280 200" stroke={GOLD} strokeWidth="2" strokeOpacity="0.9" />
      <path d="M138 200 L138 102 A62 62 0 0 1 262 102 L262 200" stroke={GOLD} strokeWidth="1" strokeOpacity="0.4" />
      <line x1="200" y1="58" x2="200" y2="20" stroke={GOLD_SOFT} strokeOpacity="0.7" strokeWidth="1.2" />
      <circle cx="200" cy="14" r="3.4" fill={GOLD_SOFT} />
      <ellipse cx="200" cy="200" rx="120" ry="7" fill={GOLD} opacity="0.12" />
      <circle cx="200" cy="140" r="26" stroke={GOLD_SOFT} strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 5" />
    </svg>
  );
}
