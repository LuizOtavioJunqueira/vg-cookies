"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductDTO, GalleryPhotoDTO, SiteSettingsDTO, FaqItemDTO } from "@/lib/types";
import { Header } from "./header";
import {
  Hero,
  Selos,
  Destaques,
  ComoFazemos,
  Galeria,
  Faq,
  CtaFinal,
  Footer,
} from "./sections";
import { CartDrawer } from "./cart-drawer";
import { CartBar } from "./cart-bar";
import { ProductModal } from "./product-modal";

export function HomeShell({
  featured,
  gallery,
  settings,
  faq,
}: {
  featured: ProductDTO[];
  gallery: GalleryPhotoDTO[];
  settings: SiteSettingsDTO;
  faq: FaqItemDTO[];
}) {
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<ProductDTO | null>(null);
  const router = useRouter();

  return (
    <>
      <Header onOpenCart={() => setCartOpen(true)} />

      <main className="pb-20">
        <Hero settings={settings} />
        <Selos settings={settings} />
        <Destaques products={featured} onOpen={setSelected} />
        <ComoFazemos settings={settings} />
        <Galeria photos={gallery} />
        <Faq items={faq} />
        <CtaFinal />
      </main>

      <Footer settings={settings} />

      <CartBar onOpen={() => setCartOpen(true)} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        settings={settings}
        onCheckout={() => router.push("/checkout")}
      />
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
