/**
 * Analytics 통합 컴포넌트
 *
 * 환경변수 설정 방법 (Vercel 대시보드 또는 .env.local):
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX      ← Google Analytics 4 측정 ID
 *   NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx   ← Microsoft Clarity 프로젝트 ID
 *
 * 두 값 모두 없으면 스크립트 자체가 삽입되지 않습니다 (완전 비활성).
 */

import Script from "next/script";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <>
      {/* ── Google Analytics 4 ─────────────────────────────── */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {/* ── Microsoft Clarity ──────────────────────────────── */}
      {clarityId && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}
    </>
  );
}
