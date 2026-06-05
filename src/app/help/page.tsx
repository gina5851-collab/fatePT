import Link from "next/link";
import { businessInfo } from "@/config/site";

export const metadata = { title: "고객센터" };

// BrandG 고객센터 — 문의 채널 + 처리 기준 안내. 정적 페이지.
export default function HelpPage() {
  return (
    <div className="brandg-shop">
      <div className="container py-12 max-w-2xl">
        <header className="mb-10 text-center">
          <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">CUSTOMER CARE</p>
          <h1 className="text-2xl font-bold text-ink">고객센터</h1>
          <p className="mt-2 text-[13px] text-body">
            BrandG 는 작은 팀이지만, 한 분 한 분의 문의에 정성껏 답해드립니다.
          </p>
        </header>

        {/* 메인 문의 채널 */}
        <section className="rounded-2xl border border-hairline bg-surface-soft p-6 mb-6">
          <p className="text-[11px] font-mono tracking-[0.2em] text-mute">EMAIL</p>
          <p className="mt-1 text-[20px] font-bold text-ink">{businessInfo.email}</p>
          <p className="mt-2 text-[12px] text-body leading-relaxed">
            상품·주문·환불·계정 등 모든 문의는 이메일로 받습니다.
            <br />
            평일 1영업일 이내 답변 드립니다 (주말·공휴일 제외).
          </p>
          <a
            href={`mailto:${businessInfo.email}?subject=[BrandG] 문의`}
            className="mt-4 inline-flex rounded-xl bg-amber-500 text-white px-5 py-3 text-[13px] font-bold hover:bg-amber-600 transition-colors shadow-sm"
          >
            메일로 문의하기 →
          </a>
        </section>

        {/* 운영 시간 */}
        <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Block title="운영 시간" lines={["평일 10:00 ~ 18:00", "점심 12:30 ~ 13:30", "주말·공휴일 휴무"]} />
          <Block
            title="평균 응답 시간"
            lines={["이메일 1영업일 이내", "긴급 (오배송·결제 오류) 당일", "환불 영업일 3~5일 이내"]}
          />
        </section>

        {/* 빠른 안내 */}
        <section className="mb-10">
          <p className="text-[12px] font-semibold text-ink mb-3">자주 묻는 것은 — 한 번에</p>
          <ul className="rounded-2xl border border-hairline bg-canvas divide-y divide-hairline overflow-hidden">
            <RowLink href="/faq" label="자주 묻는 질문 (FAQ) 모음 보기" />
            <RowLink href="/legal/refund-policy" label="환불 정책" />
            <RowLink href="/legal/terms" label="이용약관" />
            <RowLink href="/legal/privacy" label="개인정보처리방침" />
          </ul>
        </section>

        {/* 사업자 정보 요약 */}
        <section className="rounded-2xl border border-hairline bg-surface-soft p-5 text-[11px] text-body leading-relaxed">
          <p className="font-semibold text-ink mb-2">사업자 정보</p>
          <p>{businessInfo.companyName} · 대표 {businessInfo.representative}</p>
          <p>사업자등록번호 {businessInfo.businessNumber}</p>
          {businessInfo.mailOrderNumber ? <p>통신판매업 신고번호 {businessInfo.mailOrderNumber}</p> : null}
          <p>주소 {businessInfo.address}</p>
        </section>

        <p className="mt-8 text-center text-[12px] text-mute">
          <Link href="/" className="text-ink underline underline-offset-4 hover:opacity-80">
            ← 홈으로
          </Link>
        </p>
      </div>
    </div>
  );
}

function Block({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-hairline bg-canvas p-5">
      <p className="text-[11px] font-mono tracking-[0.2em] text-mute">{title.toUpperCase()}</p>
      <p className="mt-1 text-[13px] font-semibold text-ink">{title}</p>
      <ul className="mt-2.5 space-y-1 text-[12px] text-body">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

function RowLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center justify-between px-5 py-4 text-[13px] font-medium text-ink hover:bg-surface-soft transition-colors"
      >
        <span>{label}</span>
        <span className="text-mute">→</span>
      </Link>
    </li>
  );
}
