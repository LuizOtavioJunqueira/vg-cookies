import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/admin-data";
import { formatBRL } from "@/lib/format";
import { ProductRowActions } from "@/components/admin/product-row-actions";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[26px]">Produtos</h1>
        <Link
          href="/painel-x7k2/produtos/novo"
          className="rounded-full bg-vermelho px-5 py-2.5 text-[14px] font-bold text-branco"
        >
          Novo produto
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-branco shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        {products.length === 0 ? (
          <p className="p-6 text-cinza">Nenhum produto ainda.</p>
        ) : (
          <ul className="divide-y divide-borda">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                <div className="h-14 w-14 flex-none overflow-hidden rounded-xl bg-creme">
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.name} width={56} height={56} className="h-full w-full object-cover" unoptimized />
                  ) : (
                    <div className="ph-cookie h-full w-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-bold">{p.name}</span>
                    {!p.available && <Tag>oculto</Tag>}
                    {p.featured && <Tag tone="laranja">destaque</Tag>}
                    {p.stockQty === 0 && <Tag tone="vermelho">esgotado</Tag>}
                    {p.stockQty !== null && p.stockQty > 0 && p.stockQty <= 5 && (
                      <Tag tone="laranja">últimas {p.stockQty}</Tag>
                    )}
                  </div>
                  <span className="text-[13px] text-cinza">
                    {formatBRL(p.priceCents)}
                    {p.stockQty !== null && ` · estoque: ${p.stockQty}`}
                  </span>
                </div>
                <ProductRowActions product={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Tag({ children, tone = "cinza" }: { children: React.ReactNode; tone?: "cinza" | "laranja" | "vermelho" }) {
  return (
    <span
      className={
        "rounded-full px-2 py-0.5 text-[11px] font-bold " +
        (tone === "laranja"
          ? "bg-laranja text-marrom"
          : tone === "vermelho"
            ? "bg-vermelho text-branco"
            : "bg-creme text-cinza")
      }
    >
      {children}
    </span>
  );
}
