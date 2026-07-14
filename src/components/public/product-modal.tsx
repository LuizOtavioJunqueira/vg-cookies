"use client";

import type { ProductDTO } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/store/cart";
import { CookieImage } from "./cookie-image";
import { useEffect } from "react";

export function ProductModal({
  product,
  onClose,
}: {
  product: ProductDTO | null;
  onClose: () => void;
}) {
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    if (!product) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const outOfStock = product.stockQty === 0;
  const lowStock =
    product.stockQty !== null && product.stockQty > 0 && product.stockQty <= 5;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-marrom/50 p-0 sm:items-center sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="max-h-[88vh] w-full max-w-[460px] overflow-y-auto rounded-t-[26px] bg-branco p-6 sm:rounded-[26px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-between">
          <div
            className="mx-auto h-1.5 w-10 rounded-full bg-borda sm:hidden"
            aria-hidden
          />
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="ml-auto hidden text-cinza hover:text-marrom sm:block"
          >
            ✕
          </button>
        </div>

        <CookieImage
          src={product.imageUrl}
          alt={product.name}
          rounded="rounded-[20px]"
          className="mx-auto max-w-[240px]"
        />

        <h3 className="mt-5 text-[24px]">{product.name}</h3>
        <p className="mt-1 text-[15px] leading-relaxed text-cinza">
          {product.longDescription}
        </p>

        <div className="mt-5 rounded-2xl bg-creme p-4">
          <h4 className="font-display text-[13px] font-bold uppercase tracking-wide text-vermelho">
            Ingredientes
          </h4>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-marrom">
            {product.ingredients}
          </p>
          {product.weightGrams && (
            <p className="mt-3 text-[13px] text-cinza">
              Peso aproximado: {product.weightGrams}g
            </p>
          )}
          {outOfStock && (
            <p className="mt-3 text-[13px] font-bold text-vermelho">
              Produto esgotado no momento.
            </p>
          )}
          {lowStock && (
            <p className="mt-3 text-[13px] font-bold text-laranja-forte">
              Só {product.stockQty} unidades disponíveis.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="font-display text-[26px] font-extrabold text-marrom">
            {formatBRL(product.priceCents)}
          </span>
          <button
            disabled={outOfStock}
            onClick={() => {
              addItem({
                id: product.id,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl,
              });
              onClose();
            }}
            className="flex-1 rounded-full bg-vermelho px-6 py-3.5 text-[15px] font-bold text-branco transition-colors hover:bg-vermelho-esc disabled:cursor-not-allowed disabled:bg-borda disabled:text-cinza"
          >
            {outOfStock ? "Esgotado" : "Adicionar ao carrinho"}
          </button>
        </div>
      </div>
    </div>
  );
}
