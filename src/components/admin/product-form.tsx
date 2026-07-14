"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { AdminProduct } from "@/lib/admin-data";

export function ProductForm({ product }: { product?: AdminProduct }) {
  const router = useRouter();
  const editing = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [shortDescription, setShort] = useState(product?.shortDescription ?? "");
  const [longDescription, setLong] = useState(product?.longDescription ?? "");
  const [ingredients, setIngredients] = useState(product?.ingredients ?? "");
  const [priceReais, setPriceReais] = useState(
    product ? (product.priceCents / 100).toFixed(2) : "",
  );
  const [weight, setWeight] = useState(product?.weightGrams?.toString() ?? "");
  const [stockQty, setStockQty] = useState(
    product?.stockQty != null ? String(product.stockQty) : "",
  );
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [imagePublicId, setImagePublicId] = useState(product?.imagePublicId ?? "");
  const [available, setAvailable] = useState(product?.available ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(product?.sortOrder ?? 0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    const priceCents = Math.round(parseFloat(priceReais.replace(",", ".")) * 100);
    if (!name.trim()) return setError("Informe o nome.");
    if (!Number.isFinite(priceCents) || priceCents < 0) return setError("Preço inválido.");

    const payload = {
      name,
      shortDescription,
      longDescription,
      ingredients,
      priceCents,
      weightGrams: weight ? parseInt(weight, 10) : null,
      imageUrl,
      imagePublicId,
      available,
      featured,
      stockQty: stockQty.trim() === "" ? null : Math.max(0, parseInt(stockQty, 10) || 0),
      sortOrder: Number(sortOrder) || 0,
    };

    setSaving(true);
    const res = editing
      ? await updateProduct(product!.id, payload)
      : await createProduct(payload);
    setSaving(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push("/painel-x7k2/produtos");
    router.refresh();
  }

  return (
    <div className="max-w-[560px]">
      <h1 className="text-[26px]">{editing ? "Editar produto" : "Novo produto"}</h1>

      <div className="mt-6 flex flex-col gap-4">
        <ImageUploader
          currentUrl={imageUrl}
          onUploaded={({ url, publicId }) => {
            setImageUrl(url);
            setImagePublicId(publicId);
          }}
        />

        <Text label="Nome" value={name} onChange={setName} />
        <Text label="Descrição curta (grid)" value={shortDescription} onChange={setShort} />
        <Area label="Descrição longa (modal)" value={longDescription} onChange={setLong} />
        <Area label="Ingredientes" value={ingredients} onChange={setIngredients} />

        <div className="grid grid-cols-2 gap-3">
          <Text label="Preço (R$)" value={priceReais} onChange={setPriceReais} placeholder="13.00" />
          <Text label="Peso (g, opcional)" value={weight} onChange={setWeight} placeholder="120" />
        </div>

        <div>
          <Text
            label="Estoque disponível (deixe vazio = ilimitado)"
            value={stockQty}
            onChange={setStockQty}
            placeholder="ex.: 20"
          />
          <p className="mt-1 text-[12px] text-cinza">
            Controle manual: você atualiza esse número. Ao chegar em 0, o produto
            some do carrinho e o site trava novas compras dele.
          </p>
        </div>

        <Text
          label="Ordem no cardápio"
          value={String(sortOrder)}
          onChange={(v) => setSortOrder(parseInt(v || "0", 10))}
        />

        <div className="flex gap-6">
          <Check label="Disponível" checked={available} onChange={setAvailable} />
          <Check label="Destaque na Home" checked={featured} onChange={setFeatured} />
        </div>

        {error && <p className="text-[14px] font-semibold text-vermelho">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-vermelho px-6 py-3 text-[15px] font-bold text-branco disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            onClick={() => router.push("/painel-x7k2/produtos")}
            className="rounded-full border border-borda px-6 py-3 text-[15px] font-bold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function Text({
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

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-borda bg-branco px-4 py-2.5 text-[15px] outline-none focus:border-vermelho"
      />
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[14px] font-semibold">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
