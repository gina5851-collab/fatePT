import type { ExternalPurchaseLink, ExternalLinkType } from "@/config/products.mock";

// 다른 구매처(외부 링크) 버튼 그룹. 새 탭. iframe 금지.
export function ExternalPurchaseLinks({ links, productName }: { links: ExternalPurchaseLink[]; productName: string }) {
  if (links.length === 0) return null;
  return (
    <section className="mb-8">
      <p className="text-[12px] font-semibold text-ink mb-1">🛍 다른 구매처에서 보기</p>
      <p className="text-[11px] text-mute mb-3">
        이 상품은 BrandG 자체 입점은 아니지만, 지나가 일상에서 쓰는 제품이라 외부 판매처를 안내드려요.
      </p>
      <ul className="space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${productName} — ${link.label} (새 탭)`}
              className="group flex items-center gap-3 rounded-xl border border-hairline bg-canvas px-4 py-3.5 hover:border-ink transition-colors"
            >
              <BrandIcon type={link.type} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-ink leading-tight">{link.label}</p>
                <p className="text-[10px] text-mute mt-0.5">새 탭으로 열림 · 외부 사이트</p>
              </div>
              {link.badge ? (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                  {link.badge}
                </span>
              ) : null}
              <span className="text-mute group-hover:text-ink transition-colors text-[14px]" aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] text-mute">
        * 외부 사이트 가격·재고·배송은 해당 사이트 정책을 따릅니다. BrandG 는 중개 및 결제·환불 책임이 없습니다.
      </p>
    </section>
  );
}

function BrandIcon({ type }: { type: ExternalLinkType }) {
  const base = "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold";
  switch (type) {
    case "coupang":
      return <span className={`${base} bg-[#EE2D2C] text-white`}>쿠팡</span>;
    case "youtube":
      return (
        <span className={`${base} bg-[#FF0000] text-white`} aria-label="YouTube">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </span>
      );
    case "naver":
      return <span className={`${base} bg-[#03C75A] text-white text-[14px]`}>N</span>;
    case "official":
      return (
        <span className={`${base} bg-ink text-canvas`} aria-label="공식몰">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </span>
      );
    default:
      return <span className={`${base} bg-surface-soft text-ink border border-hairline`}>🔗</span>;
  }
}
