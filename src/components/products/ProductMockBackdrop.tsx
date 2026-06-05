import { useId } from "react";
import type { MockProduct } from "@/config/products.mock";

// =====================================================
// 상품 카드 백드롭 — 스튜디오 (크림 배경 + 바닥 그림자) + 디테일 SVG 패키지.
// 외부 이미지 의존성 0. 카테고리/이름 기준으로 12종 패키지 자동 선택.
// =====================================================

type PackageKey =
  | "serumBottle"
  | "creamJar"
  | "supplementBottle"
  | "pumpBottle"
  | "stickPouch"
  | "tube"
  | "teaBox"
  | "patchBox"
  | "saltJar"
  | "diffuser"
  | "proteinTub"
  | "rollerStick"
  | "bandKit"
  | "ledDevice"
  | "padJar";

type Accent = {
  bottle: string;       // package main color
  cap: string;          // cap / lid color
  label: string;        // label background
  labelText: string;    // text color on label
  studio: string;       // studio background
};

const CATEGORY_ACCENT: Record<string, Accent> = {
  "good-skin":       { bottle: "#5C8AA6", cap: "#2C3E50", label: "#FBFAF7", labelText: "#2C3E50", studio: "#EFE9DE" },
  "good-health":     { bottle: "#7A9658", cap: "#3A4A2C", label: "#FBFAF7", labelText: "#3A4A2C", studio: "#F1EBDD" },
  "good-recovery":   { bottle: "#9778A8", cap: "#4A3A5C", label: "#FBFAF7", labelText: "#4A3A5C", studio: "#EFE5E8" },
  "good-balance":    { bottle: "#5E7BA0", cap: "#2C3A52", label: "#FBFAF7", labelText: "#2C3A52", studio: "#E8EBF0" },
  "good-inner-care": { bottle: "#B26A86", cap: "#5A2E48", label: "#FBFAF7", labelText: "#5A2E48", studio: "#F3E5EA" },
};

const FALLBACK: Accent = CATEGORY_ACCENT["good-skin"];

// 이름 기반 패키지 결정 (mock 25개에 맞춤)
function pickPackage(product: MockProduct): PackageKey {
  const n = product.name;
  if (n.includes("디바이스")) return "ledDevice";
  if (n.includes("롤러")) return "rollerStick";
  if (n.includes("밴드")) return "bandKit";
  if (n.includes("디퓨저")) return "diffuser";
  if (n.includes("입욕솔트") || n.includes("바스")) return "saltJar";
  if (n.includes("토너패드")) return "padJar";
  if (n.includes("폼") || n.includes("클렌저")) return "pumpBottle";
  if (n.includes("세럼") || n.includes("로션")) return "serumBottle";
  if (n.includes("크림") || n.includes("마스크") || n.includes("팩")) return "creamJar";
  if (n.includes("쉐이크")) return "proteinTub";
  if (n.includes("스틱") || n.includes("포")) return "stickPouch";
  if (n.includes("패치")) return "patchBox";
  if (n.includes("티")) return "teaBox";
  if (n.includes("정") || n.includes("캡슐")) return "supplementBottle";
  return "tube";
}

// 짧은 영문 라벨 (5~12자)
function shortLabel(product: MockProduct): string {
  const n = product.name;
  if (n.includes("비타C") || n.includes("비타민C")) return "VITA C";
  if (n.includes("시카")) return "CICA";
  if (n.includes("크림")) return "CREAM";
  if (n.includes("두피") || n.includes("스칼프")) return "SCALP";
  if (n.includes("디바이스")) return "LED";
  if (n.includes("비타민")) return "MULTI";
  if (n.includes("콜라겐")) return "COLLAGEN";
  if (n.includes("캐모마일")) return "TEA";
  if (n.includes("락토페린")) return "LACTO";
  if (n.includes("단백질")) return "PROTEIN";
  if (n.includes("입욕")) return "BATH";
  if (n.includes("패치")) return "PATCH";
  if (n.includes("헤어")) return "HAIR";
  if (n.includes("클레이")) return "CLAY";
  if (n.includes("라벤더") || n.includes("디퓨저")) return "AROMA";
  if (n.includes("부기")) return "DETOX";
  if (n.includes("롤러")) return "ROLLER";
  if (n.includes("쉐이크")) return "SLIM";
  if (n.includes("밴드")) return "BAND";
  if (n.includes("종아리")) return "COOL";
  if (n.includes("폼")) return "FOAM";
  if (n.includes("유산균")) return "LACTO";
  if (n.includes("Y존")) return "INNER";
  if (n.includes("갱년기")) return "BALANCE";
  if (n.includes("이너")) return "INNER";
  return "G.LAB";
}

