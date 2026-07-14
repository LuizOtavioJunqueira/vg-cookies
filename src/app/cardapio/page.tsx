import { getProducts, getSettings } from "@/lib/data";
import { CardapioShell } from "@/components/public/cardapio-shell";

export const dynamic = "force-dynamic";

export default async function CardapioPage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return <CardapioShell products={products} settings={settings} />;
}
