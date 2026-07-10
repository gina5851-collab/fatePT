import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1100px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 다크(네이비) 테마 팔레트 — 검정처럼 안 보이게 더 밝고 파랗게
        ink: "#eef2fb",          // 글자: 쿨 화이트
        canvas: "#11203c",       // 배경: 또렷한 네이비
        "surface-soft": "#1c2c4c", // 살짝 밝은 네이비 표면
        "surface-dark": "#0c1730",
        charcoal: "#cdd5e6",
        body: "#9aa6bf",         // 보조 글자 (쿨 그레이)
        mute: "#6f7c97",
        hairline: "#2c3c5b",     // 테두리: 네이비
        "hairline-strong": "#42547a",
        // ── 스토어프런트(라이트) 팔레트 — 새 쇼핑몰 프런트 전용 ──
        // 기존 다크 토큰(결과지/체크아웃/관리자)은 건드리지 않는다.
        "sf-bg": "#f8f6f0",          // 밝은 아이보리 배경
        "sf-panel": "#ffffff",       // 카드 표면
        "sf-panel-soft": "#f1eee5",  // 살짝 가라앉은 표면
        "sf-ink": "#14233f",         // 짙은 네이비 텍스트
        "sf-body": "#4c5a74",        // 본문 네이비 그레이
        "sf-mute": "#8a93a7",        // 보조 텍스트
        "sf-line": "#e6e1d3",        // 웜 헤어라인
        "sf-line-strong": "#d3ccba",
        "sf-amber": "#e8a11c",       // 앰버 골드 포인트
        "sf-amber-deep": "#b97f0a",
        "sf-navy": "#11203c",        // 네이비 섹션 배경(기존 canvas와 동일)
        "sf-navy-soft": "#1c2c4c",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      fontFamily: {
        sans: [
          "SF Pro Rounded",
          "-apple-system",
          "BlinkMacSystemFont",
          "ui-sans-serif",
          "system-ui",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
