"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { CartIcon } from "./icons";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#inicio", label: "Início" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/#como", label: "Como fazemos" },
  { href: "/#faq", label: "FAQ" },
];

export function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const count = useCart((s) => s.count());
  // evita mismatch de hidratacao no badge (localStorage so existe no client)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-borda bg-creme/90 backdrop-blur">
      <div className="mx-auto flex h-[66px] max-w-[1140px] items-center justify-between px-5">
        <Link href="/#inicio" className="font-display text-[22px] font-extrabold text-vermelho">
          VG&nbsp;<span className="text-marrom">Cookies</span>
        </Link>

        <nav className="hidden gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[14.5px] font-semibold text-marrom transition-colors hover:text-vermelho"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={onOpenCart}
          aria-label="Abrir carrinho"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-vermelho text-branco transition-colors hover:bg-vermelho-esc"
        >
          <CartIcon className="h-[19px] w-[19px]" />
          {mounted && count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-creme bg-laranja px-1 text-[11px] font-bold text-marrom">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
