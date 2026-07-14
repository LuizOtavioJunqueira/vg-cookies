"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductDTO, SiteSettingsDTO } from "@/lib/types";
import { Header } from "./header";
import { Footer } from "./sections";
import { ProductCard } from "./product-card";
import { ProductModal } from "./product-modal";
import { CartDrawer } from "./cart-drawer";
import { CartBar } from "./cart-bar";

export function CardapioShell({
  products,
  settings,
}: {
  products: ProductDTO[];
  settings: SiteSettingsDTO;
}) {
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<ProductDTO | null>(null);
  const router = useRouter();

  return (
    <>
      <Header onOpenCart={() => setCartOpen(true)} />

      <main className="mx-auto min-h-[60vh] max-w-[1140px] px-5 pb-24 pt-10">
        <span className="mb-4 block h-[4px] w-9 rounded-full bg-laranja" aria-hidden />
        <h1 className="text-[clamp(32px,6.5vw,48px)]">Cardápio completo</h1>
        <p className="mt-2.5 max-w-[440px] text-[16px] text-cinza">
          Todos os nossos sabores, sempre assados na hora do pedido.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setSelected} />
            ))
          ) : (
            <p className="col-span-full text-cinza">
              Nenhum produto disponível no momento.
            </p>
          )}
        </div>
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
