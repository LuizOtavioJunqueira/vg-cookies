"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth-actions";
import { clsx } from "clsx";

const NAV = [
  { href: "/painel-x7k2", label: "Início" },
  { href: "/painel-x7k2/produtos", label: "Produtos" },
  { href: "/painel-x7k2/galeria", label: "Galeria" },
  { href: "/painel-x7k2/conteudo", label: "Textos da Home" },
  { href: "/painel-x7k2/faq", label: "FAQ" },
  { href: "/painel-x7k2/configuracoes", label: "Configurações" },
];

export function AdminShell({
  user,
  children,
}: {
  user: { name?: string | null; role?: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSuper = user.role === "SUPER_ADMIN";

  const links = isSuper
    ? [...NAV, { href: "/painel-x7k2/admins", label: "Admins" }]
    : NAV;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-borda bg-branco md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4 md:block">
          <div className="font-display text-[20px] font-extrabold text-vermelho">
            VG&nbsp;<span className="text-marrom">Cookies</span>
          </div>
          <p className="hidden text-[12px] text-cinza md:mt-1 md:block">
            {user.name} · {isSuper ? "Super admin" : "Admin"}
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:mt-2 md:flex-col md:overflow-visible">
          {links.map((l) => {
            const active =
              l.href === "/painel-x7k2"
                ? pathname === l.href
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "whitespace-nowrap rounded-lg px-4 py-2 text-[14px] font-semibold transition-colors",
                  active
                    ? "bg-vermelho text-branco"
                    : "text-marrom hover:bg-vermelho-suave",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <form action={logout} className="md:mt-4">
            <button
              type="submit"
              className="whitespace-nowrap rounded-lg px-4 py-2 text-[14px] font-semibold text-cinza hover:text-vermelho"
            >
              Sair
            </button>
          </form>
        </nav>
      </aside>

      <main className="px-5 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