export function ProductMockBackdrop({
  product,
  size = "md",
  showName = true,
}: {
  product: MockProduct;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}) {
  const a = CATEGORY_ACCENT[product.category_slug] ?? FALLBACK;
  const pkg = pickPackage(product);
  const label = shortLabel(product);
  const brand = product.brand === "G.LAB" ? "G.LAB" : "JINA·PICK";
  const uid = useId().replace(/:/g, "");

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: a.studio }}>
      {/* studio backdrop — soft top light + floor */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.04) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 38%, rgba(255,255,255,0.45), transparent 60%)",
        }}
        aria-hidden
      />
      {/* floor shadow under product */}
      <div
        className="absolute left-[22%] right-[22%] bottom-[14%] h-[4%] rounded-[50%] opacity-50"
        style={{
          background: "radial-gradient(ellipse, rgba(40,30,20,0.45), transparent 70%)",
          filter: "blur(4px)",
        }}
        aria-hidden
      />

      {/* package SVG centered, sitting on floor */}
      <div className="absolute inset-0 flex items-end justify-center pb-[14%]">
        <div className={`${size === "sm" ? "h-[72%]" : size === "lg" ? "h-[78%]" : "h-[76%]"} aspect-[3/5] max-w-[80%]`}>
          <PackageSVG pkg={pkg} accent={a} brand={brand} label={label} uid={uid} />
        </div>
      </div>

      {/* product short name at bottom (optional, hidden on small) */}
      {showName ? (
        <p
          className="absolute bottom-[4%] inset-x-3 text-center font-mono uppercase tracking-[0.25em] text-[9px]"
          style={{ color: a.cap, opacity: 0.55 }}
          aria-hidden
        >
          {product.shortDescription.length > 22 ? `${product.shortDescription.slice(0, 20)}…` : product.shortDescription}
        </p>
      ) : null}
    </div>
  );
}

// =====================================================
// Package SVGs — 각자 viewBox 다름, height 100% 로 부모 컨테이너에 맞춤
// =====================================================

function PackageSVG({ pkg, accent, brand, label, uid }: { pkg: PackageKey; accent: Accent; brand: string; label: string; uid: string }) {
  switch (pkg) {
    case "serumBottle":    return <SerumBottle a={accent} brand={brand} label={label} uid={uid} />;
    case "creamJar":       return <CreamJar a={accent} brand={brand} label={label} uid={uid} />;
    case "supplementBottle": return <SupplementBottle a={accent} brand={brand} label={label} uid={uid} />;
    case "pumpBottle":     return <PumpBottle a={accent} brand={brand} label={label} uid={uid} />;
    case "stickPouch":     return <StickPouch a={accent} brand={brand} label={label} uid={uid} />;
    case "tube":           return <Tube a={accent} brand={brand} label={label} uid={uid} />;
    case "teaBox":         return <TeaBox a={accent} brand={brand} label={label} uid={uid} />;
    case "patchBox":       return <PatchBox a={accent} brand={brand} label={label} uid={uid} />;
    case "saltJar":        return <SaltJar a={accent} brand={brand} label={label} uid={uid} />;
    case "diffuser":       return <Diffuser a={accent} brand={brand} label={label} uid={uid} />;
    case "proteinTub":     return <ProteinTub a={accent} brand={brand} label={label} uid={uid} />;
    case "rollerStick":    return <RollerStick a={accent} brand={brand} label={label} uid={uid} />;
    case "bandKit":        return <BandKit a={accent} brand={brand} label={label} uid={uid} />;
    case "ledDevice":      return <LedDevice a={accent} brand={brand} label={label} uid={uid} />;
    case "padJar":         return <PadJar a={accent} brand={brand} label={label} uid={uid} />;
  }
}

type SVGProps = { a: Accent; brand: string; label: string; uid: string };

function GlassGradient({ id, color }: { id: string; color: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor={color} stopOpacity="0.95" />
      <stop offset="15%" stopColor="#ffffff" stopOpacity="0.6" />
      <stop offset="40%" stopColor={color} stopOpacity="0.85" />
      <stop offset="100%" stopColor={color} stopOpacity="1" />
    </linearGradient>
  );
}

