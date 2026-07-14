"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addGalleryPhoto, deleteGalleryPhoto } from "@/lib/actions";
import { ImageUploader } from "@/components/admin/image-uploader";

type Photo = { id: string; imageUrl: string; caption: string | null };

export function GalleryManager({ photos }: { photos: Photo[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<{ url: string; publicId: string } | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addPhoto() {
    if (!pending) return setError("Envie uma imagem primeiro.");
    setBusy(true);
    setError(null);
    const res = await addGalleryPhoto({
      imageUrl: pending.url,
      imagePublicId: pending.publicId,
      caption: caption || undefined,
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setPending(null);
    setCaption("");
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remover esta foto?")) return;
    const res = await deleteGalleryPhoto(id);
    if (!res.ok) return alert(res.error);
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-[26px]">Galeria</h1>
      <p className="mt-1 text-cinza">Fotos exibidas na seção &quot;Direto do forno&quot;.</p>

      <div className="mt-6 rounded-2xl bg-branco p-5 shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        <ImageUploader label="Nova foto" onUploaded={setPending} />
        <label className="mt-3 block">
          <span className="mb-1 block text-[13px] font-semibold">Legenda (opcional)</span>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
          />
        </label>
        {error && <p className="mt-2 text-[13px] font-semibold text-vermelho">{error}</p>}
        <button
          onClick={addPhoto}
          disabled={busy || !pending}
          className="mt-3 rounded-full bg-vermelho px-6 py-2.5 text-[14px] font-bold text-branco disabled:opacity-50"
        >
          {busy ? "Adicionando..." : "Adicionar à galeria"}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.length === 0 ? (
          <p className="text-cinza">Nenhuma foto ainda.</p>
        ) : (
          photos.map((ph) => (
            <div key={ph.id} className="overflow-hidden rounded-2xl bg-branco shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
              <Image
                src={ph.imageUrl}
                alt={ph.caption ?? "Foto"}
                width={300}
                height={300}
                className="aspect-square w-full object-cover"
                unoptimized
              />
              <div className="flex items-center justify-between p-2">
                <span className="truncate text-[12px] text-cinza">{ph.caption ?? "—"}</span>
                <button
                  onClick={() => remove(ph.id)}
                  className="text-[12px] font-semibold text-vermelho hover:underline"
                >
                  remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
