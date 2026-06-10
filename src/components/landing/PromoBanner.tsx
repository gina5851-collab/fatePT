import Image from "next/image";
import Link from "next/link";

// 홈 Hero 직후 큰 라이프스타일 배너 — 2장 (모바일 가로 스크롤 / 데스크톱 그리드).
const BANNERS = [
  {
    src: "/brandg-demo/pexels-sora-shimazaki-5938243.jpg",
    eyebrow: "MORNING G",
    title: "거울 앞 5분,\n나에게 주는 의식",
    body: "잠깐의 거울 앞 시간이 하루의 톤을 정해줍니다.",
    href: "/categories/good-skin",
    objectPosition: "center 30%",
  },
  {
    src: "/brandg-demo/pexels-pavel-danilyuk-6417971.jpg",
    eyebrow: "DAILY G",
    title: "한 방울의\n작은 의식",
    body: "오늘의 컨디션에 맞게, 한 방울씩 더하는 루틴.",
    href: "/categories/good-skin",
    objectPosition: "center 45%",
  },
];

export function PromoBanner() {
  return (
    <section className="container py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {BANNERS.map((b, i) => (
          <Link
            key={i}
            href={b.href}
            className="group relative block aspect-[16/10] md:aspect-[4/5] rounded-2xl overflow-hidden bg-surface-soft"
          >
            <Image
              src={b.src}
              alt={b.title.replace("\n", " ")}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectPosition: b.objectPosition }}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
              <p className="text-[10px] font-mono tracking-[0.3em] opacity-90">{b.eyebrow}</p>
              <p className="mt-1.5 text-[20px] md:text-[22px] font-bold leading-snug whitespace-pre-line drop-shadow">
                {b.title}
              </p>
              <p className="mt-2 text-[12px] opacity-90 max-w-[260px] leading-relaxed">{b.body}</p>
              <span className="mt-3 inline-flex w-fit items-center rounded-full bg-white/95 text-ink text-[11px] font-bold px-3 py-1.5">
                자세히 보기 →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
