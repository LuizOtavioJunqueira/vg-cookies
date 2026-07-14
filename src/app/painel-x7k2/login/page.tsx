"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/auth-actions";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-[380px]">
        <div className="text-center">
          <div className="font-display text-[26px] font-extrabold text-vermelho">
            VG&nbsp;<span className="text-marrom">Cookies</span>
          </div>
          <p className="mt-1 text-[13px] text-cinza">Painel administrativo</p>
        </div>

        <form
          action={formAction}
          className="mt-8 flex flex-col gap-3 rounded-2xl bg-branco p-6 shadow-[0_4px_20px_rgba(58,29,12,0.08)]"
        >
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">E-mail</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-borda bg-creme px-4 py-3 text-[15px] outline-none focus:border-vermelho"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Senha</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-borda bg-creme px-4 py-3 text-[15px] outline-none focus:border-vermelho"
            />
          </label>

          {error && <p className="text-[13px] font-semibold text-vermelho">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-vermelho px-6 py-3 text-[15px] font-bold text-branco transition-colors hover:bg-vermelho-esc disabled:opacity-60"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
