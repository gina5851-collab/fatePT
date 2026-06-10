// 상품 상세 hero 위 이미지 갤러리 슬롯 (Phase 2d UI).
// images 배열을 받아 가로 스크롤로 표시. 비어있으면 그라데이션 fallback 1장.
// Phase 2c (products.images jsonb 마이그레이션) 후 DB 값으로 자동 채워짐.

type Props = {
  images?: string[];
  gradient?: string; // tailwind gradient classes (예: "from-amber-200 via-orange-300 to-rose-400")
  alt?: string;
};

const GRADIENT_DEFAULT = "from-slate-400 via-slate-600 to-slate-900";

export function ProductGallery({ images, gradient, alt }: Props) {
  const list = images && images.length > 0 ? images : null;
  const g = gradient ?? GRADIENT_DEFAULT;

  // 이미지 1장 이상 — 가로 스크롤 갤러리
  if (list && list.length > 0) {
    return (
      <section className="mb-8 -mx-4 sm:mx-0">
        <div
          className="flex gap-2 overflow-x-auto snap-x snap-mandatory px-4 pb-2"
          aria-label="상품 이미지"
        >
          {list.map((src, i) => (
            <div
              key={i}
              className="relative shrink-0 snap-center aspect-[4/5] w-[calc(100%-2rem)] sm:w-[420px] rounded-2xl overflow-hidden bg-surface-soft"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt ?? `상품 이미지 ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        {/* dot indicator (정적, 스크롤 동기화는 CSS scroll-snap 으로 대체) */}
        {list.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2" aria-hidden>
            {list.map((_, i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full bg-hairline"
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  // images 없음 — 그라데이션 fallback 1장 (Phase 2c 까지 사용)
  return (
    <section className="mb-8">
      <div
        className={`relative aspect-[4/5] w-full max-w-[420px] mx-auto rounded-2xl overflow-hidden bg-gradient-to-b ${g}`}
        aria-hidden
      />
    </section>
  );
}
