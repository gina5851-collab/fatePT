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
    ];
  },
};

export default config;
