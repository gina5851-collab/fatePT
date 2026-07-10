import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { publishedProducts, getCatalogProduct, CONCERN_LABEL } from "@/config/catalog";
import { fetchDbProducts, resolvePrice } from "@/lib/catalog-db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SampleViewer } from "@/components/storefront/SampleViewer";
import { Faq } from "@/components/storefront/Faq";

type Review = { id: string; rating: number; content: string; created_at: string };

const HOME_FAQ = [
  {
    q: "운명PT는 뭐가 다른가요?",
    a: "단정적인 예언 대신, 생년월일 기반 명식과 카드에서 '반복되는 패턴'을 읽고 오늘 할 수 있는 행동으로 정리해 드립니다. 결과는 링크로 영구 소장돼요.",
  },
  {
    q: "결과는 언제 받을 수 있나요?",
    a: "사주 리포트와 오늘의 타로는 결제 후 바로 확인됩니다. 3장·5장 타로는 사람이 검수한 뒤 보통 24시간 이내에 발행돼요. 각 상품 상세에 제공 시간이 표시돼 있어요.",
  },
  {
    q: "태어난 시간을 몰라도 되나요?",
    a: "네. '시 모름'을 선택하면 연·월·일 세 기둥으로 분석합니다. 시간이 있으면 더 정밀해져요.",
  },
  {
    q: "환불이 되나요?",
    a: "결과 발행 전에는 전액 환불이 가능하고, 디지털 콘텐츠 특성상 열람 후에는 제한될 수 있어요. 자세한 기준은 환불정책 페이지에서 확인해 주세요.",
  },
];

