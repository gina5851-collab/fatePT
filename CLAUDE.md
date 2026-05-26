# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

운명PT (formerly "saju-boilerplate") — a Korean 사주(saju) fortune-telling site that ships an end-to-end payment + AI-interpretation flow. Stack: **Next.js 15 App Router (React 19) + Supabase + TossPayments v2 + pluggable LLM provider**. Most code comments, prompts, and user-facing strings are in **Korean** — keep that convention when editing.

The README, DEPLOY.md, DESIGN.md, PG_심사_가이드.md, and 운세위키_API_가이드.md at the repo root are first-class references; consult them before introducing behavior they already document.

## Commands

```bash
pnpm dev                 # next dev (localhost:3000)
pnpm build               # next build
pnpm start               # next start (after build)
pnpm lint                # next lint (ESLint, Next config)
pnpm typecheck           # tsc --noEmit — there is no test runner in this repo

pnpm seed:products       # upsert src/config/products.seed.ts into public.products
pnpm create:admin <email># flip profiles.is_admin=true for an existing account
```

Node 22+, pnpm 9.12.x (`packageManager` is pinned). The seed/admin scripts and `scripts/test-result.ts` are `tsx`-executed and read env via `--env-file=.env.local` (see `scripts/test-result.ts` header for the full payment-bypass smoke test).

Supabase migrations live in `supabase/migrations/000{1,2,3}_*.sql` and are applied via `npx supabase db push` or pasted into the Studio SQL editor — there is no in-repo migration runner.

## Demo mode (important)

The app is designed to boot with an unfilled `.env.local`. Two helpers gate this:

- `isSupabaseConfigured()` in `src/lib/env.ts` — returns false when `NEXT_PUBLIC_SUPABASE_URL` still contains the `YOUR_PROJECT` placeholder. Pages that read from Supabase must branch on this so the home/products pages render without DB credentials.
- `isSajuApiConfigured()` in `src/lib/saju/saju-api.ts` — same idea for the luckyloveme API; `/api/generate-manseryeok` returns **503** when unset, and the order-confirm route falls back to `computeMyeongsik()` mock.

When adding a new server-side feature, decide explicitly whether it must hard-fail or degrade to mock in demo mode.

## Architecture

### Payment + interpretation pipeline (the critical path)