function CapGradient({ id, color }: { id: string; color: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor={color} stopOpacity="1" />
      <stop offset="40%" stopColor="#ffffff" stopOpacity="0.3" />
      <stop offset="100%" stopColor={color} stopOpacity="1" />
    </linearGradient>
  );
}

function SerumBottle({ a, brand, label, uid }: SVGProps) {
  const g = `g-${uid}`;
  const c = `c-${uid}`;
  return (
    <svg viewBox="0 0 120 200" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <GlassGradient id={g} color={a.bottle} />
        <CapGradient id={c} color={a.cap} />
      </defs>
      {/* dropper top */}
      <rect x="50" y="4" width="20" height="6" rx="1" fill={a.cap} />
      <rect x="44" y="10" width="32" height="22" rx="3" fill={`url(#${c})`} />
      {/* neck */}
      <rect x="52" y="32" width="16" height="8" fill={a.cap} opacity="0.9" />
      {/* shoulder */}
      <path d="M30 48 Q 30 40 42 40 L 78 40 Q 90 40 90 48 L 90 175 Q 90 188 78 188 L 42 188 Q 30 188 30 175 Z" fill={`url(#${g})`} />
      {/* highlight */}
      <rect x="36" y="52" width="5" height="120" rx="2.5" fill="#ffffff" opacity="0.5" />
      {/* label */}
      <rect x="36" y="90" width="48" height="62" rx="2" fill={a.label} />
      <text x="60" y="106" textAnchor="middle" fontSize="9" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <line x1="42" y1="111" x2="78" y2="111" stroke={a.labelText} strokeWidth="0.5" opacity="0.4" />
      <text x="60" y="128" textAnchor="middle" fontSize="11" fontWeight="700" fill={a.labelText}>{label}</text>
      <text x="60" y="142" textAnchor="middle" fontSize="5" fill={a.labelText} opacity="0.6">SERUM 30ml</text>
    </svg>
  );
}

function CreamJar({ a, brand, label, uid }: SVGProps) {
  const g = `g-${uid}`;
  const c = `c-${uid}`;
  return (
    <svg viewBox="0 0 140 180" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <GlassGradient id={g} color={a.bottle} />
        <CapGradient id={c} color={a.cap} />
      </defs>
      {/* lid */}
      <rect x="22" y="20" width="96" height="28" rx="4" fill={`url(#${c})`} />
      <rect x="22" y="20" width="96" height="4" rx="2" fill="#ffffff" opacity="0.25" />
      {/* jar body */}
      <rect x="16" y="48" width="108" height="118" rx="6" fill={`url(#${g})`} />
      {/* highlight */}
      <rect x="22" y="56" width="6" height="100" rx="3" fill="#ffffff" opacity="0.5" />
      {/* label */}
      <rect x="26" y="72" width="88" height="74" rx="2" fill={a.label} />
      <text x="70" y="91" textAnchor="middle" fontSize="9" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <line x1="36" y1="97" x2="104" y2="97" stroke={a.labelText} strokeWidth="0.5" opacity="0.4" />
      <text x="70" y="120" textAnchor="middle" fontSize="14" fontWeight="700" fill={a.labelText}>{label}</text>
      <text x="70" y="136" textAnchor="middle" fontSize="6" fill={a.labelText} opacity="0.6">50g</text>
    </svg>
  );
}

