import type { Metadata } from "next";
import Link from "next/link";
import { TAROT_PRODUCTS } from "@/lib/readings/services/tarot/config";
import { formatKRW } from "@/lib/utils";

export const metadata: Metadata = {
  title: "타로",
  description: "FatePT 타로관 — 카드가 짚어주는 지금의 흐름. 오늘의 타로, 그 사람의 속마음, 우리 관계의 흐름을 만나보세요.",
  alternates: { canonical: "/tarot" },
  openGraph: {
    title: "FatePT 타로",
    description: "카드가 짚어주는 지금의 흐름 — 오늘의 타로 · 그 사람의 속마음 · 우리 관계의 흐름",
    type: "website",
    locale: "ko_KR",
  },
};

// 타로관 테마: 기존 네이비 캔버스 위에 골드 액센트
const GOLD = "#c9a24b";

export default function TarotHomePage() {
  const products = [...TAROT_PRODUCTS].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="container py-12 max-w-2xl">
      <header className="mb-10 text-center">
        <p className="text-xs font-mono mb-2" style={{ color: GOLD }}>
          FATEPT · TAROT
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">카드가 짚어주는 지금의 흐름</h1>
        <p className="mt-3 text-sm text-body leading-relaxed">
          질문을 떠올리고 카드를 뽑아보세요. 지금 당신에게 필요한 메시지를 정성껏 읽어드립니다.
        </p>
      </header>

      <div className="space-y-4">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/tarot/${p.slug}`}
            className="block rounded-2xl border p-6 transition-colors hover:border-[color:var(--gold)]"
            style={{ borderColor: "#2c3c5b", ["--gold" as string]: GOLD }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-ink">{p.name}</h2>
                  <span
                    className="text-[10px] font-mono rounded-full px-2 py-0.5"
                    style={{ color: GOLD, border: `1px solid ${GOLD}` }}
                  >
                    {p.cardCount}장
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-body leading-relaxed">{p.description}</p>
                <p className="mt-1 text-xs text-mute">
                  {p.publish === "auto" ? "결제 후 바로 확인" : "검수 후 발행 (보통 24시간 이내)"}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-mono font-medium" style={{ color: GOLD }}>
                  {formatKRW(p.price)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-[11px] text-mute leading-relaxed">
        타로는 단정적 예언이 아니라, 지금 흐름을 비추고 선택을 돕는 도구입니다.
      </p>
    </div>
  );
}