1. **`/products/[slug]`** → user fills `SajuForm` (birth info + concerns) → `POST /api/orders/create` (`src/app/api/orders/create/route.ts`)
   - Requires an authenticated Supabase user (no anonymous orders despite the README's "guest payment" line — current code returns 401 without `user`).
   - Price is fetched server-side from `products` and never trusted from the client. Order id is `ord_${nanoid(20)}`.
   - Inserts `orders` (status `pending`) + `saju_inputs` in a non-atomic pair; failure path cleans up the order row.
2. **`/checkout/[orderId]`** mounts `src/components/checkout/TossWidget.tsx` (Toss Payment Widget v2 SDK). Success/fail redirects go to `/checkout/success` and `/checkout/fail`.
3. **`/checkout/success`** posts the returned `paymentKey/orderId/amount` to **`POST /api/orders/confirm`** (`src/app/api/orders/confirm/route.ts`). This route is the system's center of gravity — it does:
   - **Anti-tamper check**: DB amount must equal posted amount; idempotent for `status=paid`.
   - **Toss server confirm** via `confirmTossPayment()` (`src/lib/toss/confirm.ts`), then re-checks `totalAmount`.
   - **Manseryeok / 명식 generation**: prefer `fetchSajuAnalysis()` (luckyloveme 16-field full analysis) → `ganjiToMyeongsik()` + `formatSajuToManseryeok()`. On any failure (missing key, ganji missing, network), it falls back to deterministic mock `computeMyeongsik()` so the user always gets a result page after a successful charge.
   - **LLM call** via `generateInterpretation({system, user})` (`src/lib/saju/llm.ts`) using prompts from `buildSajuPrompt()` (`src/lib/saju/prompt.ts`). Per-product `STYLE_BY_SLUG` tables drive length + section structure.
   - Persists `saju_results`; returns `{ resultId }` to the client which navigates to `/results/[resultId]`.
   - If LLM/result-save fails **after** Toss has approved, the route returns 500 with a `hint` telling the operator to manually regenerate or refund from `/admin/orders` — never auto-refund here.

Touching any of: order amount handling, Toss confirm response shape, or the `saju_results` insert → re-read `route.ts` end-to-end. The fallbacks are intentional and have been tuned to make sure a paid order always produces something to show.

### LLM provider switch

`src/lib/saju/llm.ts` dispatches on `serverEnv().LLM_PROVIDER` (`openai | anthropic | gemini`). Each branch **lazy-imports** its SDK so unused providers cost zero at startup. When adding a provider, mirror this pattern and add the key to `serverSchema` in `src/lib/env.ts`. Prompt structure (`system` + `user`) is provider-agnostic and lives in `src/lib/saju/prompt.ts`.

### Supabase clients & RLS

Two clients in `src/lib/supabase/server.ts`:

- **`createClient()`** — SSR cookie-aware client, hits Postgres **with RLS enforced**. Use in Server Components, server actions, and route handlers where the user's own data is being read/written.
- **`createServiceClient()`** — service-role client, **bypasses RLS**. Use *only* in server route handlers for: payment confirm, LLM generation, admin queries, guest lookups. Never import in client code or pages that render client-side.

RLS policies (`supabase/migrations/0002_rls.sql`):

- `profiles` / `orders` / `saju_inputs` / `saju_results`: self-select via `auth.uid()`. Guest order lookups must go through service-role + `order_id` match in a route handler.
- `products`: public read where `is_active=true`.
- `reviews`: public read where `is_public=true`; self-insert/update/delete by `auth.uid()`.

If you add a new table, add an RLS migration in the same commit — clients run with anon by default and silently return empty rows when policies are missing.

### Auth & middleware

`middleware.ts` calls `updateSession()` from `src/lib/supabase/middleware.ts`. It:

1. Refreshes the Supabase session cookie on every request matched by the `matcher`.
2. Redirects unauthenticated `/mypage/*` requests to `/login?redirect=…`.
3. For `/admin/*` it additionally checks `profiles.is_admin` and bounces non-admins to `/`.

**Admin has a second gate**: `src/lib/admin-auth.ts` implements a separate `ADMIN_PASSWORD`-based cookie (`admin_session`) used by `/admin/login` to keep the admin dashboard usable without per-user role management. Server pages under `/admin` should call `requireAdminPassword(path)` at the top. So an admin route is protected by **both** middleware (profile.is_admin) **and** the password cookie — keep both in mind when debugging redirects.

### Env validation

`src/lib/env.ts` exposes `publicEnv` (eagerly parsed at module load — fine to import anywhere) and `serverEnv()` (lazy, memoized, throws if called from the browser). Always go through these — do not read `process.env.*` directly outside this file. When adding a new variable: extend the right Zod schema, the `serverEnv()` `parse({})` literal, `.env.example`, and the README env table.

### Routing layout

App Router under `src/app`:

- `(auth)/{login,signup,reset}` — Supabase email/password.
- `products/` (list) + `products/[slug]` (detail + form).
- `checkout/[orderId]` (widget) + `checkout/{success,fail}`.
- `results/[resultId]` — renders `saju_results.interpretation_md` via `react-markdown` + `remark-gfm` (component: `src/components/saju/ResultBody.tsx`).
- `mypage/{,orders,reviews}` — auth-guarded by middleware.
- `admin/{,orders,login,logout}` — double-guarded as described above.
- `legal/{terms,privacy,refund-policy}` and `contents/[category]` — static + SEO surfaces; copy is in `src/config/{site,content-strategy,product-copy}.ts`.
- `api/` — `orders/{create,confirm}`, `generate-manseryeok`, `reviews`, `auth/signout`.

### Design system

`DESIGN.md` is the canonical spec — the site mirrors the Ollama aesthetic (paper-white canvas, pill geometry `rounded-full`, single black `{colors.primary}` CTA, one dark inverted card per page). `tailwind.config.ts` aliases the Ollama palette (`ink`, `canvas`, `surface-soft`, `surface-dark`, `charcoal`, `body`, `mute`, `hairline`). When adding components, prefer existing shadcn primitives in `src/components/ui/` and respect the design tokens before introducing new ones.

## Conventions

- **TypeScript path alias** `@/*` → `src/*` (see `tsconfig.json`); strict mode is on.
- **DB types** are hand-maintained in `src/types/database.ts`. If you change a migration, update this file in the same commit (no `supabase gen types` codegen is wired up).
- **Pricing flow is server-authoritative**: never read price from the client request body — always re-fetch from `products` by id.
- **Korean copy stays Korean**. Tone rules for LLM interpretations are encoded in `SYSTEM_BASE` (`src/lib/saju/prompt.ts`): no deterministic fate language, end on actionable advice, polite 존댓말, markdown with visual heft. When extending product styles, add a new entry to `STYLE_BY_SLUG` rather than mutating the existing ones.
- **Toss test keys** in `.env.example` (`test_gck_docs_…` / `test_gsk_docs_…`) are the public docs keys and are safe to commit; never replace them with live keys in `.env.example`.
- **No tests** — verification is manual via the checklist in `README.md` (§검증 체크리스트) or by running `pnpm tsx --env-file=.env.local scripts/test-result.ts [slug]` to bypass payment and exercise the saju → LLM → DB path end-to-end.