function SupplementBottle({ a, brand, label, uid }: SVGProps) {
  const g = `g-${uid}`;
  const c = `c-${uid}`;
  return (
    <svg viewBox="0 0 130 200" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <GlassGradient id={g} color="#FBFAF4" />
        <CapGradient id={c} color={a.cap} />
      </defs>
      {/* cap */}
      <rect x="32" y="10" width="66" height="26" rx="3" fill={`url(#${c})`} />
      <rect x="32" y="10" width="66" height="3" rx="1.5" fill="#ffffff" opacity="0.3" />
      {/* shoulder */}
      <path d="M28 36 Q 28 40 32 40 L 98 40 Q 102 40 102 36 L 102 36 L 102 175 Q 102 188 90 188 L 40 188 Q 28 188 28 175 Z" fill={`url(#${g})`} />
      <rect x="28" y="36" width="74" height="6" fill={a.cap} opacity="0.85" />
      {/* highlight */}
      <rect x="34" y="56" width="6" height="120" rx="3" fill="#ffffff" opacity="0.5" />
      {/* color band */}
      <rect x="28" y="68" width="74" height="14" fill={a.bottle} />
      {/* label */}
      <rect x="34" y="92" width="62" height="72" rx="2" fill={a.label} stroke={a.bottle} strokeWidth="0.7" />
      <text x="65" y="110" textAnchor="middle" fontSize="9" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <line x1="42" y1="115" x2="88" y2="115" stroke={a.labelText} strokeWidth="0.5" opacity="0.4" />
      <text x="65" y="134" textAnchor="middle" fontSize="13" fontWeight="700" fill={a.labelText}>{label}</text>
      <text x="65" y="150" textAnchor="middle" fontSize="5" fill={a.labelText} opacity="0.6">60 TABLETS</text>
    </svg>
  );
}

function PumpBottle({ a, brand, label, uid }: SVGProps) {
  const g = `g-${uid}`;
  const c = `c-${uid}`;
  return (
    <svg viewBox="0 0 130 220" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <GlassGradient id={g} color={a.bottle} />
        <CapGradient id={c} color={a.cap} />
      </defs>
      {/* pump nozzle */}
      <path d="M55 6 L 90 6 L 88 16 L 70 16 L 70 24 L 60 24 Z" fill={a.cap} />
      {/* pump head */}
      <rect x="46" y="24" width="40" height="14" rx="2" fill={`url(#${c})`} />
      {/* neck */}
      <rect x="56" y="38" width="20" height="10" fill={a.cap} opacity="0.9" />
      {/* body */}
      <path d="M22 60 Q 22 48 34 48 L 96 48 Q 108 48 108 60 L 108 195 Q 108 208 96 208 L 34 208 Q 22 208 22 195 Z" fill={`url(#${g})`} />
      {/* highlight */}
      <rect x="28" y="68" width="6" height="130" rx="3" fill="#ffffff" opacity="0.5" />
      {/* label */}
      <rect x="30" y="110" width="72" height="74" rx="2" fill={a.label} />
      <text x="66" y="128" textAnchor="middle" fontSize="9" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <line x1="40" y1="133" x2="92" y2="133" stroke={a.labelText} strokeWidth="0.5" opacity="0.4" />
      <text x="66" y="153" textAnchor="middle" fontSize="13" fontWeight="700" fill={a.labelText}>{label}</text>
      <text x="66" y="170" textAnchor="middle" fontSize="5" fill={a.labelText} opacity="0.6">CLEANSING 200ml</text>
    </svg>
  );
}

function StickPouch({ a, brand, label, uid }: SVGProps) {
  const g = `g-${uid}`;
  const c = `c-${uid}`;
  return (
    <svg viewBox="0 0 120 200" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <GlassGradient id={g} color={a.bottle} />
        <CapGradient id={c} color={a.cap} />
      </defs>
      {/* outer pack box */}
      <rect x="14" y="20" width="92" height="170" rx="4" fill={a.cap} opacity="0.85" />
      {/* top dent */}
      <path d="M14 20 L 36 14 L 58 20 L 82 14 L 106 20 Z" fill={a.cap} opacity="0.7" />
      {/* label panel */}
      <rect x="22" y="40" width="76" height="138" rx="2" fill={a.label} />
      {/* brand top */}
      <text x="60" y="64" textAnchor="middle" fontSize="9" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <line x1="32" y1="70" x2="88" y2="70" stroke={a.labelText} strokeWidth="0.5" opacity="0.4" />
      {/* product label */}
      <text x="60" y="98" textAnchor="middle" fontSize="13" fontWeight="700" fill={a.labelText}>{label}</text>
      {/* stick illustration */}
      <rect x="36" y="120" width="48" height="38" rx="2" fill={a.bottle} opacity="0.25" />
      <rect x="40" y="124" width="40" height="3" rx="1.5" fill={a.bottle} />
      <rect x="40" y="131" width="40" height="3" rx="1.5" fill={a.bottle} opacity="0.7" />
      <rect x="40" y="138" width="40" height="3" rx="1.5" fill={a.bottle} opacity="0.5" />
      <text x="60" y="172" textAnchor="middle" fontSize="5" fill={a.labelText} opacity="0.6">30 STICKS</text>
    </svg>
  );
}

