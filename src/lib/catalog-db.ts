// =====================================================
// 카탈로그 ↔ 운영 DB 가격 동기 조회 (읽기 전용)
// =====================================================
// 결제 금액의 원천은 DB(products.price)다. 프런트 표시도 DB 값이 있으면
// DB 를 우선하고, DB 미연결(데모/로컬)일 때만 catalog.priceHint 로 폴백한다.
// 이 모듈은 조회만 하며 어떤 쓰기도 하지 않는다.

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export type DbProductRow = {
  id: string;
  slug: string;
  name: string;
  price: number;
  is_active: boolean;
};

export async function fetchDbProducts(slugs: string[]): Promise<Map<string, DbProductRow>> {
  if (!isSupabaseConfigured() || slugs.length === 0) return new Map();
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, price, is_active")
    .in("slug", slugs);
  return new Map((data ?? []).map((r) => [r.slug, r as DbProductRow]));
}

/** 표시 가격: DB 우선, 없으면 카탈로그 참고가 */
export function resolvePrice(dbRow: DbProductRow | undefined, priceHint: number): number {
  return dbRow ? dbRow.price : priceHint;
}
