"use client";

import { useCart } from "@/store/cart";
import { formatBRL } from "@/lib/format";
import type { SiteSettingsDTO } from "@/lib/types";
import { CookieImage } from "./cookie-image";
import { useEffect } from "react";

export function CartDrawer({
  open,
  onClose,
  settings,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  settings: SiteSettingsDTO;
  onCheckout: () => void;
}) {
  const items = useCart((s) => s.items);
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) => s.subtotalCents());

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const fee = settings.deliveryFeeCents;
  const total = subtotal + fee;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-marrom/50 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`fixed right-0 top-0 z-[65] flex h-full w-full max-w-[420px] flex-col bg-creme shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Carrinho"
      >
        <div className="flex items-center justify-between border-b border-borda px-5 py-4">
          <h3 className="text-[20px]">Seu carrinho</h3>
          <button onClick={onClose} aria-label="Fechar" className="text-cinza hover:text-marrom">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-cinza">
              Seu carrinho está vazio.
              <br />
              Escolha seus cookies no cardápio.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3 rounded-2xl bg-branco p-3">
                  <CookieImage
                    src={i.imageUrl}
                    alt={i.name}
                    rounded="rounded-xl"
                    className="h-16 w-16 flex-none"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <span className="text-[14px] font-bold leading-tight">{i.name}</span>
                      <button
                        onClick={() => removeItem(i.id)}
                        aria-label={`Remover ${i.name}`}
                        className="text-[12px] text-cinza hover:text-vermelho"
                      >
                        remover
                      </button>
                    </div>
                    <span className="text-[13px] text-cinza">{formatBRL(i.priceCents)}</span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decrement(i.id)}
                          aria-label="Diminuir"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-borda text-marrom hover:bg-vermelho-suave"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-[14px] font-bold">{i.qty}</span>
                        <button
                          onClick={() => increment(i.id)}
                          aria-label="Aumentar"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-borda text-marrom hover:bg-vermelho-suave"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[14px] font-bold">
                        {formatBRL(i.priceCents * i.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-borda px-5 py-4">
            <div className="flex justify-between text-[14px] text-cinza">
              <span>Subtotal</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-[14px] text-cinza">
              <span>Entrega</span>
              <span>{fee > 0 ? formatBRL(fee) : "Grátis"}</span>
            </div>
            <div className="mt-2 flex justify-between text-[18px] font-bold">
              <span>Total</span>
              <span>{formatBRL(total)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="mt-4 w-full rounded-full bg-vermelho px-6 py-3.5 text-[15px] font-bold text-branco transition-colors hover:bg-vermelho-esc"
            >
              Finalizar pedido
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
