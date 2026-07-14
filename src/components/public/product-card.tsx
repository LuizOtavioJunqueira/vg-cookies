"use client";

import type { ProductDTO } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/store/cart";
import { CookieImage } from "./cookie-image";
import { PlusIcon } from "./icons";

export function ProductCard({
  product,
  onOpen,
}: {
  product: ProductDTO;
  onOpen?: (p: ProductDTO) => void;
}) {
  const addItem = useCart((s) => s.addItem);
  const outOfStock = product.stockQty === 0;
  const lowStock =
    product.stockQty !== null && product.stockQty > 0 && product.stockQty <= 5;

  return (
    <div className="flex flex-col rounded-[22px] bg-branco p-4 shadow-[0_4px_20px_rgba(58,29,12,0.07)] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(58,29,12,0.14)]">
      <button
        type="button"
        onClick={() => onOpen?.(product)}
        className="text-left"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <div className="relative">
          <CookieImage src={product.imageUrl} alt={product.name} />
          {outOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-marrom px-2.5 py-1 text-[11px] font-bold text-creme">
              Esgotado
            </span>
          )}
        </div>
        <h3 className="mt-3.5 text-[16px]">{product.name}</h3>
        <p className="mt-1 flex-1 text-[12.5px] leading-snug text-cinza">
          {product.shortDescription}
        </p>
        {lowStock && (
          <p className="mt-1 text-[12px] font-semibold text-laranja-forte">
            Só {product.stockQty} unidades
          </p>
        )}
      </button>

      <div className="mt-3.5 flex items-center justify-between">
        <span className="rounded-full bg-laranja px-3 py-[5px] text-[13.5px] font-bold text-marrom">
          {formatBRL(product.priceCents)}
        </span>
        <button
          type="button"
          disabled={outOfStock}
          onClick={() =>
            addItem({
              id: product.id,
              name: product.name,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
            })
          }
          aria-label={`Adicionar ${product.name} ao carrinho`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-vermelho text-branco transition-colors hover:bg-vermelho-esc disabled:cursor-not-allowed disabled:bg-borda disabled:text-cinza"
        >
          <PlusIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
