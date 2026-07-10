import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { publishedProducts, getCatalogProduct } from "@/config/catalog";
import { fetchDbProducts, resolvePrice } from "@/lib/catalog-db";
import { formatKRW } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SampleViewer } from "@/components/storefront/SampleViewer";
import { Faq } from "@/components/storefront/Faq";
import {
  SajuWheel,
  StarField,
  TarotFan,
  ReunionLines,
  CrushOrbit,
  MeasureGrid,
} from "@/components/storefront/graphics";

type Review = { id: string; rating: number; content: string; created_at: string };

const HOME_FAQ = [
  {
    q: "운명PT는 뭐가 다른가요?",
    a: "단정적인 예언 대신, 생년월일 기반 명식과 카드에서 '반복되는 패턴'을 읽고 오늘 할 수 있는 행동으로 정리해 드립니다. 결과는 링크로 영구 소장돼요.",
  },
  {
    q: "결과는 언제 받을 수 있나요?",
    a: "사주 리포트와 타로 모두 결제 즉시 자동 발행됩니다. 기다림 없이 바로 결과 페이지가 열리고, 링크로 언제든 다시 볼 수 있어요.",
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

// 신뢰 영역 — 허위 수치 없이 실제 사실만
const TRUST_ITEMS = [
  { icon: "⚡", title: "결제 후 바로", desc: "사주 리포트와 타로 전 상품, 결제 즉시 온라인으로 결과를 확인합니다" },
  { icon: "🃏", title: "질문 반영 리딩", desc: "남긴 질문과 상황을 카드 해석에 그대로 반영합니다" },
  { icon: "∞", title: "영구 재열람", desc: "모든 결과는 전용 링크로 언제든 다시 열어볼 수 있습니다" },
  { icon: "🧭", title: "패턴 중심", desc: "'된다/안 된다' 단정 대신 반복 패턴과 선택 기준을 드립니다" },
  { icon: "💳", title: "카드·무통장", desc: "토스페이먼츠 카드 결제와 무통장입금을 지원합니다" },
  { icon: "🏢", title: "사업자 운영", desc: "통신판매업 신고를 마친 사업자가 직접 운영하는 서비스입니다" },
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
  const loveRow = bySlug(["crush-kit", "reunion-check", "tarot-inner-mind", "tarot-celtic-cross"]);
  const tarotRow = bySlug(["tarot-daily", "tarot-inner-mind", "tarot-celtic-cross"]);
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
      {/* ══ 히어로 — 밤하늘 장면 + 사주 차트 + 타로 카드 ══ */}
      <section className="relative sf-night-sky overflow-hidden">
        {/* 배경 레이어 */}
        <StarField className="absolute inset-x-0 top-0 w-full h-[70%] opacity-90" />
        <SajuWheel className="absolute -right-24 top-8 w-[420px] md:w-[560px] opacity-50 md:opacity-70 animate-sf-spin-slow" />
        <TarotFan count={3} className="absolute -left-10 bottom-6 w-[220px] md:w-[300px] opacity-40 md:opacity-60" />
        {/* 지평선 골드 글로우 */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(232,161,28,0.22),transparent_70%)]" />

        <div className="container relative min-h-[500px] md:min-h-[640px] flex flex-col items-center justify-center text-center pt-14 pb-24 md:pt-24 md:pb-36">
          <p className="mb-5 text-[12px] md:text-[13px] font-bold tracking-[0.3em] text-sf-gold">
            운명PT — 사주 · 타로 자기이해 트레이닝
          </p>
          <h1 className="text-[38px] md:text-[64px] font-extrabold leading-[1.15] tracking-tight text-white">
            왜 나는 늘
            <br />
            <span className="sf-gold-text">같은 문제</span>에서 막힐까요?
          </h1>
          <p className="mt-7 text-[16px] md:text-[18px] leading-[1.8] text-[#c9d2e6] max-w-lg">
            당신이 부족해서가 아닙니다.
            <br />
            오래 버틴 사람에게는 <span className="text-white font-semibold">반복되는 패턴</span>이 남습니다.
            <br className="hidden md:block" />
            <span className="text-[14px] md:text-[15px] text-[#93a1c0]">운명PT는 예언 대신 패턴을 읽습니다.</span>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full max-w-[520px] px-4">
            <Link
              href="/start"
              className="block w-full sm:flex-1 rounded-2xl bg-sf-amber py-4 md:py-[18px] text-[16px] font-extrabold text-sf-navy hover:opacity-90 transition-opacity sf-glow"
            >
              1분 무료 — 내 반복 패턴 확인하기 →
            </Link>
            <Link
              href="/products"
              className="block w-full sm:w-auto rounded-2xl border border-white/25 bg-white/5 px-7 py-4 md:py-[18px] text-[15px] font-bold text-white hover:bg-white/10 transition-colors"
            >
              전체 상품 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 대표 상품 — 히어로 하단에 걸쳐 스크롤 유도 (모바일: 가로 스냅 슬라이더) ══ */}
      <section className="container relative z-10 -mt-14 md:-mt-24 pb-12 md:pb-24">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory sf-no-scrollbar -mx-5 px-5 pb-1 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-3 sm:gap-7 sm:overflow-visible">
          {featured.map((p) => (
            <div key={p.slug} className="min-w-[80%] snap-center sm:min-w-0">
              <ProductCard product={p} price={price(p.slug)} variant="featured" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-sf-mute sm:hidden">← 옆으로 넘겨보세요 →</p>
      </section>

      {/* ══ 신뢰 영역 — 짙은 네이비, 사실만 ══ */}
      <section className="bg-sf-navy">
        <div className="container py-12 md:py-24">
          <SectionHead
            dark
            eyebrow="WHY 운명PT"
            title="과장 없이, 이렇게 제공합니다"
            desc="허위 후기나 부풀린 숫자 없이 — 실제 제공 방식 그대로 안내드립니다."
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {TRUST_ITEMS.map((v) => (
              <div key={v.title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 md:p-7">
                <p className="text-[26px] md:text-[32px] leading-none">{v.icon}</p>
                <p className="mt-3.5 text-[16px] md:text-[19px] font-extrabold text-white">{v.title}</p>
                <p className="mt-2 text-[13px] md:text-[14px] text-[#aab6cf] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 고민별 탐색 — 대형 2×2 타일 ══ */}
      <section className="container py-12 md:py-28">
        <SectionHead
          eyebrow="CONCERN"
          title="지금, 어떤 고민인가요?"
          desc="고민에서 시작하면 필요한 리포트가 보입니다."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {[
            {
              href: "/products?tab=love",
              label: "연애 · 궁합",
              q: "다가가도 될까, 그 사람 마음은 어떨까?",
              bg: "bg-gradient-to-br from-[#3a1430] to-[#1a0a16]",
              art: <CrushOrbit className="absolute right-0 bottom-0 w-[75%] opacity-70" />,
              count: `${products.filter((p) => p.concerns.includes("love")).length}개 리포트`,
            },
            {
              href: "/products?tab=reunion",
              label: "재회",
              q: "끝난 관계, 다시 이어질 수 있을까?",
              bg: "bg-gradient-to-br from-[#33102a] to-[#140610]",
              art: <ReunionLines className="absolute right-0 bottom-2 w-[80%] opacity-80" />,
              count: `${products.filter((p) => p.concerns.includes("reunion")).length}개 리포트`,
            },
            {
              href: "/products?tab=money",
              label: "돈 · 직장",
              q: "왜 벌어도 안 남고, 일은 늘 막힐까?",
              bg: "bg-gradient-to-br from-[#14304a] to-[#081522]",
              art: <MeasureGrid className="absolute right-0 bottom-0 w-[78%] opacity-75" />,
              count: `${products.filter((p) => p.concerns.includes("money")).length}개 리포트`,
            },
            {
              href: "/products?tab=self",
              label: "자기이해 · 종합",
              q: "왜 나는 매번 같은 선택을 반복할까?",
              bg: "bg-gradient-to-br from-[#1a2a54] to-[#0a1226]",
              art: <SajuWheel className="absolute -right-10 -bottom-16 w-[65%] opacity-60" />,
              count: `${products.filter((p) => p.concerns.includes("self")).length}개 리포트`,
            },
          ].map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className={`group relative overflow-hidden rounded-3xl ${c.bg} border border-white/10 p-7 md:p-9 min-h-[190px] md:min-h-[230px] flex flex-col justify-between transition-all duration-300 hover:border-sf-amber/60 hover:-translate-y-1`}
            >
              {c.art}
              <div className="relative">
                <p className="text-[12px] font-bold tracking-widest text-sf-gold">{c.label}</p>
                <p className="mt-2.5 text-[20px] md:text-[24px] font-extrabold text-white leading-snug max-w-[320px]">
                  {c.q}
                </p>
              </div>
              <div className="relative mt-6 flex items-center justify-between">
                <span className="text-[12.5px] text-[#aab6cf]">{c.count}</span>
                <span className="rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-[13px] font-bold text-white group-hover:bg-sf-amber group-hover:text-sf-navy group-hover:border-sf-amber transition-colors">
                  둘러보기 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ 사주 섹션 — 종이 질감 + 코스맵 ══ */}
      <section className="sf-paper border-y border-sf-line">
        <div className="container py-12 md:py-28">
          <SectionHead
            eyebrow="SAJU"
            title="사주 — 반복 패턴의 측정"
            desc="가볍게 재고, 필요한 만큼 깊게. 측정 → 집중 → 전체의 3단 코스입니다."
            href="/saju"
            linkLabel="사주 전체 보기"
          />
          {/* 코스맵 */}
          <div className="mb-10 hidden md:flex items-center gap-0">
            {[
              { step: "STEP 1", name: "측정", desc: "무료 맛보기 · 운명 인바디" },
              { step: "STEP 2", name: "집중", desc: "짝사랑 · 재회 리포트" },
              { step: "STEP 3", name: "전체", desc: "전체 사주 리포트" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center flex-1 last:flex-none">
                <div className="rounded-2xl border border-sf-line bg-sf-panel px-6 py-4 shrink-0">
                  <p className="text-[11px] font-mono font-bold text-sf-amber-deep">{s.step}</p>
                  <p className="text-[18px] font-extrabold text-sf-ink">{s.name}</p>
                  <p className="text-[12.5px] text-sf-body">{s.desc}</p>
                </div>
                {i < 2 && <div className="flex-1 h-[2px] mx-3 bg-gradient-to-r from-sf-amber/70 to-sf-line" />}
              </div>
            ))}
          </div>
          <MobileRow>
            {sajuRow.map((p) => (
              <div key={p.slug} className="min-w-[74%] snap-center sm:min-w-0">
                <ProductCard product={p} price={price(p.slug)} variant="standard" />
              </div>
            ))}
          </MobileRow>
        </div>
      </section>

      {/* ══ 연애·재회 — 와인빛 다크 섹션 ══ */}
      <section className="sf-wine-sky">
        <div className="container py-12 md:py-28">
          <SectionHead
            dark
            eyebrow="LOVE & REUNION"
            title="마음이 급한 순간의 리포트"
            desc="“다가가도 될까?” 부터 “다시 이어질까?” 까지 — 감정이 아니라 좌표로 답합니다."
            href="/products?tab=love"
            linkLabel="연애·궁합 전체"
            darkLink
          />
          <MobileRow>
            {loveRow.map((p) => (
              <div key={p.slug} className="min-w-[74%] snap-center sm:min-w-0">
                <ProductCard product={p} price={price(p.slug)} variant="standard" />
              </div>
            ))}
          </MobileRow>
        </div>
      </section>

      {/* ══ 타로 섹션 — 밤하늘 + 골드 카드 3장 ══ */}
      <section className="relative sf-night-sky overflow-hidden">
        <StarField className="absolute inset-x-0 top-0 w-full h-full opacity-60" />
        <div className="container relative py-16 md:py-28">
          <SectionHead
            dark
            eyebrow="TAROT"
            title="지금 흐름을 비추는 카드"
            desc="1장은 오늘의 방향, 3장은 상황의 앞뒤, 10장 켈틱 크로스는 문제의 전체 지도까지."
            href="/tarot"
            linkLabel="타로 전체 보기"
            darkLink
          />
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory sf-no-scrollbar -mx-5 px-5 pb-1 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            {tarotRow.map((p) => {
              const n = p.slug === "tarot-daily" ? 1 : p.slug === "tarot-inner-mind" ? 3 : 10;
              return (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group relative min-w-[80%] snap-center md:min-w-0 overflow-hidden rounded-3xl border border-sf-gold/25 bg-white/[0.04] p-6 md:p-8 text-center transition-all duration-300 hover:border-sf-gold/70 hover:bg-white/[0.07] hover:-translate-y-1"
                >
                  <TarotFan count={n as 1 | 3 | 10} className="mx-auto h-[150px] w-full max-w-[260px] transition-transform duration-500 group-hover:scale-[1.06]" />
                  <p className="mt-5 text-[13px] font-bold tracking-widest text-sf-gold">{n}장 리딩</p>
                  <p className="mt-1.5 text-[21px] md:text-[23px] font-extrabold text-white">{p.displayName}</p>
                  <p className="mt-1.5 text-[13.5px] text-[#aab6cf]">{p.shortDescription}</p>
                  <p className="mt-4 flex items-baseline justify-center gap-2 text-[26px] font-mono font-bold text-sf-gold">
                    {p.originalPrice && p.originalPrice > price(p.slug) ? (
                      <span className="text-[14px] text-white/40 line-through">{formatKRW(p.originalPrice)}</span>
                    ) : null}
                    {formatKRW(price(p.slug))}
                  </p>
                  <p className="mt-1 text-[12.5px] text-[#93a1c0]">⚡ {p.delivery.timeText}</p>
                  <span className="mt-5 block rounded-xl bg-sf-amber py-3 text-[14px] font-extrabold text-sf-navy group-hover:opacity-95">
                    카드 뽑으러 가기 →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 저가 입문 — 가격 사다리 ══ */}
      <section className="container py-12 md:py-28">
        <SectionHead
          eyebrow="START LIGHT"
          title="처음이라면, 가볍게 시작하세요"
          desc="무료 → 1,000원 → 4,900원. 결과 스타일을 확인하고 깊게 들어가면 됩니다."
        />
        <div className="relative">
          {/* 사다리 연결선 (PC) */}
          <div className="hidden md:block absolute top-1/2 inset-x-[8%] h-[2px] bg-gradient-to-r from-sf-line via-sf-amber/60 to-sf-amber" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {entryRow.map((p, i) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group relative rounded-2xl border border-sf-line bg-sf-panel p-6 md:p-7 text-center transition-all hover:border-sf-amber hover:shadow-[0_10px_36px_rgba(20,35,63,0.12)]"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sf-navy text-sf-gold text-[11px] font-bold px-3 py-1">
                  {i === 0 ? "STEP 1 · 무료" : i === 1 ? "STEP 2 · 1,000원" : "STEP 3 · 4,900원"}
                </span>
                <p className="mt-3 text-[19px] md:text-[21px] font-extrabold text-sf-ink">{p.displayName}</p>
                <p className="mt-1.5 text-[13.5px] text-sf-body">{p.shortDescription}</p>
                <p className="mt-4 text-[24px] font-mono font-bold text-sf-ink">
                  {price(p.slug) === 0 ? "무료" : formatKRW(price(p.slug))}
                </p>
                <p className="mt-1 text-[12px] text-sf-mute">{p.delivery.timeText}</p>
                <span className="mt-4 inline-block text-[13.5px] font-bold text-sf-amber-deep group-hover:underline underline-offset-4">
                  시작하기 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 결과 예시 — 구매 결정 핵심 섹션 ══ */}
      <section className="bg-sf-navy">
        <div className="container py-12 md:py-28">
          <SectionHead
            dark
            eyebrow="SAMPLE"
            title="결과는 이런 모습으로 나옵니다"
            desc="결제 전에 결과의 형식을 그대로 보여드립니다. 아래는 익명 예시입니다."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {sajuSampleProduct && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
                <p className="text-[15px] md:text-[17px] font-extrabold text-white mb-4">📜 사주 리포트 예시</p>
                <SampleViewer sample={sajuSampleProduct.sample} />
                <Link
                  href="/products/premium-saju"
                  className="mt-5 block rounded-xl bg-sf-amber py-3.5 text-center text-[14.5px] font-extrabold text-sf-navy hover:opacity-90"
                >
                  전체 사주 리포트 {formatKRW(price("premium-saju"))} · 바로 확인 →
                </Link>
              </div>
            )}
            {tarotSampleProduct && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
                <p className="text-[15px] md:text-[17px] font-extrabold text-white mb-4">🃏 타로 리딩 예시</p>
                <SampleViewer sample={tarotSampleProduct.sample} />
                <Link
                  href="/products/tarot-inner-mind"
                  className="mt-5 block rounded-xl border border-sf-gold/60 py-3.5 text-center text-[14.5px] font-extrabold text-sf-gold hover:bg-sf-gold/10"
                >
                  3 카드 타로 {formatKRW(price("tarot-inner-mind"))} · 바로 확인 →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ 이용 과정 — 프로세스 타임라인 ══ */}
      <section className="container py-12 md:py-28">
        <SectionHead eyebrow="HOW IT WORKS" title="이용 방법" desc="상품 선택부터 결과 확인까지 4단계입니다." />
        <ol className="relative grid grid-cols-1 sm:grid-cols-4 gap-6 md:gap-4">
          {/* 연결선 */}
          <div className="hidden sm:block absolute top-7 inset-x-[12%] h-[2px] bg-gradient-to-r from-sf-amber via-sf-amber/60 to-sf-line" />
          {[
            { t: "상품 선택", d: "고민에 맞는 리포트나 타로를 고릅니다" },
            { t: "정보 입력", d: "생년월일 또는 질문을 입력합니다" },
            { t: "결제", d: "카드 결제 또는 무통장입금" },
            { t: "결과 확인", d: "결제 즉시 자동 발행 — 링크로 영구 소장" },
          ].map((s, i) => (
            <li key={s.t} className="relative text-center sm:px-2">
              <span className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sf-navy text-sf-gold text-[20px] font-extrabold border-4 border-sf-bg shadow-[0_4px_16px_rgba(20,35,63,0.25)]">
                {i + 1}
              </span>
              <p className="mt-4 text-[17px] md:text-[19px] font-extrabold text-sf-ink">{s.t}</p>
              <p className="mt-1.5 text-[13.5px] text-sf-body leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-sf-line bg-sf-panel px-5 py-4 text-[13.5px] text-sf-body">
            <b className="text-sf-ink">⚡ 즉시 발행</b> — 사주 리포트와 타로 전 상품, 결제 즉시 결과 페이지가 열립니다.
          </div>
          <div className="rounded-2xl border border-sf-line bg-sf-panel px-5 py-4 text-[13.5px] text-sf-body">
            <b className="text-sf-ink">∞ 영구 소장</b> — 결과는 전용 링크와 마이페이지에서 언제든 다시 열 수 있습니다.
          </div>
        </div>
      </section>

      {/* ══ 실제 후기 (0건이면 자동 숨김) ══ */}
      {reviews.length > 0 && (
        <section className="sf-paper border-y border-sf-line">
          <div className="container py-12 md:py-24">
            <SectionHead eyebrow="REVIEWS" title="실제 이용 후기" desc="구매 고객이 직접 남긴 후기만 노출합니다." />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-sf-line bg-sf-panel p-6">
                  <span className="text-[15px]">
                    <span className="text-sf-amber-deep">{"★".repeat(r.rating)}</span>
                    <span className="text-sf-line-strong">{"★".repeat(5 - r.rating)}</span>
                  </span>
                  <p className="mt-3 text-[14px] text-sf-body leading-[1.8] line-clamp-4">{r.content}</p>
                  <p className="mt-3 text-[11px] font-mono text-sf-mute">
                    {new Date(r.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ FAQ ══ */}
      <section className="container py-12 md:py-28 max-w-4xl">
        <SectionHead eyebrow="FAQ" title="자주 묻는 질문" />
        <Faq items={HOME_FAQ} />
      </section>

      {/* ══ 하단 CTA — 대형 비주얼 ══ */}
      <section className="relative sf-night-sky overflow-hidden border-t border-white/5">
        <SajuWheel className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] md:w-[760px] opacity-30 animate-sf-spin-slow" />
        <StarField className="absolute inset-x-0 top-0 w-full h-full opacity-50" />
        <div className="container relative py-16 md:py-32 text-center">
          <p className="text-[12px] font-bold tracking-[0.3em] text-sf-gold mb-4">START NOW</p>
          <p className="text-[30px] md:text-[44px] font-extrabold text-white leading-tight">
            1분이면, 내 반복 패턴이 보입니다
          </p>
          <p className="mt-4 text-[15px] md:text-[16px] text-[#b9c3d9]">
            무료로 시작하고, 필요한 만큼만 깊게 들어가세요.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/start"
              className="w-full sm:w-auto rounded-2xl bg-sf-amber px-10 py-4 text-[16px] font-extrabold text-sf-navy hover:opacity-90 transition-opacity sf-glow"
            >
              무료 진단 시작하기 →
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto rounded-2xl border border-white/25 bg-white/5 px-8 py-4 text-[15px] font-bold text-white hover:bg-white/10 transition-colors"
            >
              전체 상품 둘러보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// 모바일: 가로 스냅 슬라이더 / sm 이상: 그리드
function MobileRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory sf-no-scrollbar -mx-5 px-5 pb-1 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible">
      {children}
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  desc,
  href,
  linkLabel,
  dark = false,
  darkLink = false,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  href?: string;
  linkLabel?: string;
  dark?: boolean;
  darkLink?: boolean;
}) {
  return (
    <div className="mb-9 md:mb-12 flex items-end justify-between gap-6">
      <div>
        <p className={`text-[12px] font-bold tracking-[0.25em] mb-2.5 ${dark ? "text-sf-gold" : "text-sf-amber-deep"}`}>
          {eyebrow}
        </p>
        <h2 className={`text-[26px] md:text-[38px] font-extrabold tracking-tight leading-tight ${dark ? "text-white" : "text-sf-ink"}`}>
          {title}
        </h2>
        {desc ? (
          <p className={`mt-3 text-[14.5px] md:text-[16px] leading-relaxed max-w-xl ${dark ? "text-[#aab6cf]" : "text-sf-body"}`}>
            {desc}
          </p>
        ) : null}
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className={`hidden sm:inline-block shrink-0 rounded-full border px-5 py-2.5 text-[13.5px] font-bold transition-colors ${
            darkLink
              ? "border-white/25 text-white hover:bg-white/10"
              : "border-sf-line text-sf-ink hover:border-sf-amber hover:text-sf-amber-deep"
          }`}
        >
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
