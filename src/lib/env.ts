import { z } from "zod";

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  TOSS_SECRET_KEY: z.string().min(1),
  MANSERYEOK_API_URL: z.string().url().optional().or(z.literal("")),
  MANSERYEOK_API_KEY: z.string().optional(),
  SAJU_API_URL: z.string().url().optional().or(z.literal("")),
  SAJU_API_KEY: z.string().optional(),
  LLM_PROVIDER: z.enum(["openai", "anthropic", "gemini"]).default("anthropic"),
  LLM_MODEL: z.string().min(1),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional().default(""),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_TOSS_CLIENT_KEY: z.string().min(1),
});

// NEXT_PUBLIC_* 가 없는 환경(예: 환경변수 미설정 프리뷰 배포)에서도 빌드가
// 깨지지 않도록 safeParse 후 .env.example 과 동일한 placeholder 로 폴백한다.
// 폴백 시 NEXT_PUBLIC_SUPABASE_URL 이 'YOUR_PROJECT' 라 isSupabaseConfigured()
// 가 false → 데모 모드로 동작. 운영에는 실제 값이 있으므로 동작은 동일하다.
const _publicParsed = publicSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_TOSS_CLIENT_KEY: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
});

export const publicEnv: z.infer<typeof publicSchema> = _publicParsed.success
  ? _publicParsed.data
  : {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-anon-key",
      NEXT_PUBLIC_TOSS_CLIENT_KEY: "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm",
    };

// .env.example 그대로(placeholder)면 false — DB 호출을 우회해 데모 모드로 동작
export function isSupabaseConfigured(): boolean {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  return !url.includes("YOUR_PROJECT") && !url.includes("your-project");
}

let _serverEnv: z.infer<typeof serverSchema> | null = null;

export function serverEnv() {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv() must only be called on the server");
  }
  if (!_serverEnv) {
    _serverEnv = serverSchema.parse({
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      TOSS_SECRET_KEY: process.env.TOSS_SECRET_KEY,
      MANSERYEOK_API_URL: process.env.MANSERYEOK_API_URL,
      MANSERYEOK_API_KEY: process.env.MANSERYEOK_API_KEY,
      SAJU_API_URL: process.env.SAJU_API_URL,
      SAJU_API_KEY: process.env.SAJU_API_KEY,
      LLM_PROVIDER: process.env.LLM_PROVIDER,
      LLM_MODEL: process.env.LLM_MODEL,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    });
  }
  return _serverEnv;
}
