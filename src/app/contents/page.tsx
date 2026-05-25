import Link from "next/link";

export const metadata = {
  title: "고민별 콘텐츠",
  description: "관계·돈·선택·자기이해 — 반복되는 패턴을 정리하는 콘텐츠 모음",
};

const CATEGORIES = [
  {
    slug: "relationship",
    emoji: "💞",
    title: "관계 패턴",
    description: "왜 나는 같은 연애를 반복할까?",
    articles: [
      "왜 나는 같은 연애를 반복할까?",
      "헤어진 사람을 오래 못 잊는 이유",
      "좋아할수록 불안해지는 관계의 구조",
      "나를 흔드는 사람에게 끌리는 이유",
      "관계에서 계속 같은 실수를 반복하는 이유",
    ],
    productSlug: "love-saju",
    productLabel: "관계 패턴 리포트 →",
  },
  {
    slug: "money-career",
    emoji: "💼",
    title: "돈과 일의 패턴",
    description: "돈을 버는데도 안 모이는 이유",
    articles: [
      "돈을 버는데도 안 모이는 이유",
      "이직할 때마다 후회하는 사람의 공통점",
      "부업을 시작해도 오래 못 가는 이유",
      "돈이 새는 사람들의 선택 습관",
      "올해 버틸까, 바꿔야 할까?",
    ],
    productSlug: "basic-saju",
    productLabel: "올해 흐름 리포트 →",
  },
  {
    slug: "self-understanding",
    emoji: "🪞",
    title: "자기이해",
    description: "내 인생이 제자리처럼 느껴질 때",
    articles: [
      "나는 왜 사람 눈치를 많이 볼까?",
      "중요한 선택 앞에서 늘 흔들리는 이유",
      "내 인생이 제자리처럼 느껴질 때 점검할 것",
      "감정 기복이 큰 사람이 놓치기 쉬운 것",
      "내가 나를 잘 모른다는 신호",
    ],
    productSlug: "basic-saju",
    productLabel: "자기이해 리포트 →",
  },
  {
    slug: "choice",
    emoji: "🔀",
    title: "선택 상담",
    description: "지금 버텨야 할까, 그만둬야 할까?",
    articles: [
      "지금 버텨야 할까, 그만둬야 할까?",
      "먼저 연락해도 될까?",
      "이 관계를 계속 이어가도 될까?",
      "새로운 일을 시작하기 전 점검할 것",
      "지금은 확장보다 정리가 필요한 시기일까?",
    ],
    productSlug: "today-fortune",
    productLabel: "오늘의 선택 리포트 →",
  },
  {
    slug: "tests",
    emoji: "✅",
    title: "패턴 체크리스트",
    description: "내 반복 패턴을 확인하는 체크리스트",
    articles: [
      "내 연애 방어기제 체크리스트",
      "돈이 새는 패턴 체크리스트",
      "이직 타이밍 체크리스트",
      "내가 반복하는 선택 패턴",
      "관계 소진 위험 신호 체크리스트",
    ],
    productSlug: "basic-saju",
    productLabel: "종합 자기이해 리포트 →",
  },
];

export default function ContentsPage() {
  return (
    <div className="container py-12">
      <header className="mb-10">
        <p className="text-xs font-mono text-mute mb-2">CONTENTS</p>
        <h1 className="text-3xl font-semibold tracking-tight">고민별 콘텐츠</h1>
        <p className="mt-2 text-sm text-body max-w-md">
          반복되는 관계·돈·선택의 패턴을 정리하는 콘텐츠 모음입니다.
          읽다가 내 이야기처럼 느껴진다면, 리포트에서 더 자세히 확인해보세요.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/contents/${cat.slug}`}
            className="group block rounded-lg border border-hairline bg-canvas p-6 transition-colors hover:border-ink"
          >
            <p className="text-2xl mb-3">{cat.emoji}</p>
            <p className="text-base font-semibold text-ink">{cat.title}</p>
            <p className="mt-1 text-sm text-body leading-relaxed">{cat.description}</p>
            <ul className="mt-4 space-y-1">
              {cat.articles.slice(0, 3).map((a) => (
                <li key={a} className="text-xs text-mute leading-relaxed">
                  — {a}
                </li>
              ))}
              {cat.articles.length > 3 && (
                <li className="text-xs text-mute">외 {cat.articles.length - 3}개</li>
              )}
            </ul>
          </Link>
        ))}
      </div>

      {/* 하단 CTA */}
      <div className="mt-16 rounded-lg border border-hairline p-8 text-center">
        <p className="text-sm font-semibold text-ink mb-2">
          읽다가 내 이야기처럼 느껴졌다면
        </p>
        <p className="text-sm text-body mb-5">
          생년월일 기반 AI 리포트에서 더 구체적인 분석을 확인해보세요.
        </p>
        <Link
          href="/products"
          className="inline-block rounded-full bg-ink text-canvas text-sm font-medium px-5 py-2.5 hover:opacity-80 transition-opacity"
        >
          리포트 보기 →
        </Link>
      </div>
    </div>
  );
}
