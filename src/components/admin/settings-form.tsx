"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "@/lib/actions";
import type { FullSettings } from "@/lib/admin-data";

const PIX_TYPES = [
  { value: "RANDOM", label: "Chave aleatória" },
  { value: "CPF", label: "CPF" },
  { value: "CNPJ", label: "CNPJ" },
  { value: "EMAIL", label: "E-mail" },
  { value: "PHONE", label: "Telefone" },
] as const;

export function SettingsForm({ settings }: { settings: FullSettings }) {
  const router = useRouter();
  const [f, setF] = useState({
    pixKey: settings.pixKey,
    pixKeyType: settings.pixKeyType,
    merchantName: settings.merchantName,
    merchantCity: settings.merchantCity,
    whatsappNumber: settings.whatsappNumber,
    deliveryReais: (settings.deliveryFeeCents / 100).toFixed(2),
    phone: settings.phone ?? "",
    address: settings.address ?? "",
    instagram: settings.instagram ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((s) => ({ ...s, [k]: v }));
  }

  async function save() {
    setMsg(null);
    const deliveryFeeCents = Math.round(
      parseFloat(f.deliveryReais.replace(",", ".") || "0") * 100,
    );
    setSaving(true);
    const res = await updateSettings({
      pixKey: f.pixKey,
      pixKeyType: f.pixKeyType,
      merchantName: f.merchantName,
      merchantCity: f.merchantCity,
      whatsappNumber: f.whatsappNumber,
      deliveryFeeCents: Number.isFinite(deliveryFeeCents) ? deliveryFeeCents : 0,
      phone: f.phone || null,
      address: f.address || null,
      instagram: f.instagram || null,
    });
    setSaving(false);
    setMsg(res.ok ? { ok: true, text: "Salvo!" } : { ok: false, text: res.error });
    if (res.ok) router.refresh();
  }

  return (
    <div className="max-w-[560px]">
      <h1 className="text-[26px]">Configurações</h1>

      <section className="mt-6 rounded-2xl bg-branco p-5 shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        <h2 className="font-display text-[17px] font-bold">Pix</h2>
        <p className="mt-1 text-[13px] text-cinza">
          Usado para gerar o QR Code de cada pedido. Nome e cidade têm limite de
          caracteres (padrão do Pix).
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Tipo de chave</span>
            <select
              value={f.pixKeyType}
              onChange={(e) => set("pixKeyType", e.target.value as FullSettings["pixKeyType"])}
              className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px]"
            >
              {PIX_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <Field label="Chave Pix" value={f.pixKey} onChange={(v) => set("pixKey", v)} />
          <Field label="Nome do recebedor (máx 25)" value={f.merchantName} onChange={(v) => set("merchantName", v.slice(0, 25))} />
          <Field label="Cidade (máx 15)" value={f.merchantCity} onChange={(v) => set("merchantCity", v.slice(0, 15))} />
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-branco p-5 shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        <h2 className="font-display text-[17px] font-bold">Pedido & Entrega</h2>
        <div className="mt-4 flex flex-col gap-3">
          <Field
            label="WhatsApp (só números, com DDI/DDD)"
            value={f.whatsappNumber}
            onChange={(v) => set("whatsappNumber", v.replace(/\D/g, ""))}
            placeholder="5517996636191"
          />
          <Field
            label="Taxa de entrega (R$) — 0 = grátis"
            value={f.deliveryReais}
            onChange={(v) => set("deliveryReais", v)}
            placeholder="0.00"
          />
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-branco p-5 shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        <h2 className="font-display text-[17px] font-bold">Contato (exibido na Home)</h2>
        <div className="mt-4 flex flex-col gap-3">
          <Field label="Telefone" value={f.phone} onChange={(v) => set("phone", v)} />
          <Field label="Endereço" value={f.address} onChange={(v) => set("address", v)} />
          <Field label="Instagram" value={f.instagram} onChange={(v) => set("instagram", v)} />
        </div>
      </section>

      {msg && (
        <p className={`mt-4 text-[14px] font-semibold ${msg.ok ? "text-green-700" : "text-vermelho"}`}>
          {msg.text}
        </p>
      )}
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-full bg-vermelho px-6 py-3 text-[15px] font-bold text-branco disabled:opacity-60"
      >
        {saving ? "Salvando..." : "Salvar configurações"}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
      />
    </label>
  );
}
