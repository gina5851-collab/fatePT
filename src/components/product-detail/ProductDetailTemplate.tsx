import Link from "next/link";
import { formatKRW } from "@/lib/utils";
import type { CatalogProduct } from "@/config/catalog";
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

// 공통 상품 상세 템플릿 — 사주·타로 모두 이 컴포넌트 + 카탈로그 데이터로 렌더링.
// 결제/주문 로직은 children(기존 폼)이 그대로 담당한다.
export function ProductDetailTemplate({ product: p, price, related, reviews = [], children }: Props) {
  const isFree = price === 0;
  const ctaPrice = isFree ? "무료" : formatKRW(price);
  const ctaLabel = `${ctaPrice} · ${p.delivery.timeText}`;
  const discount =
    p.originalPrice && p.originalPrice > price ? Math.round((1 - price / p.originalPrice) * 100) : null;

  return (
    <div className="bg-sf-bg text-sf-ink">
      <div className="container max-w-3xl py-10 md:py-14">
        {/* ── ① 상품 히어로 ── */}
        <header className="mb-10">
          <nav className="flex items-center gap-1.5 text-[12px] text-sf-mute mb-4">
            <Link href="/products" className="hover:text-sf-ink">전체 상품</Link>
            <span>/</span>
            <Link href={p.serviceType === "tarot" ? "/tarot" : "/saju"} className="hover:text-sf-ink">
              {p.serviceType === "tarot" ? "타로" : "사주"}
            </Link>
            <span>/</span>
            <span className="text-sf-body">{p.displayName}</span>
          </nav>

          <div className="flex items-center gap-1.5 mb-3">
            <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${p.serviceType === "tarot" ? "bg-sf-navy text-sf-amber" : "bg-sf-panel-soft text-sf-ink border border-sf-line"}`}>
              {p.serviceType === "tarot" ? "타로" : "사주"}
            </span>
            {p.badge ? (
              <span className="text-[11px] font-semibold rounded-full bg-sf-amber text-sf-navy px-2 py-0.5">{p.badge}</span>
            ) : null}
            <span className="text-[11px] rounded-full border border-sf-line bg-sf-panel text-sf-body px-2 py-0.5">
              {p.delivery.mode === "auto" ? "⚡ 자동 발행" : "✍️ 검수 후 발행"}
            </span>
          </div>

          {/* ② 강한 헤드라인 */}
          <h1 className="text-[28px] md:text-[36px] font-extrabold leading-[1.25] tracking-tight">
            {p.headline}
          </h1>
          <p className="mt-3 text-[15px] text-sf-body">{p.shortDescription}</p>

          {/* 가격 + 첫 CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="flex items-baseline gap-2">
              {p.originalPrice && p.originalPrice > price ? (
                <span className="text-sm font-mono text-sf-mute line-through">{formatKRW(p.originalPrice)}</span>
              ) : null}
              <span className="text-[26px] font-mono font-bold">{ctaPrice}</span>
              {discount ? <span className="text-xs font-bold text-sf-amber-deep">{discount}% OFF</span> : null}
            </div>
            <a
              href="#order-form"
              className="rounded-xl bg-sf-amber px-5 py-3 text-[15px] font-bold text-sf-navy hover:opacity-90 transition-opacity"
            >
              {isFree ? "무료로 받아보기" : `${ctaPrice}로 시작하기`} →
            </a>
          </div>
          <p className="mt-2 text-[12px] text-sf-mute">{p.delivery.timeText} · 결과 링크 영구 소장</p>
        </header>

        {/* ── ③ 고객 고민 공감 ── */}
        {p.empathy.length > 0 && (
          <section className="mb-10 rounded-2xl bg-sf-panel border border-sf-line p-6">
            {p.empathy.map((line, i) => (
              <p key={i} className={`text-[15px] leading-[1.8] text-sf-body ${i > 0 ? "mt-3" : ""}`}>
                {line}
              </p>
            ))}
          </section>
        )}

        {/* ── ④ 이 상품이 답하는 질문 ── */}
        {p.questions.length > 0 && (
          <section className="mb-10">
            <SectionTitle no="01" title="이 리포트가 답하는 질문" />
            <ul className="space-y-2.5">
              {p.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-sf-line bg-sf-panel px-4 py-3.5">
                  <span className="mt-0.5 text-sf-amber-deep font-bold">Q.</span>
                  <span className="text-[14px] font-medium leading-relaxed">{q}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── ⑤ 이런 사람에게 필요 ── */}
        {p.forWhom.length > 0 && (
          <section className="mb-10">
            <SectionTitle no="02" title="이런 분에게 필요해요" />
            <ul className="space-y-1.5">
              {p.forWhom.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-[14px] text-sf-body leading-relaxed">
                  <span className="mt-0.5 text-sf-amber">✓</span>
                  {w}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── ⑥ 결과 전체 목차 ── */}
        {p.resultToc.length > 0 && (
          <section className="mb-10">
            <SectionTitle no="03" title={`결과에 담기는 내용 — 총 ${p.resultToc.length}개 항목`} />
            <ol className="rounded-2xl border border-sf-line bg-sf-panel divide-y divide-sf-line">
              {p.resultToc.map((t, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-[11px] font-mono text-sf-mute w-6">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[14px]">{t}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── ⑦ 결과 예시 ── */}
        <section className="mb-10">
          <SectionTitle no="04" title="결과는 이런 모습으로 나옵니다" />
          <SampleViewer sample={p.sample} />
        </section>

        {/* ── ⑧ 분석/리딩 방식 ── */}
        {p.methodNote && (
          <section className="mb-10">
            <SectionTitle no="05" title={p.serviceType === "tarot" ? "리딩 방식" : "분석 방식"} />
            <p className="text-[14px] text-sf-body leading-[1.8]">{p.methodNote}</p>
          </section>
        )}

        {/* ── ⑨ 신청 과정 + ⑩ 발행 방식 + ⑪ 제공 시간 ── */}
        {p.process.length > 0 && (
          <section className="mb-10">
            <SectionTitle no="06" title="진행 과정" />
            <ol className="space-y-2.5">
              {p.process.map((step, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sf-navy text-sf-amber text-[12px] font-bold">
                    {i + 1}
                  </span>
                  <span className="text-[14px] text-sf-body">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 rounded-xl bg-sf-panel-soft border border-sf-line px-4 py-3 text-[13px] text-sf-body">
              {p.delivery.mode === "auto"
                ? `⚡ 자동 발행 — ${p.delivery.timeText}. 결제 즉시 결과 페이지가 열립니다.`
                : `✍️ 검수 후 발행 — ${p.delivery.timeText}. 초안을 사람이 확인·정돈한 뒤 발행해 드립니다.`}
            </p>
          </section>
        )}

        {/* ── ⑫ 가격 + ⑬ 중간 CTA ── */}
        <section className="mb-10 rounded-2xl bg-sf-navy p-6 md:p-8 text-center">
          <p className="text-[13px] text-charcoal mb-1">{p.displayName}</p>
          <div className="flex items-baseline justify-center gap-2">
            {p.originalPrice && p.originalPrice > price ? (
              <span className="text-sm font-mono text-mute line-through">{formatKRW(p.originalPrice)}</span>
            ) : null}
            <span className="text-[30px] font-mono font-bold text-ink">{ctaPrice}</span>
            {discount ? <span className="text-xs font-bold text-sf-amber">{discount}% OFF</span> : null}
          </div>
          <p className="mt-1 text-[12px] text-body">{p.delivery.timeText}</p>
          <a
            href="#order-form"
            className="mt-5 inline-block w-full sm:w-auto rounded-xl bg-sf-amber px-10 py-3.5 text-[15px] font-bold text-sf-navy hover:opacity-90 transition-opacity"
          >
            {isFree ? "무료로 받아보기" : `${ctaPrice} · ${p.delivery.timeText}`} →
          </a>
        </section>

        {/* ── 실제 후기 (0건이면 미노출 — 가짜 후기 금지) ── */}
        {reviews.length > 0 && (
          <section className="mb-10">
            <SectionTitle no="—" title="실제 이용 후기" />
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-xl border border-sf-line bg-sf-panel px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span aria-label={`${r.rating}점`} className="text-[13px]">
                      <span className="text-sf-amber-deep">{"★".repeat(r.rating)}</span>
                      <span className="text-sf-line-strong">{"★".repeat(5 - r.rating)}</span>
                    </span>
                    <span className="text-[11px] font-mono text-sf-mute">
                      {new Date(r.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] text-sf-body leading-relaxed">{r.content}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── ⑭ FAQ ── */}
        {p.faq.length > 0 && (
          <section className="mb-10">
            <SectionTitle no="07" title="자주 묻는 질문" />
            <Faq items={p.faq} />
          </section>
        )}

        {/* ── ⑮ 환불·주의 안내 ── */}
        <section className="mb-12 rounded-xl border border-sf-line bg-sf-panel-soft px-5 py-4">
          <p className="text-[12px] text-sf-body leading-relaxed">
            {p.caution && <>⚠️ {p.caution}<br /></>}
            결제·환불 기준은{" "}
            <Link href="/legal/refund-policy" className="underline underline-offset-2 text-sf-ink">
              환불정책
            </Link>
            을 따릅니다. 문의는 하단 고객센터로 연락해 주세요.
          </p>
        </section>

        {/* ── ⑯ 기존 입력 폼 (네이비 패널 — 기존 다크 토큰 컴포넌트 그대로 사용) ── */}
        <section id="order-form" className="mb-14 scroll-mt-20">
          <SectionTitle no="08" title={p.serviceType === "tarot" ? "질문을 남기고 시작하기" : "내 정보 입력하고 시작하기"} />
          <div className="rounded-2xl bg-sf-navy p-5 md:p-7">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[13px] font-semibold text-ink">{p.displayName}</p>
              <span className="text-[11px] text-body bg-sf-navy-soft border border-hairline rounded-full px-2.5 py-1">
                {ctaLabel}
              </span>
            </div>
            {children}
          </div>
        </section>

        {/* ── ⑰ 관련 상품 ── */}
        {related.length > 0 && (
          <section className="mb-8">
            <SectionTitle no="09" title="함께 보면 좋은 상품" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <ProductCard key={r.product.slug} product={r.product} price={r.price} compact />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── ⑱ 모바일 하단 고정 CTA ── */}
      <StickyCta label={`${ctaLabel} →`} targetId="order-form" />
    </div>
  );
}

function SectionTitle({ no, title }: { no: string; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="text-[11px] font-mono text-sf-amber-deep">{no}</span>
      <h2 className="text-[17px] font-bold">{title}</h2>
    </div>
  );
}
