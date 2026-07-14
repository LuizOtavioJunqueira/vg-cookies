import { getFeaturedProducts, getGallery, getSettings, getFaq } from "@/lib/data";
import { HomeShell } from "@/components/public/home-shell";

// Dados vem do DB a cada request (config/produtos podem mudar no painel).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, gallery, settings, faq] = await Promise.all([
    getFeaturedProducts(4),
    getGallery(6),
    getSettings(),
    getFaq(),
  ]);

  return <HomeShell featured={featured} gallery={gallery} settings={settings} faq={faq} />;
}
