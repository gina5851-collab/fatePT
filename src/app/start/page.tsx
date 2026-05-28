import { getCurrentUser } from "@/lib/auth";
import { StartFunnel } from "@/components/start/StartFunnel";

export const metadata = { title: "무료 운명 인바디" };

export default async function StartPage() {
  const user = await getCurrentUser();
  return <StartFunnel isLoggedIn={!!user} />;
}
