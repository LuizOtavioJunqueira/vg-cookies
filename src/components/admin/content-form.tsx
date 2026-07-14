"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateContent } from "@/lib/actions";
import type { FullSettings } from "@/lib/admin-data";

export function ContentForm({ settings }: { settings: FullSettings }) {
  const router = useRouter();
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle ?? "");
  const [aboutText, setAboutText] = useState(settings.aboutText ?? "");
  const [selo1Title, setSelo1Title] = useState(settings.selo1Title);
  const [selo1Desc, setSelo1Desc] = useState(settings.selo1Desc);
  const [selo2Title, setSelo2Title] = useState(settings.selo2Title);
  const [selo2Desc, setSelo2Desc] = useState(settings.selo2Desc);
  const [selo3Title, setSelo3Title] = useState(settings.selo3Title);
  const [selo3Desc, setSelo3Desc] = useState(settings.selo3Desc);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setMsg(null);
    setSaving(true);
    const res = await updateContent({
      heroTitle: heroTitle || null,
      heroSubtitle: heroSubtitle || null,
      aboutText: aboutText || null,
      selo1Title,
      selo1Desc,
      selo2Title,
      selo2Desc,
      selo3Title,
      selo3Desc,
    });
    setSaving(false);
    setMsg(res.ok ? { ok: true, text: "Salvo!" } : { ok: false, text: res.error });
    if (res.ok) router.refresh();
  }

  return (
    <div className="max-w-[560px]">
      <h1 className="text-[26px]">Textos da Home</h1>
      <p className="mt-1 text-cinza">O que aparece no topo e na seção &quot;Como fazemos&quot;.</p>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-branco p-5 shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        <label className="block">
          <span className="mb-1 block text-[13px] font-semibold">Título do topo</span>
          <input
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[13px] font-semibold">Subtítulo do topo</span>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[13px] font-semibold">Texto &quot;Como fazemos&quot;</span>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-branco p-5 shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        <h2 className="font-display text-[17px] font-bold">
          Selos (abaixo do topo)
        </h2>
        <p className="-mt-2 text-[13px] text-cinza">
          Os 3 blocos com ícone que aparecem logo abaixo do hero.
        </p>

        <div className="grid gap-3 border-t border-borda pt-4">
          <span className="text-[13px] font-bold text-vermelho">Selo 1</span>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Título</span>
            <input
              value={selo1Title}
              onChange={(e) => setSelo1Title(e.target.value)}
              className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Descrição</span>
            <input
              value={selo1Desc}
              onChange={(e) => setSelo1Desc(e.target.value)}
              className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
            />
          </label>
        </div>

        <div className="grid gap-3 border-t border-borda pt-4">
          <span className="text-[13px] font-bold text-vermelho">Selo 2</span>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Título</span>
            <input
              value={selo2Title}
              onChange={(e) => setSelo2Title(e.target.value)}
              className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Descrição</span>
            <input
              value={selo2Desc}
              onChange={(e) => setSelo2Desc(e.target.value)}
              className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
            />
          </label>
        </div>

        <div className="grid gap-3 border-t border-borda pt-4">
          <span className="text-[13px] font-bold text-vermelho">Selo 3</span>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Título</span>
            <input
              value={selo3Title}
              onChange={(e) => setSelo3Title(e.target.value)}
              className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-semibold">Descrição</span>
            <input
              value={selo3Desc}
              onChange={(e) => setSelo3Desc(e.target.value)}
              className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
            />
          </label>
        </div>
      </div>

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
        {saving ? "Salvando..." : "Salvar textos"}
      </button>
    </div>
  );
}
