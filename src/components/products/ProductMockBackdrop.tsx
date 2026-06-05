import type { MockProduct } from "@/config/products.mock";

// =====================================================
// 상품 카드 백드롭 — 파스텔 배경 + 패키지 실루엣 SVG + 브랜드 워터마크
// 실제 상품 사진은 없지만 "스튜디오 컷" 느낌으로 시각화. 외부 이미지 의존성 0.
// =====================================================

type Shape = "bottle" | "jar" | "capsule" | "box" | "tube" | "device";

type Palette = {
  bg: string;
  highlight: string;
  silhouette: string;
  brand: string;
  text: string;
};

const PALETTE_BY_CATEGORY: Record<string, Palette> = {
  "good-skin": {
    bg: "bg-[#E3F0F4]",
    highlight: "rgba(255,255,255,0.55)",
    silhouette: "text-[#4E7E94]",
    brand: "text-[#3E647A]",
    text: "text-[#2F4E5C]",
  },
  "good-health": {
    bg: "bg-[#E9F0DE]",
    highlight: "rgba(255,255,255,0.5)",
    silhouette: "text-[#5C7745]",
    brand: "text-[#4A6035]",
    text: "text-[#3A4D2A]",
  },
  "good-recovery": {
    bg: "bg-[#EFE3F0]",
    highlight: "rgba(255,255,255,0.55)",
    silhouette: "text-[#7A5485]",
    brand: "text-[#624470]",
    text: "text-[#4D3658]",
  },
  "good-balance": {
    bg: "bg-[#E0E8F2]",
    highlight: "rgba(255,255,255,0.55)",
    silhouette: "text-[#4F6B89]",
    brand: "text-[#3F5670]",
    text: "text-[#324358]",
  },
  "good-inner-care": {
    bg: "bg-[#F3E2EA]",
    highlight: "rgba(255,255,255,0.55)",
    silhouette: "text-[#A35372]",
    brand: "text-[#823F5B]",
    text: "text-[#5F2E44]",
  },
};

const FALLBACK: Palette = PALETTE_BY_CATEGORY["good-skin"];

function getShape(product: MockProduct): Shape {
  const n = product.name;
  if (n.includes("디바이스") || n.includes("롤러") || n.includes("밴드")) return "device";
  if (n.includes("세럼") || n.includes("토너") || n.includes("로션") || n.includes("클렌저") || n.includes("폼") || n.includes("디퓨저") || n.includes("쉐이크")) return "bottle";
  if (n.includes("크림") || n.includes("팩") || n.includes("마스크") || n.includes("솔트")) return "jar";
  if (n.includes("티") || n.includes("패치")) return "box";
  if (n.includes("스틱") || n.includes("정") || n.includes("캡슐") || n.includes("포")) return "capsule";
  return "tube";
}

// SVG shapes — currentColor 로 silhouette 톤 상속.
const SHAPES: Record<Shape, React.ReactNode> = {
  bottle: (
    <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="42" y="14" width="16" height="14" rx="2" fill="currentColor" opacity="0.92" />
      <rect x="46" y="27" width="8" height="6" fill="currentColor" opacity="0.92" />
      <rect x="28" y="33" width="44" height="96" rx="5" fill="currentColor" opacity="0.78" />
      <rect x="32" y="68" width="36" height="32" rx="1" fill="white" opacity="0.4" />
      <rect x="38" y="78" width="24" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="38" y="85" width="18" height="1.5" rx="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  jar: (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="18" y="20" width="64" height="14" rx="3" fill="currentColor" opacity="0.92" />
      <rect x="14" y="34" width="72" height="56" rx="5" fill="currentColor" opacity="0.78" />
      <rect x="20" y="52" width="60" height="22" rx="1" fill="white" opacity="0.38" />
      <rect x="28" y="60" width="34" height="2" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="28" y="66" width="22" height="1.5" rx="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  capsule: (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="15" y="38" width="70" height="24" rx="12" fill="currentColor" opacity="0.55" />
      <path d="M27 38 L 27 62 A 12 12 0 0 1 27 38 Z" fill="currentColor" opacity="0.9" />
      <rect x="15" y="38" width="35" height="24" rx="12" fill="currentColor" opacity="0.9" />
      <ellipse cx="32" cy="46" rx="3" ry="2" fill="white" opacity="0.6" />
      <ellipse cx="70" cy="46" rx="2" ry="1.5" fill="white" opacity="0.4" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="20" y="18" width="60" height="86" rx="3" fill="currentColor" opacity="0.78" />
      <rect x="20" y="18" width="60" height="22" rx="3" fill="currentColor" opacity="0.92" />
      <rect x="28" y="55" width="44" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x="28" y="62" width="32" height="1.5" rx="0.5" fill="white" opacity="0.45" />
      <rect x="28" y="68" width="38" height="1.5" rx="0.5" fill="white" opacity="0.45" />
    </svg>
  ),
  tube: (
    <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="40" y="14" width="20" height="10" rx="1" fill="currentColor" opacity="0.92" />
      <path d="M30 24 L70 24 L62 126 L38 126 Z" fill="currentColor" opacity="0.78" />
      <rect x="38" y="60" width="24" height="2" rx="1" fill="white" opacity="0.55" />
      <rect x="38" y="68" width="16" height="1.5" rx="0.5" fill="white" opacity="0.4" />
    </svg>
  ),
  device: (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="50" cy="50" r="34" fill="currentColor" opacity="0.78" />
      <circle cx="50" cy="50" r="22" fill="currentColor" opacity="0.92" />
      <circle cx="50" cy="50" r="14" fill="white" opacity="0.35" />
      <circle cx="50" cy="50" r="3" fill="white" opacity="0.7" />
    </svg>
  ),
};

export function ProductMockBackdrop({
  product,
  showName = true,
  size = "md",
}: {
  product: MockProduct;
  showName?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const palette = PALETTE_BY_CATEGORY[product.category_slug] ?? FALLBACK;
  const shape = getShape(product);
  const brandLabel = product.brand === "G.LAB" ? "G.LAB" : "JINA·PICK";
  const brandSize = size === "sm" ? "text-[8px] tracking-[0.2em]" : "text-[10px] tracking-[0.3em]";
  const nameSize = size === "sm" ? "text-[8px] tracking-[0.15em]" : "text-[10px] tracking-[0.2em]";
  const shortName = product.shortDescription.length > 22
    ? `${product.shortDescription.slice(0, 20)}…`
    : product.shortDescription;

  return (
    <div className={`relative w-full h-full overflow-hidden ${palette.bg}`}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 35%, ${palette.highlight}, transparent 65%)`,
        }}
        aria-hidden
      />

      <p
        className={`absolute top-3 left-3 font-bold uppercase ${brandSize} ${palette.brand}`}
        aria-hidden
      >
        {brandLabel}
      </p>

      <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center ${palette.silhouette}`}>
        <div className={`${size === "sm" ? "h-[60%]" : size === "lg" ? "h-[72%]" : "h-[66%]"} aspect-square`}>
          {SHAPES[shape]}
        </div>
      </div>

      {showName ? (
        <p
          className={`absolute bottom-3 inset-x-3 text-center font-semibold ${nameSize} ${palette.text}`}
          aria-hidden
        >
          {shortName}
        </p>
      ) : null}
    </div>
  );
}
