import Link from "next/link";
import { formatKRW } from "@/lib/utils";
import { PRODUCT_COPY } from "@/config/product-copy";

// 타이트사주式 세로(3:4) 시네마틱 카드. 모바일 퍼스트.
// copy.image 가 있으면 그 이미지를, 없으면 테마 그라데이션을 배경으로 — 이미지 나중에 교체.
const GRADIENT_BY_SLUG: Record<string, string> = {
  "free-taste": "from-amber-200 via-orange-300 to-rose-400",
  "inbody": "from-slate-300 via-slate-500 to-slate-800",
  "crush-kit": "from-pink-300 via-rose-400 to-rose-700",
  "love-session": "from-rose-300 via-pink-500 to-purple-700",
  "reunion-check": "from-indigo-400 via-purple-600 to-slate-900",
  "reunion-program": "from-blue-700 via-indigo-900 to-black",
  "life-master": "from-amber-500 via-yellow-700 to-slate-900",
};
const GRADIENT_DEFAULT = "from-slate-400 via-slate-600 to-slate-900";

export function CinematicCard({ slug, name, price }: { slug: string; name: string; price: number }) {
  const copy = PRODUCT_COPY[slug];
  const gradient = GRADIENT_BY_SLUG[slug] ?? GRADIENT_DEFAULT;
  const image = copy?.image;

  return (
    <Link
      href={`/products/${slug}`}
      className="group relative block overflow-hidden rounded-2xl aspect-[3/4]"
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-b ${gradient} transition-transform duration-500 group-hover:scale-105`} />
      )}

      {/* 하단 스크림 — 흰 텍스트 가독성 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

      {copy?.badge && (
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-900">
          {copy.badge}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className="text-[11px] font-medium text-white/70">{name}</p>
        <p className="mt-1 text-lg font-semibold leading-snug drop-shadow-sm">
          {copy?.headline ?? name}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          {copy?.originalPrice ? (
            <span className="text-xs font-mono text-white/50 line-through">{formatKRW(copy.originalPrice)}</span>
          ) : null}
          <span className="text-base font-mono font-semibold">{price === 0 ? "무료" : formatKRW(price)}</span>
        </div>
      </div>
    </Link>
  );
}
