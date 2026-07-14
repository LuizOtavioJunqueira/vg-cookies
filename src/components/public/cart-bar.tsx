"use client";

import { useCart } from "@/store/cart";
import { formatBRL } from "@/lib/format";
import { useEffect, useState } from "react";

export function CartBar({ onOpen }: { onOpen: () => void }) {
  const count = useCart((s) => s.count());
  const subtotal = useCart((s) => s.subtotalCents());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-branco shadow-[0_-4px_20px_rgba(58,29,12,0.14)]">
      <div className="mx-auto flex h-[70px] max-w-[1140px] items-center justify-between px-5">
        <div>
          <b className="text-[18px]">{formatBRL(subtotal)}</b>
          <span className="block text-[12px] text-cinza">
            {count} {count === 1 ? "item" : "itens"} no carrinho
          </span>
        </div>
        <button
          onClick={onOpen}
          className="rounded-full bg-vermelho px-7 py-3 text-[15px] font-bold text-branco transition-colors hover:bg-vermelho-esc"
        >
          Ver carrinho
        </button>
      </div>
    </div>
  );
}
