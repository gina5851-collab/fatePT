// 결제 우회 검증 스크립트
// 실행: pnpm tsx --env-file=.env.local scripts/test-result.ts
// 동작: mock 주문/입력 생성 → 사주 명식 + OpenAI 해석 생성 → DB 저장 → 결과지 URL 출력

import { createClient } from "@supabase/supabase-js";
import { computeMyeongsik, type Myeongsik } from "../src/lib/saju/manseryeok";
import { buildSajuPrompt } from "../src/lib/saju/prompt";
import { generateInterpretation } from "../src/lib/saju/llm";
import {
  isSajuApiConfigured,
  fetchSajuAnalysis,
  formatSajuToManseryeok,
  ganjiToMyeongsik,
  type BirthInfo,
} from "../src/lib/saju/saju-api";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("✗ NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 누락");
    process.exit(1);
  }
  const sb = createClient(url, key);

  // 1. 인자로 받은 슬러그(기본: today-fortune) 상품 선택
  const slug = process.argv[2] || "today-fortune";
  const { data: product, error: pErr } = await sb
    .from("products")
    .select("id, slug, name, price")
    .eq("slug", slug)
    .single();
  if (pErr || !product) {
    console.error("✗ 상품 조회 실패:", pErr?.message);
    process.exit(1);
  }
  console.log(`✓ 상품: ${product.name} (${product.price}원)`);

  // 2. 가짜 주문 생성 (status=paid)
  const orderShortId = `MOCK_${Date.now()}`;
  const { data: order, error: oErr } = await sb
    .from("orders")
    .insert({
      order_id: orderShortId,
      user_id: null,
      guest_email: "test+mockflow@example.com",
      product_id: product.id,
      amount: product.price,
      status: "paid",
      toss_payment_key: "mock_test_key",
      paid_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (oErr || !order) {
    console.error("✗ 주문 생성 실패:", oErr?.message);
    process.exit(1);
  }
  console.log(`✓ 주문 생성: ${orderShortId}`);

  // 3. 사주 입력 데이터
  const birthDate = "1990-05-15";
  const birthTime = "14:30";
  const { error: iErr } = await sb.from("saju_inputs").insert({
    order_id: order.id,
    name: "테스트",
    birth_date: birthDate,
    birth_time: birthTime,
    time_unknown: false,
    gender: "female",
    calendar: "solar",
    concerns: [],
  });
  if (iErr) {
    console.error("✗ 사주 입력 저장 실패:", iErr.message);
    process.exit(1);
  }
  console.log(`✓ 사주 입력: ${birthDate} ${birthTime} 양력 여자`);

  // 4. 사주 명식 + LLM 해석 (실제 흐름 그대로)
  let myeongsik: Myeongsik;
  let manseryeokText: string | undefined;
  const birthInfo: BirthInfo = {
    birthYear: "1990",
    birthMonth: "5",
    birthDay: "15",
    birthHour: "14",
    birthMinute: "30",
    calendarType: "양력",
    gender: "female",
  };

  if (isSajuApiConfigured()) {
    try {
      console.log("→ luckyloveme API 호출 중...");
      const analysis = await fetchSajuAnalysis(birthInfo, []);
      const converted = ganjiToMyeongsik(analysis);
      if (converted) {
        myeongsik = converted;
        manseryeokText = formatSajuToManseryeok(analysis, birthInfo);
        console.log("✓ luckyloveme 분석 성공");
      } else {
        console.log("→ luckyloveme 응답 부족, mock으로 폴백");
        myeongsik = await computeMyeongsik({
          birthDate,
          birthTime,
          timeUnknown: false,
          calendar: "solar",
          gender: "female",
        });
      }
    } catch (e) {
      console.log(`→ luckyloveme 실패 (${(e as Error).message}), mock으로 폴백`);
      myeongsik = await computeMyeongsik({
        birthDate,
        birthTime,
        timeUnknown: false,
        calendar: "solar",
        gender: "female",
      });
    }
  } else {
    console.log("→ luckyloveme 미설정, mock 사용");
    myeongsik = await computeMyeongsik({
      birthDate,
      birthTime,
      timeUnknown: false,
      calendar: "solar",
      gender: "female",
    });
  }

  console.log("→ OpenAI 사주 해석 생성 중... (10-30초)");
  const { system, user } = buildSajuPrompt({
    productSlug: product.slug,
    productName: product.name,
    myeongsik,
    manseryeokText,
    birthDate,
    birthTime,
    timeUnknown: false,
    gender: "female",
    concerns: [],
  });
  const llm = await generateInterpretation({ system, user });
  console.log(`✓ ${llm.provider}/${llm.model}: ${llm.text.length}자 해석 생성됨`);

  // 5. 결과 저장
  const { data: result, error: rErr } = await sb
    .from("saju_results")
    .insert({
      order_id: order.id,
      myeongsik: myeongsik as never,
      interpretation_md: llm.text,
      llm_provider: llm.provider,
      llm_model: llm.model,
    })
    .select("id")
    .single();
  if (rErr || !result) {
    console.error("✗ 결과 저장 실패:", rErr?.message);
    process.exit(1);
  }

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✨ 완료!");
  console.log(`→ 결과지 URL: http://localhost:3000/results/${result.id}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((e) => {
  console.error("✗ 스크립트 실패:", e);
  process.exit(1);
});
