import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-static";

// ─────────────────────────────────────────────
// 카테고리별 콘텐츠 데이터
// 외부 플랫폼 노출용 — "사주/점/운세" 전면 배제, "패턴/흐름/선택/자기이해" 중심
// ─────────────────────────────────────────────
const CATEGORY_DATA: Record<
  string,
  {
    emoji: string;
    title: string;
    subtitle: string;
    intro: string;
    articles: { title: string; body: string }[];
    productSlug: string;
    productName: string;
    productCta: string;
  }
> = {
  relationship: {
    emoji: "💞",
    title: "관계 패턴",
    subtitle: "왜 나는 같은 연애를 반복할까?",
    intro:
      "연애 패턴, 갈등 방식, 이별 후 회복 속도 — 이것들은 단순한 성격이 아니라 구조적인 패턴입니다. 내 패턴을 이해하면 반복을 줄일 수 있습니다.",
    articles: [
      {
        title: "왜 나는 같은 연애를 반복할까?",
        body: "좋아하는 사람의 유형이 항상 비슷하고, 관계가 비슷한 방식으로 끝난다면 — 상대의 문제가 아니라 내 안의 패턴을 먼저 살펴볼 필요가 있습니다. 어떤 상황에서 처음 끌리는지, 갈등이 생겼을 때 나는 어떤 방식으로 반응하는지를 분석하면 반복의 구조가 보이기 시작합니다.",
      },
      {
        title: "헤어진 사람을 오래 못 잊는 이유",
        body: "이별 후 회복 속도는 사람마다 다릅니다. 유독 오래 붙잡고 있는 사람들에겐 공통적인 심리 구조가 있습니다. '그 사람이 특별했기 때문'이 아니라, 내가 관계에서 충족하려 했던 감정적 필요가 채워지지 않았기 때문인 경우가 많습니다.",
      },
      {
        title: "좋아할수록 불안해지는 관계의 구조",
        body: "상대가 좋을수록 연락이 없을 때 더 불안하고, 확인받고 싶어지는 패턴이 있다면 — 이것은 상대의 행동 때문이 아니라 내 안의 애착 방식과 연결되어 있습니다. 이 패턴을 이해하면 관계 안에서 더 안정적으로 있을 수 있습니다.",
      },
      {
        title: "나를 흔드는 사람에게 끌리는 이유",
        body: "예측 불가능하고, 때로는 상처를 주는 사람에게 더 강하게 끌리는 경험이 있다면 — 이것은 취향의 문제가 아닙니다. 간헐적 강화라는 심리 구조와, 어린 시절부터 형성된 관계 패턴이 맞물린 결과일 수 있습니다.",
      },
      {
        title: "관계에서 계속 같은 실수를 반복하는 이유",
        body: "말하지 않아서, 너무 맞춰줘서, 먼저 차단해서 — 관계가 끝날 때마다 후회하는 패턴이 비슷하다면, 그 반복에는 구조적인 이유가 있습니다. 실수를 탓하는 것보다 왜 그 선택이 반복되는지를 이해하는 것이 먼저입니다.",
      },
    ],
    productSlug: "crush-kit",
    productName: "짝사랑 키트",
    productCta: "내 연애 패턴을 리포트로 확인하기 →",
  },

  "money-career": {
    emoji: "💼",
    title: "돈과 일의 패턴",
    subtitle: "돈을 버는데도 안 모이는 이유",
    intro:
      "수입이 올라도 잔고가 비슷하거나, 이직을 반복해도 상황이 크게 달라지지 않는다면 — 환경의 문제가 아니라 나의 선택 패턴을 점검해볼 필요가 있습니다.",
    articles: [
      {
        title: "돈을 버는데도 안 모이는 이유",
        body: "수입이 늘어도 지출이 같이 늘고, 통장 잔고가 항상 비슷한 수준에 머무른다면 — 수입의 문제가 아닐 수 있습니다. 돈이 새는 패턴에는 구조적인 이유가 있고, 그 구조를 이해하지 않으면 수입이 올라도 상황이 반복됩니다.",
      },
      {
        title: "이직할 때마다 후회하는 사람의 공통점",
        body: "이직 후 3-6개월이 지나면 '여기도 마찬가지'라는 생각이 든다면 — 직장의 문제가 아니라 내가 일하는 방식이나 기대 구조를 먼저 살펴볼 필요가 있습니다. 환경이 바뀌어도 나의 패턴은 따라옵니다.",
      },
      {
        title: "부업을 시작해도 오래 못 가는 이유",
        body: "초반에는 의욕이 넘치다가 한 달을 넘기기 어렵다면 — 의지나 시간의 문제가 아닐 수 있습니다. 어떤 방식으로 에너지를 쓰고, 어떤 시기에 포기를 선택하는 경향이 있는지를 이해하면 다음 시도가 달라질 수 있습니다.",
      },
      {
        title: "돈이 새는 사람들의 선택 습관",
        body: "감정적으로 기분이 좋거나 나쁠 때 충동 지출이 늘어나거나, 스트레스를 소비로 해소하는 패턴이 있다면 — 이것은 의지력의 문제가 아니라 감정과 소비가 연결된 습관의 구조입니다. 이 구조를 인식하는 것만으로도 달라질 수 있습니다.",
      },
      {
        title: "올해 버틸까, 바꿔야 할까?",
        body: "지금 상황을 버티는 게 맞는지, 아니면 새로운 선택을 해야 하는 시기인지 — 이 질문 앞에서 흔들린다면, 지금 내가 어떤 흐름 안에 있는지를 먼저 파악하는 것이 도움이 됩니다. 버텨야 하는 시기와 움직여야 하는 시기는 다릅니다.",
      },
    ],
    productSlug: "premium-saju",
    productName: "전체 사주 리포트",
    productCta: "올해 돈과 일의 흐름을 리포트로 확인하기 →",
  },

  "self-understanding": {
    emoji: "🪞",
    title: "자기이해",
    subtitle: "내 인생이 제자리처럼 느껴질 때",
    intro:
      "무언가 노력하는데 제자리인 것 같고, 내가 무엇을 원하는지 모르겠다는 느낌이 든다면 — 방향의 문제가 아니라 자기이해의 깊이가 필요한 시기일 수 있습니다.",
    articles: [
      {
        title: "나는 왜 사람 눈치를 많이 볼까?",
        body: "타인의 감정을 빠르게 감지하고, 그에 맞춰 자신을 조절하는 것이 익숙한 사람들이 있습니다. 이것은 배려심이기도 하지만, 오래 지속되면 내가 원하는 것을 모르게 되거나 지속적인 에너지 소진으로 이어질 수 있습니다.",
      },
      {
        title: "중요한 선택 앞에서 늘 흔들리는 이유",
        body: "작은 결정은 빠른데 중요한 결정일수록 오래 고민하거나, 결정 후에도 계속 후회가 남는다면 — 결단력의 문제가 아니라 내 선택 기준이 아직 명확하지 않은 것일 수 있습니다. 나만의 선택 기준을 갖는 것이 흔들림을 줄이는 방법입니다.",
      },
      {
        title: "내 인생이 제자리처럼 느껴질 때 점검할 것",
        body: "열심히 사는데 앞으로 나아가는 느낌이 없다면 — 속도의 문제가 아니라 방향의 문제일 수 있습니다. 지금 내가 어디를 향해 가고 있는지, 무엇이 나를 막고 있는지를 먼저 정리하는 것이 필요합니다.",
      },
      {
        title: "감정 기복이 큰 사람이 놓치기 쉬운 것",
        body: "기분의 파도가 크고, 좋을 때와 안 좋을 때의 차이가 뚜렷하다면 — 이것은 성격의 단점이 아니라 에너지가 강하게 움직이는 방식입니다. 이 흐름을 이해하고 잘 활용하면 오히려 강점이 됩니다.",
      },
      {
        title: "내가 나를 잘 모른다는 신호",
        body: "다른 사람들은 나에 대해 뭔가를 잘 아는 것 같은데 정작 나는 모르겠다는 느낌, 혹은 오랫동안 내가 원하는 게 뭔지 생각하지 못했다는 느낌이 든다면 — 자기이해가 필요한 시기입니다.",
      },
    ],
    productSlug: "inbody",
    productName: "운명 인바디",
    productCta: "나의 패턴과 성향을 리포트로 확인하기 →",
  },

  choice: {
    emoji: "🔀",
    title: "선택 상담",
    subtitle: "지금 버텨야 할까, 그만둬야 할까?",
    intro:
      "중요한 선택 앞에서 혼자 고민하는 것이 지쳐간다면 — 결정을 내려주는 것이 아니라, 지금 내가 어떤 흐름 위에 있는지를 정리하는 것이 도움이 됩니다.",
    articles: [
      {
        title: "지금 버텨야 할까, 그만둬야 할까?",
        body: "일이든 관계든 — 계속 가야 할지 그만두어야 할지 결정이 서지 않을 때, 그 답은 대부분 외부에 있지 않습니다. 지금 내가 어떤 상태인지, 이 선택이 두려움에서 나오는 것인지 아닌지를 먼저 구분하는 것이 필요합니다.",
      },
      {
        title: "먼저 연락해도 될까?",
        body: "연락을 먼저 해야 하는지 기다려야 하는지 — 이 질문의 답은 상황보다 지금 내가 어떤 감정 상태에 있는지와 더 관련이 있습니다. 불안에서 나오는 연락과 확인에서 나오는 연락은 다른 결과를 만듭니다.",
      },
      {
        title: "이 관계를 계속 이어가도 될까?",
        body: "계속 가야 하는 이유와 그만해야 하는 이유가 비슷하게 느껴질 때 — 관계를 유지하거나 끝내는 결정보다, 지금 이 관계 안에서 내가 어떤 상태인지를 먼저 점검하는 것이 더 명확한 판단을 도와줍니다.",
      },
      {
        title: "새로운 일을 시작하기 전 점검할 것",
        body: "새 시작을 앞두고 설레면서도 불안하다면 — 준비가 충분한지가 아니라, 지금 내가 시작하기에 좋은 흐름 위에 있는지를 함께 확인하는 것이 도움이 됩니다.",
      },
      {
        title: "지금은 확장보다 정리가 필요한 시기일까?",
        body: "새로운 것을 추가하고 싶은데 기존 것들이 정리되지 않은 느낌이 있다면 — 모든 시기가 확장의 시기는 아닙니다. 지금이 정리의 시기인지 확장의 시기인지를 이해하면 에너지를 더 잘 쓸 수 있습니다.",
      },
    ],
    productSlug: "tarot-daily",
    productName: "오늘의 타로",
    productCta: "오늘의 선택, 카드 한 장으로 확인하기 →",
  },

  tests: {
    emoji: "✅",
    title: "패턴 체크리스트",
    subtitle: "내가 반복하는 패턴을 확인하는 체크리스트",
    intro:
      "체크리스트는 진단이 아닙니다. 내가 인식하지 못했던 패턴을 눈에 보이게 만드는 도구입니다. 공감되는 항목이 많을수록, 리포트에서 더 구체적인 분석이 도움이 됩니다.",
    articles: [
      {
        title: "내 연애 방어기제 체크리스트",
        body: "□ 좋아하는 사람에게 먼저 다가가는 것이 어렵다\n□ 상대가 바빠 보이면 연락을 참는다\n□ 갈등이 생기면 일단 거리를 둔다\n□ 관계가 잘 될수록 오히려 불안해진다\n□ 헤어진 후 '내가 잘못한 것'을 주로 생각한다\n\n3개 이상 해당된다면, 관계 패턴 리포트에서 더 자세히 살펴볼 수 있습니다.",
      },
      {
        title: "돈이 새는 패턴 체크리스트",
        body: "□ 스트레스를 받으면 소비가 늘어난다\n□ 기분이 좋을 때 충동구매를 자주 한다\n□ 월초와 월말의 잔고 차이가 크다\n□ 저축보다 지출이 먼저 일어난다\n□ 돈 얘기를 하는 것이 불편하다\n\n3개 이상 해당된다면, 돈의 흐름 리포트에서 패턴을 더 구체적으로 정리할 수 있습니다.",
      },
      {
        title: "이직 타이밍 체크리스트",
        body: "□ 지금 일이 성장이 아닌 반복처럼 느껴진다\n□ 같이 일하는 사람이 나를 소진시킨다\n□ 이 직장에서 이루고 싶은 것이 더 이상 없다\n□ 타 기회를 알아볼 에너지가 없다\n□ 계속 '좀 더 버티자'를 반복하고 있다\n\n3개 이상 해당된다면, 올해 흐름 리포트에서 지금이 정리의 시기인지 확장의 시기인지 확인할 수 있습니다.",
      },
      {
        title: "내가 반복하는 선택 패턴",
        body: "□ 중요한 결정일수록 오래 미루는 편이다\n□ 결정 후에도 '이게 맞나'라는 생각이 오래 간다\n□ 다른 사람이 결정해주면 편할 것 같다는 생각이 든다\n□ 선택지가 많을수록 더 어렵다\n□ 나중에 후회한 선택들의 패턴이 비슷하다\n\n3개 이상 해당된다면, 자기이해 리포트에서 나만의 선택 기준을 정리해볼 수 있습니다.",
      },
      {
        title: "관계 소진 위험 신호 체크리스트",
        body: "□ 사람을 만나고 나면 피곤함이 크다\n□ 맞춰주는 것이 익숙한데 가끔 억울하다\n□ 거절하는 것이 어렵다\n□ 내가 더 많이 연락하는 편이다\n□ 관계가 끝날까 봐 두려운 마음이 있다\n\n3개 이상 해당된다면, 관계 패턴 리포트에서 내가 관계에서 소진되는 구조를 살펴볼 수 있습니다.",
      },
    ],
    productSlug: "premium-saju",
    productName: "전체 사주 리포트",
    productCta: "내 패턴을 리포트로 더 자세히 확인하기 →",
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_DATA).map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const data = CATEGORY_DATA[category];
  if (!data) notFound();

  return (
    <div className="container py-12 max-w-2xl">
      <header className="mb-10">
        <Link href="/contents" className="text-xs text-mute hover:text-ink">
          ← 콘텐츠 홈
        </Link>
        <p className="text-xs font-mono text-mute mt-4 mb-2">
          CONTENTS / {category.toUpperCase()}
        </p>
        <p className="text-3xl mb-1">{data.emoji}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{data.title}</h1>
        <p className="mt-2 text-base text-body font-medium">{data.subtitle}</p>
        <p className="mt-3 text-sm text-body leading-relaxed">{data.intro}</p>
      </header>

      {/* 아티클 목록 */}
      <div className="space-y-8">
        {data.articles.map((article, i) => (
          <article key={i} className="border-t border-hairline pt-8">
            <h2 className="text-lg font-semibold text-ink mb-3">{article.title}</h2>
            <p className="text-sm text-body leading-relaxed whitespace-pre-line">{article.body}</p>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-lg border border-hairline p-8">
        <p className="text-sm font-semibold text-ink mb-2">
          위 내용이 내 이야기처럼 느껴졌다면
        </p>
        <p className="text-sm text-body mb-5 leading-relaxed">
          생년월일 기반 AI 리포트에서 더 구체적이고 개인화된 분석을 확인해보세요.
          패턴의 구조와 지금 내가 어떤 흐름 위에 있는지를 정리해드립니다.
        </p>
        <Link
          href={`/products/${data.productSlug}`}
          className="inline-block rounded-full bg-ink text-canvas text-sm font-medium px-5 py-2.5 hover:opacity-80 transition-opacity"
        >
          {data.productCta}
        </Link>
      </div>
    </div>
  );
}
