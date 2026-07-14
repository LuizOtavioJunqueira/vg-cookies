import { getFaqItems } from "@/lib/admin-data";
import { FaqManager } from "@/components/admin/faq-manager";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const items = await getFaqItems();
  return <FaqManager items={items} />;
}
