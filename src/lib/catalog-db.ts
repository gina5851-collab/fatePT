// =====================================================
// 카탈로그 ↔ 운영 DB 가격 동기 조회 (읽기 전용)
// =====================================================
// 결제 금액의 원천은 DB(products.price)다. 프런트 표시도 DB 값이 있으면
// DB 를 우선하고, DB 미연결(데모/로컬)일 때만 catalog.priceHint 로 폴백한다.
// 이 모듈은 조회만 하며 어떤 쓰기도 하지 않는다.

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { expandSlugsWithLegacy, pickRowForSlug } from "@/lib/readings/services/tarot/config";

export type DbProductRow = {
  id: string;
  slug: string;
  name: string;
  price: number;
  is_active: boolean;
};

// 반환 Map 의 key 는 '요청한(신) slug'다.
// 무중단 전환: SQL 적용 전(구 slug 행만 존재)에는 대응 구 slug 행으로 fallback 해 담는다.
// 사주 slug 는 legacy 매핑이 없어 기존과 완전히 동일하게 동작한다.
export async function fetchDbProducts(slugs: string[]): Promise<Map<string, DbProductRow>> {
  if (!isSupabaseConfigured() || slugs.length === 0) return new Map();
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, price, is_active")
    .in("slug", expandSlugsWithLegacy(slugs));
  const rows = (data ?? []) as DbProductRow[];
  const map = new Map<string, DbProductRow>();
  for (const requested of slugs) {
    const pick = pickRowForSlug(requested, rows);
    if (pick.warning) console.warn(`[catalog-db] ${pick.warning}`);
    if (pick.row) map.set(requested, pick.row);
  }
  return map;
}

/** 표시 가격: DB 우선, 없으면 카탈로그 참고가 */
export function resolvePrice(dbRow: DbProductRow | undefined, priceHint: number): number {
  return dbRow ? dbRow.price : priceHint;
}
