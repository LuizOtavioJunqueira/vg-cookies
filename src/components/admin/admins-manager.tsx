"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdmin, deleteAdmin } from "@/lib/actions";

type AdminRow = { id: string; name: string; email: string; role: string };

export function AdminsManager({
  admins,
  currentId,
}: {
  admins: AdminRow[];
  currentId: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function create() {
    setMsg(null);
    setBusy(true);
    const res = await createAdmin({ name, email, password });
    setBusy(false);
    if (!res.ok) return setMsg({ ok: false, text: res.error });
    setMsg({ ok: true, text: "Admin criado." });
    setName("");
    setEmail("");
    setPassword("");
    router.refresh();
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Remover o admin "${label}"?`)) return;
    const res = await deleteAdmin(id);
    if (!res.ok) return alert(res.error);
    router.refresh();
  }

  return (
    <div className="max-w-[620px]">
      <h1 className="text-[26px]">Admins</h1>
      <p className="mt-1 text-cinza">Apenas o super admin gerencia outros admins.</p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-branco shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        <ul className="divide-y divide-borda">
          {admins.map((a) => (
            <li key={a.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold">{a.name}</span>
                  {a.role === "SUPER_ADMIN" && (
                    <span className="rounded-full bg-laranja px-2 py-0.5 text-[11px] font-bold text-marrom">
                      super
                    </span>
                  )}
                  {a.id === currentId && (
                    <span className="rounded-full bg-creme px-2 py-0.5 text-[11px] font-bold text-cinza">
                      você
                    </span>
                  )}
                </div>
                <span className="text-[13px] text-cinza">{a.email}</span>
              </div>
              {a.role !== "SUPER_ADMIN" && a.id !== currentId && (
                <button
                  onClick={() => remove(a.id, a.name)}
                  className="text-[13px] font-semibold text-vermelho hover:underline"
                >
                  remover
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl bg-branco p-5 shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        <h2 className="font-display text-[17px] font-bold">Novo admin</h2>
        <div className="mt-4 flex flex-col gap-3">
          <Field label="Nome" value={name} onChange={setName} />
          <Field label="E-mail" value={email} onChange={setEmail} type="email" />
          <Field label="Senha (mín. 8)" value={password} onChange={setPassword} type="password" />
        </div>
        {msg && (
          <p className={`mt-3 text-[14px] font-semibold ${msg.ok ? "text-green-700" : "text-vermelho"}`}>
            {msg.text}
          </p>
        )}
        <button
          onClick={create}
          disabled={busy}
          className="mt-4 rounded-full bg-vermelho px-6 py-3 text-[15px] font-bold text-branco disabled:opacity-60"
        >
          {busy ? "Criando..." : "Criar admin"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
      />
    </label>
  );
}
