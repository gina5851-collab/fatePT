"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { MBTI_LIST } from "@/lib/saju/report/mbti";
import { AnalysisLoading } from "./AnalysisLoading";

// 천기문式 단계별 입력 퍼널: 성별 → 생년월일 → 시간 → 이름 → MBTI → 분석중 → 결과.
type Step = 0 | 1 | 2 | 3 | 4;
const TOTAL = 5;

export function StartFunnel(_props: { isLoggedIn?: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [analyzing, setAnalyzing] = useState(false);

  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [calendar, setCalendar] = useState<"solar" | "lunar">("solar");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [birthMin, setBirthMin] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [name, setName] = useState("");
  const [mbti, setMbti] = useState("");
  const [mbtiUnknown, setMbtiUnknown] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL - 1) as Step);
  const back = () => setStep((s) => Math.max(s - 1, 0) as Step);

  async function submit() {
    // 무료 진단은 게스트 허용 — 로그인 마찰 없이 결과부터 보여준다.
    const y = birthYear, m = birthMonth.padStart(2, "0"), d = birthDay.padStart(2, "0");
    const birthDate = `${y}-${m}-${d}`;
    const birthTime = timeUnknown || !birthHour ? null : `${birthHour.padStart(2, "0")}:${(birthMin || "0").padStart(2, "0")}`;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          birthDate, birthTime, timeUnknown,
          gender: gender || "female",
          calendar,
          concerns: [],
          mbti: mbtiUnknown ? undefined : mbti || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "무료 진단 생성 실패");
      // 분석중 화면 최소 노출 후 이동
      setTimeout(() => router.push(`/results/${json.resultId}`), 2600);
    } catch (err) {
      setAnalyzing(false);
      toast.error(err instanceof Error ? err.message : "오류가 발생했습니다");
    }
  }

  if (analyzing) return <AnalysisLoading />;

  return (
    <div className="mx-auto max-w-[420px] px-4 py-12">
      {/* progress dots */}
      <div className="flex items-center justify-center gap-1.5 mb-8">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-amber-400" : i < step ? "w-1.5 bg-amber-400/50" : "w-1.5 bg-hairline"}`} />
        ))}
      </div>

      {/* 뒤로 */}
      {step > 0 && (
        <button onClick={back} className="mb-4 text-[13px] text-mute hover:text-ink">← 이전</button>
      )}

      {/* Step 0: 성별 */}
      {step === 0 && (
        <Step title="성별을 선택해주세요">
          <div className="flex gap-3">
            {(["female", "male"] as const).map((g) => (
              <button key={g} onClick={() => { setGender(g); next(); }}
                className={`flex-1 h-14 rounded-xl border text-[15px] transition-colors ${gender === g ? "border-amber-400 bg-amber-400/10 text-ink" : "border-hairline text-ink hover:border-ink"}`}>
                {g === "female" ? "여성" : "남성"}
              </button>
            ))}
          </div>
        </Step>
      )}

      {/* Step 1: 생년월일 */}
      {step === 1 && (
        <Step title="생년월일을 알려주세요">
          <div className="flex gap-2 mb-3">
            {(["solar", "lunar"] as const).map((c) => (
              <button key={c} onClick={() => setCalendar(c)}
                className={`flex-1 h-10 rounded-full border text-[13px] ${calendar === c ? "border-amber-400 bg-amber-400/10 text-ink" : "border-hairline text-body"}`}>
                {c === "solar" ? "양력" : "음력"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input inputMode="numeric" placeholder="년(1990)" value={birthYear} onChange={(e) => setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4))} />
            <Input inputMode="numeric" placeholder="월" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            <Input inputMode="numeric" placeholder="일" value={birthDay} onChange={(e) => setBirthDay(e.target.value.replace(/\D/g, "").slice(0, 2))} />
          </div>
          <NextBtn disabled={birthYear.length !== 4 || !birthMonth || !birthDay} onClick={next} />
        </Step>
      )}

      {/* Step 2: 태어난 시간 */}
      {step === 2 && (
        <Step title="태어난 시간을 알려주세요">
          <div className="grid grid-cols-2 gap-2">
            <Input inputMode="numeric" placeholder="시 (0~23)" value={birthHour} disabled={timeUnknown} onChange={(e) => setBirthHour(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            <Input inputMode="numeric" placeholder="분" value={birthMin} disabled={timeUnknown} onChange={(e) => setBirthMin(e.target.value.replace(/\D/g, "").slice(0, 2))} />
          </div>
          <label className="mt-3 flex items-center gap-2 text-[13px] text-body">
            <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} />
            태어난 시간 모름
          </label>
          <NextBtn disabled={!timeUnknown && !birthHour} onClick={next} />
        </Step>
      )}

      {/* Step 3: 이름 */}
      {step === 3 && (
        <Step title="이름을 알려주세요">
          <Input placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <p className="mt-2 text-[12px] text-mute">결과지 개인화에 사용돼요. 안 적으셔도 됩니다.</p>
          <NextBtn onClick={next} label="다음" />
        </Step>
      )}

      {/* Step 4: MBTI */}
      {step === 4 && (
        <Step title="MBTI를 선택해주세요" sub="모르면 'MBTI 모름'을 선택하세요">
          <div className="grid grid-cols-4 gap-2">
            {MBTI_LIST.map((t) => (
              <button key={t} disabled={mbtiUnknown} onClick={() => setMbti(t)}
                className={`h-11 rounded-lg border text-[12px] font-medium transition-colors disabled:opacity-40 ${mbti === t && !mbtiUnknown ? "border-amber-400 bg-amber-400/10 text-ink" : "border-hairline text-body hover:border-ink"}`}>
                {t}
              </button>
            ))}
          </div>
          <label className="mt-3 flex items-center gap-2 text-[13px] text-body">
            <input type="checkbox" checked={mbtiUnknown} onChange={(e) => { setMbtiUnknown(e.target.checked); if (e.target.checked) setMbti(""); }} />
            MBTI 모름
          </label>
          <button onClick={submit} disabled={!mbti && !mbtiUnknown}
            className="mt-6 w-full rounded-xl bg-amber-400 py-4 text-[15px] font-bold text-[#0c1322] disabled:opacity-40 hover:opacity-90 transition-opacity">
            사주 풀이 받기 →
          </button>
        </Step>
      )}
    </div>
  );
}

function Step({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-[20px] font-bold text-ink text-center">{title}</h1>
      {sub && <p className="mt-1 text-center text-[12px] text-mute">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function NextBtn({ onClick, disabled, label = "다음" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="mt-6 w-full rounded-xl bg-amber-400 py-3.5 text-[15px] font-bold text-[#0c1322] disabled:opacity-40 hover:opacity-90 transition-opacity">
      {label}
    </button>
  );
}
