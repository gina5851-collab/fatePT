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
      { source: "/products/today-fortune", destination: "/products/tarot-daily", permanent: true },
      // 구 5장 관계 스프레드 → 켈틱 크로스(기준 v1)로 대체
      { source: "/products/tarot-relationship", destination: "/products/tarot-celtic-cross", permanent: true },
    ];
  },
};

export default config;
