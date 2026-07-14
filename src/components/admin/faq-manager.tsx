"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFaqItem, updateFaqItem, deleteFaqItem } from "@/lib/actions";
import type { AdminFaqItem } from "@/lib/admin-data";

export function FaqManager({ items }: { items: AdminFaqItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminFaqItem | "new" | null>(null);

  return (
    <div className="max-w-[640px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[26px]">FAQ</h1>
        <button
          onClick={() => setEditing("new")}
          className="rounded-full bg-vermelho px-5 py-2.5 text-[14px] font-bold text-branco"
        >
          Nova pergunta
        </button>
      </div>
      <p className="mt-1 text-cinza">
        Perguntas e respostas exibidas na Home. A primeira da lista aparece aberta.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-branco shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        {items.length === 0 ? (
          <p className="p-6 text-cinza">Nenhuma pergunta ainda.</p>
        ) : (
          <ul className="divide-y divide-borda">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{item.question}</p>
                  <p className="mt-1 text-[13px] text-cinza line-clamp-2">{item.answer}</p>
                </div>
                <div className="flex flex-none gap-2">
                  <button
                    onClick={() => setEditing(item)}
                    className="rounded-lg border border-borda px-3 py-1.5 text-[13px] font-semibold hover:bg-vermelho-suave"
                  >
                    Editar
                  </button>
                  <DeleteButton id={item.id} onDone={() => router.refresh()} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <FaqEditor
          item={editing === "new" ? null : editing}
          nextOrder={items.length}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function DeleteButton({ id, onDone }: { id: string; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      disabled={busy}
      onClick={async () => {
        if (!confirm("Excluir esta pergunta?")) return;
        setBusy(true);
        const res = await deleteFaqItem(id);
        setBusy(false);
        if (!res.ok) return alert(res.error);
        onDone();
      }}
      className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-vermelho hover:bg-vermelho-suave disabled:opacity-50"
    >
      Excluir
    </button>
  );
}

function FaqEditor({
  item,
  nextOrder,
  onClose,
  onSaved,
}: {
  item: AdminFaqItem | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [question, setQuestion] = useState(item?.question ?? "");
  const [answer, setAnswer] = useState(item?.answer ?? "");
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? nextOrder);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    if (!question.trim()) return setError("Informe a pergunta.");
    if (!answer.trim()) return setError("Informe a resposta.");
    setSaving(true);
    const payload = { question, answer, sortOrder: Number(sortOrder) || 0 };
    const res = item
      ? await updateFaqItem(item.id, payload)
      : await createFaqItem(payload);
    setSaving(false);
    if (!res.ok) return setError(res.error);
    onSaved();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-marrom/50 p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-2xl bg-branco p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px]">{item ? "Editar pergunta" : "Nova pergunta"}</h2>
        <div className="mt-4 flex flex-col gap-3">
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Pergunta</span>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Resposta</span>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Ordem de exibição</span>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value || "0", 10))}
              className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
            />
          </label>
        </div>

        {error && <p className="mt-3 text-[14px] font-semibold text-vermelho">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-vermelho px-6 py-2.5 text-[14px] font-bold text-branco disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            onClick={onClose}
            className="rounded-full border border-borda px-6 py-2.5 text-[14px] font-bold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
