"use client";

import { useState } from "react";
import Image from "next/image";
import { signCloudinaryUpload } from "@/lib/actions";

export function ImageUploader({
  currentUrl,
  onUploaded,
  label = "Imagem",
}: {
  currentUrl?: string;
  onUploaded: (data: { url: string; publicId: string }) => void;
  label?: string;
}) {
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const sig = await signCloudinaryUpload();
      if (!sig.ok) throw new Error(sig.error);

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: form },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Falha no upload.");

      setPreview(data.secure_url);
      onUploaded({ url: data.secure_url, publicId: data.public_id });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1 block text-[13px] font-semibold">{label}</span>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 flex-none overflow-hidden rounded-xl border border-borda bg-creme">
          {preview ? (
            <Image
              src={preview}
              alt="Prévia"
              width={80}
              height={80}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="ph-cookie h-full w-full" />
          )}
        </div>
        <div>
          <label className="inline-block cursor-pointer rounded-lg bg-marrom px-4 py-2 text-[13px] font-bold text-creme">
            {uploading ? "Enviando..." : "Escolher imagem"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {error && <p className="mt-1 text-[12px] text-vermelho">{error}</p>}
        </div>
      </div>
    </div>
  );
}
