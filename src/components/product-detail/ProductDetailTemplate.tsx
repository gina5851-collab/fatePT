import Link from "next/link";
import { formatKRW } from "@/lib/utils";
import type { CatalogProduct } from "@/config/catalog";
import { productTheme, type ArtKind } from "@/config/product-themes";
import {
  SajuWheel,
  StarField,
  TarotFan,
  ReunionLines,
  CrushOrbit,
  MeasureGrid,
  GateArch,
} from "@/components/storefront/graphics";
import { SampleViewer } from "@/components/storefront/SampleViewer";
import { Faq } from "@/components/storefront/Faq";
import { ProductCard } from "@/components/storefront/ProductCard";
import { StickyCta } from "@/components/storefront/StickyCta";

type RelatedEntry = { product: CatalogProduct; price: number };

type Review = { id: string; rating: number; content: string; created_at: string };

type Props = {
  product: CatalogProduct;
  price: number; // DB 우선 표시 가격
  related: RelatedEntry[];
  reviews?: Review[]; // 실제 후기만 — 0건이면 섹션 자동 숨김
  children: React.ReactNode; // 기존 입력 폼 (SajuForm / TarotOrderForm) — 네이비 패널에 렌더
};

function HeroArt({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case "wheel":
      return <SajuWheel className="absolute -right-20 top-1/2 -translate-y-1/2 w-[380px] md:w-[520px] opacity-60 animate-sf-spin-slow" />;
    case "tarot-1":
      return <TarotFan count={1} className="absolute right-2 md:right-14 bottom-0 w-[150px] md:w-[220px] opacity-90" />;
    case "tarot-3":
      return <TarotFan count={3} className="absolute -right-4 md:right-8 bottom-0 w-[210px] md:w-[320px] opacity-90" />;
    case "tarot-5":
      return <TarotFan count={5} className="absolute -right-8 md:right-2 bottom-0 w-[250px] md:w-[380px] opacity-90" />;
    case "reunion":
      return <ReunionLines className="absolute right-0 bottom-4 w-[70%] md:w-[520px] opacity-80" />;
    case "crush":
      return <CrushOrbit className="absolute right-0 bottom-2 w-[72%] md:w-[520px] opacity-80" />;
    case "measure":
      return <MeasureGrid className="absolute right-0 bottom-2 w-[70%] md:w-[500px] opacity-80" />;
    case "gate":
      return <GateArch className="absolute right-0 md:right-10 bottom-0 w-[220px] md:w-[360px] opacity-80" />;
  }
}

