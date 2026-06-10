import Link from "next/link";
import { businessInfo } from "@/config/site";

export const metadata = { title: "자주 묻는 질문" };

type QA = { q: string; a: string };
type Category = { id: string; title: string; items: QA[] };

const CATEGORIES: Category[] = [
  {
    id: "account",
    title: "회원 / 계정",
    items: [
      {
        q: "회원가입 없이도 주문할 수 있나요?",
        a: "네, BrandG 는 게스트 주문이 가능합니다. 다만 회원으로 가입하시면 주문 내역 / 후기 작성 / 결과지 보관함이 계정에 저장됩니다.",
      },
      {
        q: "회원가입 시 어떤 정보가 필요하나요?",
        a: "이름·이메일·비밀번호만 받습니다. 별도 인증 단계 없이 즉시 가입됩니다.",
      },
      {
        q: "비밀번호를 잊었어요.",
        a: "로그인 화면 하단의 ‘비밀번호 재설정’ 을 누르고 가입 이메일을 입력하시면 재설정 링크가 발송됩니다.",
      },
      {
        q: "회원 탈퇴는 어떻게 하나요?",
        a: `고객센터 이메일(${businessInfo.email})로 ‘회원 탈퇴 요청’ 으로 보내주시면 영업일 1~2일 이내에 처리해드립니다.`,
      },
    ],
  },
  {
    id: "order",
    title: "주문 / 결제",
    items: [
      {
        q: "결제 수단은 무엇이 있나요?",
        a: "신용카드 / 무통장입금 / 간편결제 (준비 중) 를 지원합니다. 무통장입금은 입금 확인 후 24시간 이내 상품 준비를 시작합니다.",
      },
      {
        q: "주문 취소는 가능한가요?",
        a: "상품 준비 단계 이전 (결제 직후 ~ 출고 전) 까지 가능합니다. 마이페이지 > 주문 내역 또는 고객센터 이메일로 요청해 주세요.",
      },
      {
        q: "주문 내역은 어디서 보나요?",
        a: "마이페이지 > 주문 / 결제 내역 에서 결제 상태·결과지·후기 작성 여부를 확인할 수 있습니다. 게스트로 결제하셨더라도 가입 이메일이 동일하면 연결됩니다.",
      },
    ],
  },
  {
    id: "shipping",
    title: "배송",
    items: [
      {
        q: "배송 기간은 얼마나 걸리나요?",
        a: "평일 오후 2시 이전 결제 건은 당일 출고, 평균 1~3일 이내 도착합니다. 도서산간 지역은 1~2일 추가 소요됩니다.",
      },
      {
        q: "배송비는 얼마인가요?",
        a: "3만원 이상 무료 배송, 그 미만은 배송비 3,000원이 부과됩니다.",
      },
      {
        q: "받는 사람 / 주소 변경은 가능한가요?",
        a: "출고 전이면 고객센터 이메일로 즉시 알려주세요. 출고 후에는 택배사 직접 문의가 필요합니다.",
      },
    ],
  },
  {
    id: "refund",
    title: "교환 / 환불",
    items: [
      {
        q: "단순 변심으로 반품할 수 있나요?",
        a: "수령 후 7일 이내 신청 가능합니다. 화장품·이너케어 류는 위생상 개봉 후 반품이 어려운 점 양해 부탁드립니다. 자세한 기준은 환불 정책 페이지를 확인해 주세요.",
      },
      {
        q: "상품에 하자 / 오배송이 있어요.",
        a: "수령 후 7일 이내 고객센터로 사진과 함께 문의해 주세요. BrandG 가 왕복 배송비를 부담하며, 영업일 3~5일 이내 환불 또는 재배송해드립니다.",
      },
      {
        q: "환불은 언제 받을 수 있나요?",
        a: "반품 상품 수령 후 검수 완료 시점부터 영업일 3~5일 이내 결제 수단으로 환불됩니다. 카드 결제는 카드사 정책에 따라 1~2일 추가될 수 있습니다.",
      },
    ],
  },
  {
    id: "product",
    title: "상품 / 사용",
    items: [
      {
        q: "보관은 어떻게 하나요?",
        a: "직사광선과 고온을 피해 서늘한 곳에 보관해주세요. 개봉 후에는 가능한 빠른 시일 내 사용을 권장합니다.",
      },
      {
        q: "알레르기 반응이 있어요.",
        a: "사용을 즉시 중단하시고 전문의와 상담하세요. 미사용 분량은 환불 정책에 따라 처리해드립니다.",
      },
      {
        q: "영양제는 누구나 먹어도 되나요?",
        a: "1일 권장량을 지켜주시고, 특이 체질·임산부·수유부·만성질환자는 의사와 상의 후 드세요.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="brandg-shop">
      <div className="container py-12 max-w-3xl">
        <header className="mb-10 text-center">
          <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">FAQ</p>
          <h1 className="text-2xl font-bold text-ink">자주 묻는 질문</h1>
          <p className="mt-2 text-[13px] text-body">
            여기서 답이 안 나오면 — {" "}
            <Link href="/help" className="text-ink underline underline-offset-4 hover:opacity-80">
              고객센터로 문의
            </Link>
            해 주세요.
          </p>
        </header>

        {/* 카테고리 점프 메뉴 */}
        <nav className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-full border border-hairline bg-surface-soft px-3.5 py-1.5 text-[12px] text-body hover:border-ink hover:text-ink transition-colors"
            >
              {c.title}
            </a>
          ))}
        </nav>

        {/* 카테고리별 Q&A */}
        <div className="space-y-10">
          {CATEGORIES.map((c) => (
            <section key={c.id} id={c.id}>
              <h2 className="text-[14px] font-semibold text-ink mb-3">{c.title}</h2>
              <div className="rounded-2xl border border-hairline bg-canvas divide-y divide-hairline overflow-hidden">
                {c.items.map((it, i) => (
                  <details key={i} className="group">
                    <summary className="flex items-start justify-between gap-4 px-4 py-3.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <span className="text-[13px] font-medium text-ink leading-snug">Q. {it.q}</span>
                      <span className="text-mute text-[14px] transition-transform group-open:rotate-180 shrink-0 mt-0.5" aria-hidden>
                        ▾
                      </span>
                    </summary>
                    <div className="px-4 pb-4 -mt-1">
                      <p className="text-[12px] text-body leading-relaxed">A. {it.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 text-center text-[12px] text-mute">
          답을 못 찾으셨다면 — {" "}
          <Link href="/help" className="text-ink underline underline-offset-4 hover:opacity-80">
            고객센터 ({businessInfo.email})
          </Link>{" "}
          로 문의해주세요.
        </p>
      </div>
    </div>
  );
}
