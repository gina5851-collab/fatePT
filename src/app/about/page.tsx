import Link from "next/link";
import { G_CATEGORIES } from "@/config/categories";

export const metadata = { title: "BrandG 소개" };

export default function AboutPage() {
  return (
    <div className="brandg-shop">
      <div className="container py-12 max-w-2xl">
        {/* Hero */}
        <header className="mb-12 text-center">
          <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">ABOUT</p>
          <h1 className="text-[28px] md:text-[32px] font-extrabold leading-tight text-ink">
            뭐가 필요하<span className="text-amber-300">G</span>?
          </h1>
          <p className="mt-4 text-[14px] text-body leading-relaxed max-w-md mx-auto">
            BrandG 는 40+ 여성을 위한 자기관리 편집샵입니다.
            <br />
            지금의 나에게 필요한 G 를, 가장 가까운 곳에서 만날 수 있도록.
          </p>
        </header>

        {/* 만든 사람 / 정체성 */}
        <section className="mb-12">
          <p className="text-[12px] font-semibold text-ink mb-3">왜 BrandG 인가요?</p>
          <div className="rounded-2xl border border-hairline bg-surface-soft p-6">
            <p className="text-[14px] text-body leading-relaxed">
              40 대 후반으로 들어서면서, 저는 같은 사실을 자주 마주했어요.
              <br /><br />
              필요한 건 거창한 것도, 새로운 것도 아니었습니다.
              <strong className="text-ink"> 매일 챙기는 작은 의식</strong> 들이었죠.
              <br /><br />
              그런데 막상 ‘오늘의 나’ 에게 맞는 걸 고르려면 — 후기를 한참 뒤져야 했고,
              결국 안 사거나, 잘못 산 채로 서랍에 묻혀버리곤 했어요.
              <br /><br />
              그래서 BrandG 를 만들었습니다. 5 가지 G 카테고리로 나누고,
              저(지나) 가 직접 써본 것만 추천하는 자기관리 편집샵.
            </p>
          </div>
          <p className="mt-3 text-right text-[12px] text-mute">— 지나, BrandG 설립자</p>
        </section>

        {/* 5G 정체성 */}
        <section className="mb-12">
          <p className="text-[12px] font-semibold text-ink mb-3">5 가지 G 로 만나는 자기관리</p>
          <div className="grid grid-cols-1 gap-2">
            {G_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="flex items-center gap-4 rounded-xl border border-hairline bg-canvas p-4 hover:border-ink transition-colors"
              >
                <span className="text-2xl shrink-0" aria-hidden>{c.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-[14px] font-semibold text-ink">{c.korean}</p>
                    <p className="text-[10px] font-mono text-mute">{c.english}</p>
                  </div>
                  <p className="text-[12px] text-body mt-0.5">{c.tagline}</p>
                </div>
                <span className="text-mute shrink-0" aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 우리의 약속 */}
        <section className="mb-12">
          <p className="text-[12px] font-semibold text-ink mb-3">BrandG 의 세 가지 약속</p>
          <div className="space-y-3">
            <Promise
              num="01"
              title="직접 써본 것만"
              body="대표 지나가 일정 기간 직접 사용해 본 상품만 라인업에 올립니다."
            />
            <Promise
              num="02"
              title="40+ 컨디션 기준"
              body="20대 기준이 아닌, 40대 이후 자기관리 관점에서 농도·자극·향을 봅니다."
            />
            <Promise
              num="03"
              title="마진보다 마음"
              body="마진이 높은 상품이 아니라, 우리가 진심으로 권할 수 있는 상품을 우선합니다."
            />
          </div>
        </section>

        {/* 다음 액션 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
          <Link
            href="/start"
            className="rounded-xl bg-amber-400 text-[#0c1322] py-3.5 text-center text-[13px] font-bold hover:opacity-90"
          >
            내 G 찾기 진단 →
          </Link>
          <Link
            href="/products"
            className="rounded-xl border border-hairline bg-canvas py-3.5 text-center text-[13px] font-semibold text-ink hover:border-ink"
          >
            상품 둘러보기 →
          </Link>
        </section>

        <p className="text-center text-[12px] text-mute">
          궁금한 점 — {" "}
          <Link href="/help" className="text-ink underline underline-offset-4 hover:opacity-80">
            고객센터로 문의
          </Link>
        </p>
      </div>
    </div>
  );
}

function Promise({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-xl border border-hairline bg-surface-soft p-4">
      <p className="text-[14px] font-mono text-mute shrink-0 mt-0.5">{num}</p>
      <div>
        <p className="text-[14px] font-bold text-ink">{title}</p>
        <p className="mt-1 text-[12px] text-body leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
