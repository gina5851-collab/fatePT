import Image from "next/image";

// 공구 상세 이미지 영역 — purchaseType='groupbuy' 전용.
// 한국 쇼핑몰의 "상세 페이지 긴 이미지" 패턴.
export function DetailImageList({ images, alt }: { images: string[]; alt: string }) {
  if (images.length === 0) return null;
  return (
    <section className="mb-8">
      <p className="text-[12px] font-semibold text-ink mb-1">📸 공구 상세 이미지</p>
      <p className="text-[11px] text-mute mb-3">단독 공구 한정 라인 — 자세한 사용 컷과 디테일을 확인해 주세요.</p>
      <div className="space-y-2 -mx-4 sm:mx-0">
        {images.map((src, i) => (
          <div key={i} className="relative w-full aspect-[4/3] sm:rounded-2xl overflow-hidden bg-surface-soft">
            <Image
              src={src}
              alt={`${alt} 상세 ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
