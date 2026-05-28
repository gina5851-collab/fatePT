"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// 사주아이式 퍼널: 후크 → 입력(매몰비용) → 무료 결과 → (결과지에서) 맥락 추천.
// 가격/그리드는 이 화면에 일절 노출하지 않는다.
const CONCERNS = [
  { label: "짝사랑", emoji: "💘" },
  { label: "연애·관계", emoji: "💞" },
  { label: "재회", emoji: "💔" },
  { label: "돈·일", emoji: "💼" },
  { label: "인생 전체", emoji: "🌟" },
];

export function StartFunnel({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [concern, setConcern] = useState<string>("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("female");
  const [calendar, setCalendar] = useState<"solar" | "lunar">("solar");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!concern) {
      toast.error("지금 가장 마음에 걸리는 걸 골라주세요");
      return;
    }
    if (!birthDate) {
      toast.error("생년월일을 입력해 주세요");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate,
          birthTime: timeUnknown ? null : birthTime || null,
          timeUnknown,
          gender,
          calendar,
          concerns: [concern],
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "무료 진단 생성 실패");
      router.push(`/results/${json.resultId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "오류가 발생했습니다");
      setSubmitting(false);
    }
  }

  return (
    <div className="container max-w-md py-12">
      {/* ── 후크 ── */}
      <header className="text-center mb-10">
        <p className="text-xs font-mono text-mute mb-3">FREE · 1분</p>
        <h1 className="text-[26px] md:text-[32px] font-semibold tracking-tight leading-snug text-ink">
          1분 무료 운명 인바디
        </h1>
        <p className="mt-3 text-sm text-body leading-relaxed">
          생년월일만 넣으면, 내 <span className="text-ink font-medium">운명 체성분</span>이 나와요.
          <br />
          헬스 인바디처럼 — 내 패턴부터 측정해봐요.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* ── 고민 선택 ── */}
        <div className="space-y-2">
          <Label>지금 가장 마음에 걸리는 건?</Label>
          <div className="flex flex-wrap gap-2">
            {CONCERNS.map((c) => (
              <button
                type="button"
                key={c.label}
                onClick={() => setConcern(c.label)}
                className={`px-4 h-10 rounded-full border text-sm transition-colors ${concern === c.label ? "border-ink bg-ink text-canvas" : "border-hairline text-ink hover:border-ink"}`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 생년월일 입력 (매몰비용) ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birthDate">생년월일</Label>
            <Input id="birthDate" type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthTime">출생 시각</Label>
            <Input
              id="birthTime"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              disabled={timeUnknown}
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} />
              시 모름
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>성별</Label>
            <div className="flex gap-2">
              {(["female", "male"] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 h-10 rounded-full border text-sm transition-colors ${gender === g ? "border-ink bg-ink text-canvas" : "border-hairline text-ink hover:border-ink"}`}
                >
                  {g === "male" ? "남성" : "여성"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>달력</Label>
            <div className="flex gap-2">
              {(["solar", "lunar"] as const).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCalendar(c)}
                  className={`flex-1 h-10 rounded-full border text-sm transition-colors ${calendar === c ? "border-ink bg-ink text-canvas" : "border-hairline text-ink hover:border-ink"}`}
                >
                  {c === "solar" ? "양력" : "음력"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 제출 ── */}
        {isLoggedIn ? (
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "측정 중..." : "무료로 내 운명 측정하기"}
          </Button>
        ) : (
          <div className="space-y-2">
            <Link
              href={`/login?redirect=${encodeURIComponent("/start")}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              로그인하고 무료로 측정하기
            </Link>
            <p className="text-xs text-body text-center">무료 · 하루 1회 · 로그인 후 바로 결과 확인</p>
          </div>
        )}
        <p className="text-center text-[11px] text-mute">완전 무료예요. 결제 단계 없이 바로 결과가 나와요.</p>
      </form>
    </div>
  );
}
