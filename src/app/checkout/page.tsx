import { getSettings } from "@/lib/data";
import { CheckoutClient } from "@/components/public/checkout-client";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <CheckoutClient
      deliveryFeeCents={settings.deliveryFeeCents}
      pixConfigured={settings.pixConfigured}
      whatsappConfigured={settings.whatsappNumber.length > 0}
    />
  );
}