function Tube({ a, brand, label, uid }: SVGProps) {
  const g = `g-${uid}`;
  const c = `c-${uid}`;
  return (
    <svg viewBox="0 0 100 200" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <GlassGradient id={g} color={a.bottle} />
        <CapGradient id={c} color={a.cap} />
      </defs>
      {/* cap */}
      <rect x="36" y="6" width="28" height="20" rx="2" fill={`url(#${c})`} />
      <rect x="36" y="6" width="28" height="3" fill="#ffffff" opacity="0.3" />
      {/* neck */}
      <rect x="42" y="26" width="16" height="4" fill={a.cap} />
      {/* tube body */}
      <path d="M22 32 L 78 32 L 70 188 L 30 188 Z" fill={`url(#${g})`} />
      {/* highlight */}
      <path d="M28 38 L 32 38 L 30 180 L 26 180 Z" fill="#ffffff" opacity="0.4" />
      {/* label */}
      <rect x="28" y="76" width="44" height="78" rx="2" fill={a.label} />
      <text x="50" y="92" textAnchor="middle" fontSize="7" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <line x1="34" y1="97" x2="66" y2="97" stroke={a.labelText} strokeWidth="0.5" opacity="0.4" />
      <text x="50" y="118" textAnchor="middle" fontSize="10" fontWeight="700" fill={a.labelText}>{label}</text>
      <text x="50" y="140" textAnchor="middle" fontSize="4.5" fill={a.labelText} opacity="0.6">100ml</text>
    </svg>
  );
}

function TeaBox({ a, brand, label, uid }: SVGProps) {
  const c = `c-${uid}`;
  return (
    <svg viewBox="0 0 160 180" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <CapGradient id={c} color={a.cap} />
      </defs>
      {/* box */}
      <rect x="14" y="14" width="132" height="156" rx="4" fill={a.bottle} />
      {/* top band */}
      <rect x="14" y="14" width="132" height="22" rx="4" fill={`url(#${c})`} />
      <rect x="14" y="14" width="132" height="3" fill="#ffffff" opacity="0.3" />
      {/* central label */}
      <rect x="24" y="50" width="112" height="100" rx="3" fill={a.label} />
      <text x="80" y="74" textAnchor="middle" fontSize="9" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <line x1="36" y1="80" x2="124" y2="80" stroke={a.labelText} strokeWidth="0.5" opacity="0.4" />
      <text x="80" y="108" textAnchor="middle" fontSize="18" fontWeight="700" fill={a.labelText}>{label}</text>
      <text x="80" y="130" textAnchor="middle" fontSize="6" fill={a.labelText} opacity="0.6">20 TEA BAGS</text>
      {/* corner fold detail */}
      <path d="M14 14 L 28 14 L 14 28 Z" fill="#ffffff" opacity="0.15" />
    </svg>
  );
}

function PatchBox({ a, brand, label, uid }: SVGProps) {
  return (
    <svg viewBox="0 0 160 140" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <rect x="10" y="14" width="140" height="108" rx="4" fill={a.bottle} />
      <rect x="10" y="14" width="140" height="22" rx="4" fill={a.cap} />
      <text x="80" y="29" textAnchor="middle" fontSize="9" fontWeight="800" fill={a.label} fontFamily="ui-monospace, monospace">{brand}</text>
      {/* label */}
      <rect x="20" y="46" width="120" height="66" rx="3" fill={a.label} />
      <text x="80" y="76" textAnchor="middle" fontSize="18" fontWeight="700" fill={a.labelText}>{label}</text>
      <text x="80" y="96" textAnchor="middle" fontSize="6" fill={a.labelText} opacity="0.6">10 PATCHES</text>
    </svg>
  );
}

