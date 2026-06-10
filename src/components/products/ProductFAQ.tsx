// 상품 상세 — 배송/교환/안전 안내 접이식. <details>/<summary> 네이티브 아코디언.

const ITEMS = [
  {
    title: "배송 안내",
    body:
      "평일 오후 2시 이전 결제 건은 당일 출고합니다. 평균 1~3일 이내 도착이며, 도서산간 지역은 1~2일 추가 소요됩니다. 30,000원 이상 무료배송입니다.",
  },
  {
    title: "교환·반품",
    body:
      "단순 변심 교환·반품은 수령 후 7일 이내 신청해 주세요. 화장품/이너케어 류는 위생상 개봉 후 반품이 어렵습니다. 상품 하자/오배송은 BrandG가 왕복 배송비를 부담합니다.",
  },
  {
    title: "안전 안내",
    body:
      "보관: 직사광선/고온을 피해 서늘한 곳에 보관. 알레르기 반응이 생기면 사용을 중단하고 전문의와 상담하세요. 영양제는 1일 권장량을 지키시고, 특이 체질·임산부는 의사와 상의 후 드세요.",
  },
];

export function ProductFAQ() {
  return (
    <section className="mb-8">
      <p className="text-[12px] font-semibold text-ink mb-3">📦 안내</p>
      <div className="rounded-2xl border border-hairline bg-canvas divide-y divide-hairline overflow-hidden">
        {ITEMS.map((it, i) => (
          <details key={i} className="group">
            <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="text-[13px] font-medium text-ink">{it.title}</span>
              <span className="text-mute text-[14px] transition-transform group-open:rotate-180" aria-hidden>
                ▾
              </span>
            </summary>
            <div className="px-4 pb-4 -mt-1">
              <p className="text-[12px] text-body leading-relaxed">{it.body}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
