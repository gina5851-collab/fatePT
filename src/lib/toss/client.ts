import { loadTossPayments, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { publicEnv } from "@/lib/env";

export async function loadWidgets(customerKey: string): Promise<TossPaymentsWidgets> {
  const tossPayments = await loadTossPayments(publicEnv.NEXT_PUBLIC_TOSS_CLIENT_KEY);
  return tossPayments.widgets({ customerKey });
}