function SaltJar({ a, brand, label, uid }: SVGProps) {
  const g = `g-${uid}`;
  const c = `c-${uid}`;
  return (
    <svg viewBox="0 0 140 200" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <GlassGradient id={g} color="#FBFAF4" />
        <CapGradient id={c} color={a.cap} />
      </defs>
      {/* lid */}
      <rect x="28" y="14" width="84" height="20" rx="4" fill={`url(#${c})`} />
      {/* jar */}
      <rect x="22" y="34" width="96" height="154" rx="6" fill={`url(#${g})`} stroke={a.bottle} strokeWidth="1" strokeOpacity="0.3" />
      {/* contents — bath salt crystals */}
      <rect x="28" y="80" width="84" height="100" fill={a.bottle} opacity="0.25" />
      {[1,2,3,4,5,6,7,8,9,10,11].map((i) => {
        const x = 32 + ((i * 17) % 80);
        const y = 88 + Math.floor(i / 5) * 22 + (i % 3) * 5;
        return <circle key={i} cx={x} cy={y} r={2.5 + (i % 3)} fill={a.bottle} opacity="0.7" />;
      })}
      {/* highlight */}
      <rect x="28" y="42" width="6" height="120" rx="3" fill="#ffffff" opacity="0.5" />
      {/* label */}
      <rect x="32" y="44" width="76" height="30" rx="2" fill={a.label} />
      <text x="70" y="59" textAnchor="middle" fontSize="9" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <text x="70" y="69" textAnchor="middle" fontSize="8" fontWeight="700" fill={a.labelText}>{label}</text>
    </svg>
  );
}

function Diffuser({ a, brand, label, uid }: SVGProps) {
  const g = `g-${uid}`;
  return (
    <svg viewBox="0 0 140 200" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <GlassGradient id={g} color={a.bottle} />
      </defs>
      {/* reeds */}
      <line x1="60" y1="10" x2="56" y2="60" stroke={a.cap} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="6" x2="70" y2="60" stroke={a.cap} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="80" y1="10" x2="84" y2="60" stroke={a.cap} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="64" y1="12" x2="64" y2="60" stroke={a.cap} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="76" y1="10" x2="76" y2="60" stroke={a.cap} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* neck collar */}
      <rect x="52" y="58" width="36" height="6" rx="1" fill={a.cap} />
      {/* bottle */}
      <path d="M28 70 Q 28 64 34 64 L 106 64 Q 112 64 112 70 L 112 185 Q 112 192 105 192 L 35 192 Q 28 192 28 185 Z" fill={`url(#${g})`} />
      {/* highlight */}
      <rect x="36" y="76" width="6" height="100" rx="3" fill="#ffffff" opacity="0.5" />
      {/* label */}
      <rect x="38" y="100" width="64" height="68" rx="2" fill={a.label} />
      <text x="70" y="118" textAnchor="middle" fontSize="8" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <line x1="46" y1="124" x2="94" y2="124" stroke={a.labelText} strokeWidth="0.5" opacity="0.4" />
      <text x="70" y="143" textAnchor="middle" fontSize="12" fontWeight="700" fill={a.labelText}>{label}</text>
      <text x="70" y="158" textAnchor="middle" fontSize="5" fill={a.labelText} opacity="0.6">DIFFUSER 200ml</text>
    </svg>
  );
}

function ProteinTub({ a, brand, label, uid }: SVGProps) {
  const c = `c-${uid}`;
  return (
    <svg viewBox="0 0 160 180" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <CapGradient id={c} color={a.cap} />
      </defs>
      {/* lid */}
      <ellipse cx="80" cy="22" rx="62" ry="12" fill={`url(#${c})`} />
      <rect x="18" y="22" width="124" height="14" fill={a.cap} />
      {/* tub */}
      <rect x="18" y="36" width="124" height="138" rx="4" fill={a.bottle} />
      <ellipse cx="80" cy="36" rx="62" ry="6" fill="#ffffff" opacity="0.25" />
      {/* highlight */}
      <rect x="26" y="46" width="6" height="110" rx="3" fill="#ffffff" opacity="0.4" />
      {/* label */}
      <rect x="28" y="60" width="104" height="98" rx="3" fill={a.label} />
      <text x="80" y="84" textAnchor="middle" fontSize="10" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <line x1="42" y1="90" x2="118" y2="90" stroke={a.labelText} strokeWidth="0.5" opacity="0.4" />
      <text x="80" y="116" textAnchor="middle" fontSize="16" fontWeight="700" fill={a.labelText}>{label}</text>
      <text x="80" y="138" textAnchor="middle" fontSize="6" fill={a.labelText} opacity="0.6">PROTEIN 1.2kg</text>
    </svg>
  );
}