export default async function HomePage() {
  const all = publishedProducts();
  const dbMap = await fetchDbProducts(all.map((p) => p.slug));
  const products = all.filter((p) => {
    const row = dbMap.get(p.slug);
    return !row || row.is_active;
  });
  const price = (slug: string) => {
    const p = getCatalogProduct(slug)!;
    return resolvePrice(dbMap.get(slug), p.priceHint);
  };
  const bySlug = (slugs: string[]) =>
    slugs
      .map((s) => products.find((p) => p.slug === s))
      .filter((p): p is NonNullable<typeof p> => !!p);

  const featured = bySlug(["premium-saju", "tarot-daily", "reunion-check"]);
  const sajuRow = bySlug(["free-taste", "inbody", "crush-kit", "premium-saju"]);
  const loveRow = bySlug(["crush-kit", "reunion-check", "tarot-inner-mind", "tarot-relationship"]);
  const tarotRow = products.filter((p) => p.serviceType === "tarot");
  const entryRow = bySlug(["free-taste", "tarot-daily", "inbody"]);
  const sajuSampleProduct = getCatalogProduct("premium-saju");
  const tarotSampleProduct = getCatalogProduct("tarot-inner-mind");

  // 실제 후기만 — 0건이면 섹션 자동 숨김
  let reviews: Review[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, content, created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(3);
    reviews = data ?? [];
  }

  return (
    <div className="bg-sf-bg">
      {/* ── 2. 히어로 ── */}
      <section className="bg-sf-navy">
        <div className="container pt-16 pb-14 md:pt-24 md:pb-20 text-center">
          <h1 className="text-[32px] md:text-[48px] font-extrabold leading-[1.2] tracking-tight text-ink">
            왜 나는 늘
            <br />
            <span className="text-sf-amber">같은 문제</span>에서 막힐까요?
          </h1>
          <p className="mt-6 text-[15px] md:text-[16px] leading-[1.75] text-charcoal max-w-md mx-auto">
            당신이 부족해서가 아닙니다.
            <br />
            오래 버틴 사람에게는 <span className="text-ink font-semibold">반복되는 패턴</span>이 남습니다.
          </p>
          <p className="mt-4 text-[13px] text-body max-w-sm mx-auto">
            운명PT는 예언 대신 패턴을 읽습니다 — 사주와 타로로, 관계·돈·일·감정의 흐름을.
          </p>
          <div className="mt-8 flex flex-col items-center gap-2.5 max-w-[340px] mx-auto px-4">
            <Link
              href="/start"
              className="block w-full rounded-xl bg-sf-amber py-4 text-[16px] font-bold text-sf-navy hover:opacity-90 transition-opacity"
            >
              1분 무료 — 내 반복 패턴 확인하기 →
            </Link>
            <Link
              href="/products"
              className="text-[13px] text-body hover:text-ink underline underline-offset-4"
            >
              전체 상품 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. 신뢰 영역 (사실만) ── */}
      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { t: "단정하지 않습니다", d: "'된다/안 된다' 예언 대신, 반복되는 패턴과 그 이유를 설명합니다." },
            { t: "패턴으로 설명합니다", d: "만세력 기반 명식 계산과 카드 리딩으로 관계·돈·일·감정의 구조를 읽습니다." },
            { t: "행동으로 끝냅니다", d: "모든 결과는 '오늘 할 수 있는 것'으로 마무리됩니다. 결과 링크는 영구 소장." },
          ].map((v) => (
            <div key={v.t} className="rounded-xl border border-sf-line bg-sf-panel p-5">
              <p className="text-[14px] font-bold text-sf-ink mb-1.5">{v.t}</p>
              <p className="text-[13px] text-sf-body leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. 대표 추천 상품 ── */}
      <SectionShell eyebrow="BEST" title="지금 가장 많이 찾는 리포트" href="/products" linkLabel="전체 상품">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} price={price(p.slug)} />
          ))}
        </div>
      </SectionShell>

      {/* ── 5. 고민별 상품 탐색 ── */}
      <SectionShell eyebrow="CONCERN" title="지금 고민이 무엇인가요?">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(
            [
              { tag: "love", emoji: "💘", desc: "다가가도 될까, 그 사람 마음은?" },
              { tag: "reunion", emoji: "🔄", desc: "다시 이어질 수 있을까?" },
              { tag: "money", emoji: "💼", desc: "왜 벌어도 안 남을까?" },
              { tag: "self", emoji: "🪞", desc: "왜 나는 매번 이럴까?" },
            ] as const
          ).map((c) => (
            <Link
              key={c.tag}
              href={`/products?tab=${c.tag}`}
              className="rounded-xl border border-sf-line bg-sf-panel p-5 hover:border-sf-amber transition-colors"
            >
              <p className="text-2xl mb-2">{c.emoji}</p>
              <p className="text-[14px] font-bold text-sf-ink">{CONCERN_LABEL[c.tag]}</p>
              <p className="mt-1 text-[12px] text-sf-body leading-relaxed">{c.desc}</p>
            </Link>
          ))}
        </div>
      </SectionShell>

      {/* ── 6. 사주 상품 ── */}
      <SectionShell eyebrow="SAJU" title="사주 — 반복 패턴의 측정" href="/saju" linkLabel="사주 전체">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sajuRow.map((p) => (
            <ProductCard key={p.slug} product={p} price={price(p.slug)} compact />
          ))}
        </div>
      </SectionShell>

      {/* ── 7. 연애·재회 상품 ── */}
      <SectionShell eyebrow="LOVE & REUNION" title="연애 · 재회 — 마음이 급한 순간" href="/products?tab=love" linkLabel="연애·궁합 전체">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loveRow.map((p) => (
            <ProductCard key={p.slug} product={p} price={price(p.slug)} compact />
          ))}
        </div>
      </SectionShell>

      {/* ── 8. 타로 상품 ── */}
      <SectionShell eyebrow="TAROT" title="타로 — 지금 흐름을 비추는 카드" href="/tarot" linkLabel="타로 전체">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tarotRow.map((p) => (
            <ProductCard key={p.slug} product={p} price={price(p.slug)} compact />
          ))}
        </div>
      </SectionShell>

      {/* ── 9. 저가 입문 ── */}
      <section className="container py-8">
        <div className="rounded-2xl border border-sf-line bg-sf-panel p-6 md:p-8">
          <p className="text-[15px] font-bold text-sf-ink mb-1">처음이라면, 가볍게 시작하세요</p>
          <p className="text-[13px] text-sf-body mb-5">무료 진단과 990원 타로 한 장으로 결과 스타일을 먼저 확인해 볼 수 있어요.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {entryRow.map((p) => (
              <ProductCard key={p.slug} product={p} price={price(p.slug)} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── 10 & 11. 결과 예시 ── */}
      <SectionShell eyebrow="SAMPLE" title="결과는 이런 모습으로 나옵니다">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {sajuSampleProduct && (
            <div>
              <p className="text-[13px] font-semibold text-sf-ink mb-2.5">📜 사주 리포트 예시</p>
              <SampleViewer sample={sajuSampleProduct.sample} />
              <Link href="/products/premium-saju" className="mt-3 inline-block text-[13px] font-medium text-sf-amber-deep underline underline-offset-4">
                전체 사주 리포트 보기 →
              </Link>
            </div>
          )}
          {tarotSampleProduct && (
            <div>
              <p className="text-[13px] font-semibold text-sf-ink mb-2.5">🃏 타로 리딩 예시</p>
              <SampleViewer sample={tarotSampleProduct.sample} />
              <Link href="/products/tarot-inner-mind" className="mt-3 inline-block text-[13px] font-medium text-sf-amber-deep underline underline-offset-4">
                그 사람의 속마음 보기 →
              </Link>
            </div>
          )}
        </div>
      </SectionShell>

      {/* ── 12. 이용 과정 ── */}
      <SectionShell eyebrow="HOW IT WORKS" title="이용 방법">
        <ol className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { t: "상품 선택", d: "고민에 맞는 리포트나 타로를 고릅니다" },
            { t: "정보 입력", d: "생년월일 또는 질문을 입력합니다" },
            { t: "결제", d: "카드 결제 또는 무통장입금" },
            { t: "결과 확인", d: "즉시 확인 (검수형은 24시간 내 발행)" },
          ].map((s, i) => (
            <li key={s.t} className="rounded-xl border border-sf-line bg-sf-panel p-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sf-navy text-sf-amber text-[12px] font-bold mb-3">
                {i + 1}
              </span>
              <p className="text-[14px] font-bold text-sf-ink">{s.t}</p>
              <p className="mt-1 text-[12px] text-sf-body leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
      </SectionShell>

      {/* ── 13. 실제 후기 (0건이면 자동 숨김) ── */}
      {reviews.length > 0 && (
        <SectionShell eyebrow="REVIEWS" title="실제 이용 후기">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-sf-line bg-sf-panel p-5">
                <span className="text-[13px]">
                  <span className="text-sf-amber-deep">{"★".repeat(r.rating)}</span>
                  <span className="text-sf-line-strong">{"★".repeat(5 - r.rating)}</span>
                </span>
                <p className="mt-2 text-[13px] text-sf-body leading-relaxed line-clamp-4">{r.content}</p>
                <p className="mt-2 text-[11px] font-mono text-sf-mute">
                  {new Date(r.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {/* ── 14. FAQ ── */}
      <SectionShell eyebrow="FAQ" title="자주 묻는 질문">
        <Faq items={HOME_FAQ} />
      </SectionShell>

      {/* ── 15. 하단 CTA ── */}
      <section className="bg-sf-navy mt-8">
        <div className="container py-14 md:py-16 text-center">
          <p className="text-[22px] md:text-[26px] font-extrabold text-ink leading-snug">
            1분이면, 내 반복 패턴이 보입니다
          </p>
          <p className="mt-2 text-[13px] text-body">무료로 시작하고, 필요한 만큼만 깊게 들어가세요.</p>
          <Link
            href="/start"
            className="mt-6 inline-block rounded-xl bg-sf-amber px-10 py-3.5 text-[15px] font-bold text-sf-navy hover:opacity-90 transition-opacity"
          >
            무료 진단 시작하기 →
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionShell({
  eyebrow,
  title,
  href,
  linkLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container py-8 md:py-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] font-mono text-sf-amber-deep mb-1.5">{eyebrow}</p>
          <h2 className="text-[20px] md:text-[22px] font-extrabold tracking-tight text-sf-ink">{title}</h2>
        </div>
        {href && linkLabel ? (
          <Link href={href} className="shrink-0 text-[13px] font-medium text-sf-body hover:text-sf-ink underline underline-offset-4">
            {linkLabel} →
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
