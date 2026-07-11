import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async redirects() {
    return [
      // ── 구 slug 보존 (외부 유입·과거 공유 링크 404 방지) ──
      { source: "/products/basic-saju", destination: "/products/inbody", permanent: true },
      { source: "/products/love-saju", destination: "/products/crush-kit", permanent: true },
      { source: "/products/today-fortune", destination: "/products/tarot-one-card", permanent: true },
      // ── 타로 기준 v1 slug 통일 — 구 slug 는 여기서만 허용 ──
      { source: "/products/tarot-daily", destination: "/products/tarot-one-card", permanent: true },
      { source: "/products/tarot-inner-mind", destination: "/products/tarot-three-card", permanent: true },
      { source: "/products/tarot-relationship", destination: "/products/tarot-celtic-cross", permanent: true },
      { source: "/tarot/tarot-daily", destination: "/products/tarot-one-card", permanent: true },
      { source: "/tarot/tarot-inner-mind", destination: "/products/tarot-three-card", permanent: true },
      { source: "/tarot/tarot-relationship", destination: "/products/tarot-celtic-cross", permanent: true },
    ];
  },
};

export default config;
