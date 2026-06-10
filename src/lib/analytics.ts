// GA4 dataLayer 이벤트 트래킹. 변수 미설정 환경(프리뷰/로컬)에선 console.log 로 fallback.
type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined),
  );
  if (typeof window.gtag === "function") {
    window.gtag("event", event, clean);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...clean });
  } else if (process.env.NODE_ENV !== "production") {
    console.log("[track]", event, clean);
  }
}
