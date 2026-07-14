"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/actions";
import type { AdminProduct } from "@/lib/admin-data";

export function ProductRowActions({ product }: { product: AdminProduct }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Excluir "${product.name}"? Esta ação não pode ser desfeita.`)) return;
    setBusy(true);
    const res = await deleteProduct(product.id);
    setBusy(false);
    if (!res.ok) {
      alert(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => router.push(`/painel-x7k2/produtos/${product.id}`)}
        className="rounded-lg border border-borda px-3 py-1.5 text-[13px] font-semibold hover:bg-vermelho-suave"
      >
        Editar
      </button>
      <button
        onClick={handleDelete}
        disabled={busy}
        className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-vermelho hover:bg-vermelho-suave disabled:opacity-50"
      >
        Excluir
      </button>
    </div>
  );
}