function RollerStick({ a }: SVGProps) {
  return (
    <svg viewBox="0 0 180 100" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      {/* roller body — horizontal cylinder */}
      <rect x="20" y="32" width="140" height="36" rx="18" fill={a.bottle} />
      <rect x="20" y="36" width="140" height="6" rx="3" fill="#ffffff" opacity="0.4" />
      {/* end caps */}
      <ellipse cx="22" cy="50" rx="6" ry="18" fill={a.cap} />
      <ellipse cx="158" cy="50" rx="6" ry="18" fill={a.cap} />
      {/* ridges */}
      {[40, 60, 80, 100, 120, 140].map((x) => (
        <rect key={x} x={x} y="36" width="2" height="28" rx="1" fill={a.cap} opacity="0.5" />
      ))}
      {/* label */}
      <rect x="60" y="42" width="60" height="16" rx="2" fill={a.label} />
      <text x="90" y="53" textAnchor="middle" fontSize="8" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">FOAM ROLLER</text>
    </svg>
  );
}

function BandKit({ a }: SVGProps) {
  return (
    <svg viewBox="0 0 180 140" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      {/* 3 bands stacked */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${i * 28})`}>
          <rect x="20" y="30" width="140" height="20" rx="10" fill={a.bottle} opacity={0.55 + i * 0.15} />
          <rect x="22" y="32" width="136" height="3" rx="1.5" fill="#ffffff" opacity="0.4" />
        </g>
      ))}
      {/* label tag */}
      <rect x="60" y="106" width="60" height="22" rx="3" fill={a.label} />
      <text x="90" y="120" textAnchor="middle" fontSize="8" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">G.LAB BAND</text>
    </svg>
  );
}

function LedDevice({ a, brand, label, uid }: SVGProps) {
  return (
    <svg viewBox="0 0 160 140" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      {/* device puck */}
      <ellipse cx="80" cy="80" rx="62" ry="44" fill={a.bottle} />
      <ellipse cx="80" cy="78" rx="62" ry="40" fill={a.cap} />
      {/* face */}
      <ellipse cx="80" cy="74" rx="50" ry="32" fill={a.label} />
      {/* LED ring */}
      <ellipse cx="80" cy="72" rx="42" ry="26" fill="none" stroke={a.bottle} strokeWidth="2" opacity="0.6" />
      {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => {
        const angle = (i / 12) * Math.PI * 2;
        const cx = 80 + Math.cos(angle) * 42;
        const cy = 72 + Math.sin(angle) * 26;
        return <circle key={i} cx={cx} cy={cy} r="2" fill={a.bottle} opacity="0.85" />;
      })}
      {/* center logo */}
      <text x="80" y="78" textAnchor="middle" fontSize="9" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      {/* button */}
      <circle cx="80" cy="120" r="5" fill={a.bottle} />
      <circle cx="80" cy="120" r="2" fill={a.label} />
    </svg>
  );
}

function PadJar({ a, brand, label, uid }: SVGProps) {
  const c = `c-${uid}`;
  return (
    <svg viewBox="0 0 160 160" className="h-full w-auto" preserveAspectRatio="xMidYMax meet">
      <defs>
        <CapGradient id={c} color={a.cap} />
      </defs>
      {/* lid */}
      <ellipse cx="80" cy="16" rx="62" ry="10" fill={`url(#${c})`} />
      <rect x="18" y="16" width="124" height="14" fill={a.cap} />
      {/* jar */}
      <rect x="18" y="30" width="124" height="118" rx="5" fill={a.bottle} />
      <ellipse cx="80" cy="30" rx="62" ry="5" fill="#ffffff" opacity="0.25" />
      {/* highlight */}
      <rect x="26" y="42" width="6" height="90" rx="3" fill="#ffffff" opacity="0.4" />
      {/* label */}
      <rect x="28" y="48" width="104" height="80" rx="3" fill={a.label} />
      <text x="80" y="70" textAnchor="middle" fontSize="9" fontWeight="800" fill={a.labelText} fontFamily="ui-monospace, monospace">{brand}</text>
      <line x1="42" y1="76" x2="118" y2="76" stroke={a.labelText} strokeWidth="0.5" opacity="0.4" />
      <text x="80" y="98" textAnchor="middle" fontSize="14" fontWeight="700" fill={a.labelText}>{label}</text>
      <text x="80" y="116" textAnchor="middle" fontSize="6" fill={a.labelText} opacity="0.6">60 PADS</text>
    </svg>
  );
}