// 공통 상품 상세 템플릿 — 사주·타로 모두 이 컴포넌트 + 카탈로그 데이터로 렌더링.
// 결제/주문 로직은 children(기존 폼)이 그대로 담당한다.
export function ProductDetailTemplate({ product: p, price, related, reviews = [], children }: Props) {
  const t = productTheme(p.slug);
  const isFree = price === 0;
  const ctaPrice = isFree ? "무료" : formatKRW(price);
  const ctaLabel = `${ctaPrice} · ${p.delivery.timeText}`;
  const discount =
    p.originalPrice && p.originalPrice > price ? Math.round((1 - price / p.originalPrice) * 100) : null;

  return (
    <div className="bg-sf-bg text-sf-ink">
      {/* ══ ① 상품 히어로 — 상품별 테마 배경 + 자체 그래픽 ══ */}
      <section className={`relative overflow-hidden ${t.bg}`}>
        <StarField className="absolute inset-0 w-full h-full opacity-40" />
        <HeroArt kind={t.art} />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="container relative py-14 md:py-20 min-h-[380px] md:min-h-[440px] flex flex-col justify-center">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-white/50 mb-5">
            <Link href="/products" className="hover:text-white">전체 상품</Link>
            <span>/</span>
            <Link href={p.serviceType === "tarot" ? "/tarot" : "/saju"} className="hover:text-white">
              {p.serviceType === "tarot" ? "타로" : "사주"}
            </Link>
            <span>/</span>
            <span className="text-white/80">{p.displayName}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[12px] font-bold tracking-widest ${t.accentText}`}>{t.categoryLabel}</span>
            {p.badge ? (
              <span className="text-[11px] font-bold rounded-full bg-sf-amber text-sf-navy px-2.5 py-0.5">{p.badge}</span>
            ) : null}
            <span className="text-[11px] rounded-full border border-white/20 bg-white/10 text-white/85 px-2.5 py-0.5">
              {p.delivery.mode === "auto" ? "⚡ 자동 발행" : "✍️ 검수 후 발행"}
            </span>
          </div>

          {/* ② 강한 헤드라인 */}
          <h1 className="max-w-2xl text-[32px] md:text-[48px] font-extrabold leading-[1.2] tracking-tight text-white">
            {p.headline}
          </h1>
          <p className="mt-4 text-[15.5px] md:text-[17px] text-[#c6cfe2] max-w-xl">{p.shortDescription}</p>

          {/* 가격 + 첫 CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
            <div className="flex items-baseline gap-2.5">
              {p.originalPrice && p.originalPrice > price ? (
                <span className="text-[15px] font-mono text-white/40 line-through">{formatKRW(p.originalPrice)}</span>
              ) : null}
              <span className="text-[34px] md:text-[40px] font-mono font-extrabold text-white">{ctaPrice}</span>
              {discount ? <span className="text-[13px] font-extrabold text-sf-gold">{discount}% OFF</span> : null}
            </div>
            <a
              href="#order-form"
              className="rounded-2xl bg-sf-amber px-7 py-4 text-[16px] font-extrabold text-sf-navy hover:opacity-90 transition-opacity sf-glow"
            >
              {isFree ? "무료로 받아보기" : `${ctaPrice}로 시작하기`} →
            </a>
          </div>
          <p className="mt-3 text-[12.5px] text-white/55">{p.delivery.timeText} · 결과 링크 영구 소장</p>
        </div>
      </section>

      <div className="container max-w-4xl py-12 md:py-16">
        {/* ══ ③ 고객 고민 공감 ══ */}
        {p.empathy.length > 0 && (
          <section className="mb-14 rounded-3xl bg-sf-panel border border-sf-line p-7 md:p-10">
            {p.empathy.map((line, i) => (
              <p key={i} className={`text-[16px] md:text-[18px] leading-[1.9] text-sf-body ${i > 0 ? "mt-4" : ""}`}>
                {line}
              </p>
            ))}
          </section>
        )}

        {/* ══ ④ 이 상품이 답하는 질문 ══ */}
        {p.questions.length > 0 && (
          <section className="mb-14">
            <SectionTitle no="01" title="이 리포트가 답하는 질문" />
            <ul className="space-y-3">
              {p.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-4 rounded-2xl border border-sf-line bg-sf-panel px-6 py-5">
                  <span className="mt-0.5 text-sf-amber-deep font-extrabold text-[17px]">Q.</span>
                  <span className="text-[15.5px] md:text-[17px] font-bold leading-relaxed">{q}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ══ ⑤ 이런 사람에게 필요 ══ */}
        {p.forWhom.length > 0 && (
          <section className="mb-14">
            <SectionTitle no="02" title="이런 분에게 필요해요" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {p.forWhom.map((w, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-xl bg-sf-panel-soft border border-sf-line px-5 py-4 text-[14.5px] text-sf-body leading-relaxed">
                  <span className="mt-0.5 text-sf-amber">✓</span>
                  {w}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ══ ⑥ 결과 전체 목차 — 이미지형 카드 ══ */}
        {p.resultToc.length > 0 && (
          <section className="mb-14">
            <SectionTitle no="03" title={`결과에 담기는 내용 — 총 ${p.resultToc.length}개 항목`} />
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {p.resultToc.map((toc, i) => (
                <li
                  key={i}
                  className={`relative overflow-hidden rounded-2xl border px-5 py-5 ${
                    i === 0 ? `${t.bg} border-white/10` : "bg-sf-panel border-sf-line"
                  }`}
                >
                  <span className={`text-[13px] font-mono font-extrabold ${i === 0 ? "text-sf-gold" : "text-sf-amber-deep"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className={`mt-1.5 text-[15px] font-bold leading-snug ${i === 0 ? "text-white" : "text-sf-ink"}`}>
                    {toc}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ══ ⑦ 결과 예시 — 크게 ══ */}
        <section className="mb-14">
          <SectionTitle no="04" title="결과는 이런 모습으로 나옵니다" />
          <SampleViewer sample={p.sample} />
        </section>

        {/* ══ ⑧ 분석/리딩 방식 ══ */}
        {p.methodNote && (
          <section className="mb-14">
            <SectionTitle no="05" title={p.serviceType === "tarot" ? "리딩 방식" : "분석 방식"} />
            <p className="text-[15px] md:text-[16px] text-sf-body leading-[1.9]">{p.methodNote}</p>
          </section>
        )}

        {/* ══ ⑨ 신청 과정 + ⑩ 발행 방식 + ⑪ 제공 시간 ══ */}
        {p.process.length > 0 && (
          <section className="mb-14">
            <SectionTitle no="06" title="진행 과정" />
            <ol className="relative space-y-0">
              {p.process.map((step, i) => (
                <li key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
                  {i < p.process.length - 1 && (
                    <span className="absolute left-[17px] top-9 bottom-0 w-[2px] bg-gradient-to-b from-sf-amber/70 to-sf-line" />
                  )}
                  <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sf-navy text-sf-gold text-[14px] font-extrabold">
                    {i + 1}
                  </span>
                  <span className="pt-1.5 text-[15px] md:text-[16px] text-sf-body">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-2xl bg-sf-panel-soft border border-sf-line px-5 py-4 text-[14px] text-sf-body leading-relaxed">
              {p.delivery.mode === "auto"
                ? `⚡ 자동 발행 — ${p.delivery.timeText}. 결제 즉시 결과 페이지가 열립니다.`
                : `✍️ 검수 후 발행 — ${p.delivery.timeText}. 초안을 사람이 확인·정돈한 뒤 발행해 드립니다.`}
            </p>
          </section>
        )}

        {/* ══ ⑫ 가격 블록 + ⑬ 중간 CTA — 상품 테마 강조 ══ */}
        <section className={`relative overflow-hidden mb-14 rounded-3xl ${t.bg} border border-white/10 p-8 md:p-12 text-center`}>
          <StarField className="absolute inset-0 w-full h-full opacity-30" />
          <div className="relative">
            <p className={`text-[13px] font-bold tracking-widest ${t.accentText} mb-2`}>{t.categoryLabel}</p>
            <p className="text-[19px] md:text-[22px] font-extrabold text-white">{p.displayName}</p>
            <div className="mt-3 flex items-baseline justify-center gap-2.5">
              {p.originalPrice && p.originalPrice > price ? (
                <span className="text-[14px] font-mono text-white/40 line-through">{formatKRW(p.originalPrice)}</span>
              ) : null}
              <span className="text-[38px] md:text-[44px] font-mono font-extrabold text-white">{ctaPrice}</span>
              {discount ? <span className="text-[13px] font-extrabold text-sf-gold">{discount}% OFF</span> : null}
            </div>
            <p className="mt-1.5 text-[13px] text-white/60">{p.delivery.timeText}</p>
            <a
              href="#order-form"
              className="mt-7 inline-block w-full sm:w-auto rounded-2xl bg-sf-amber px-12 py-4 text-[16px] font-extrabold text-sf-navy hover:opacity-90 transition-opacity"
            >
              {isFree ? "무료로 받아보기" : `${ctaPrice} · ${p.delivery.timeText}`} →
            </a>
          </div>
        </section>

        {/* ══ 실제 후기 (0건이면 미노출 — 가짜 후기 금지) ══ */}
        {reviews.length > 0 && (
          <section className="mb-14">
            <SectionTitle no="—" title="실제 이용 후기" />
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-2xl border border-sf-line bg-sf-panel px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span aria-label={`${r.rating}점`} className="text-[15px]">
                      <span className="text-sf-amber-deep">{"★".repeat(r.rating)}</span>
                      <span className="text-sf-line-strong">{"★".repeat(5 - r.rating)}</span>
                    </span>
                    <span className="text-[11px] font-mono text-sf-mute">
                      {new Date(r.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[14px] text-sf-body leading-[1.8]">{r.content}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ══ ⑭ FAQ ══ */}
        {p.faq.length > 0 && (
          <section className="mb-14">
            <SectionTitle no="07" title="자주 묻는 질문" />
            <Faq items={p.faq} />
          </section>
        )}

        {/* ══ ⑮ 환불·주의 안내 ══ */}
        <section className="mb-16 rounded-2xl border border-sf-line bg-sf-panel-soft px-6 py-5">
          <p className="text-[13px] text-sf-body leading-[1.8]">
            {p.caution && <>⚠️ {p.caution}<br /></>}
            결제·환불 기준은{" "}
            <Link href="/legal/refund-policy" className="underline underline-offset-2 text-sf-ink">
              환불정책
            </Link>
            을 따릅니다. 문의는 하단 고객센터로 연락해 주세요.
          </p>
        </section>

        {/* ══ ⑯ 기존 입력 폼 (네이비 패널 — 기존 다크 토큰 컴포넌트 그대로 사용) ══ */}
        <section id="order-form" className="mb-16 scroll-mt-24">
          <SectionTitle no="08" title={p.serviceType === "tarot" ? "질문을 남기고 시작하기" : "내 정보 입력하고 시작하기"} />
          <div className="rounded-3xl bg-sf-navy p-6 md:p-9 border border-sf-navy-soft">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[15px] font-extrabold text-ink">{p.displayName}</p>
              <span className="text-[12px] text-body bg-sf-navy-soft border border-hairline rounded-full px-3 py-1.5">
                {ctaLabel}
              </span>
            </div>
            {children}
          </div>
        </section>

        {/* ══ ⑰ 관련 상품 ══ */}
        {related.length > 0 && (
          <section className="mb-8">
            <SectionTitle no="09" title="함께 보면 좋은 상품" />
            <div className="grid grid-cols-1 gap-3">
              {related.map((r) => (
                <ProductCard key={r.product.slug} product={r.product} price={r.price} variant="compact" />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ══ ⑱ 모바일 하단 고정 CTA ══ */}
      <StickyCta label={`${ctaLabel} →`} targetId="order-form" />
    </div>
  );
}

function SectionTitle({ no, title }: { no: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[12px] font-mono font-bold text-sf-amber-deep">{no}</span>
      <h2 className="text-[21px] md:text-[26px] font-extrabold tracking-tight">{title}</h2>
    </div>
  );
}
