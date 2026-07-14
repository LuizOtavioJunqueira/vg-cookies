import Link from "next/link";
import { getAllProducts, getAdminGallery, getFullSettings } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [products, gallery, settings] = await Promise.all([
    getAllProducts(),
    getAdminGallery(),
    getFullSettings(),
  ]);

  const available = products.filter((p) => p.available).length;
  const pixOk = settings.pixKey.trim().length > 0 && settings.merchantName.trim().length > 0;
  const waOk = settings.whatsappNumber.length > 0;

  return (
    <div>
      <h1 className="text-[26px]">Início</h1>
      <p className="mt-1 text-cinza">Visão geral da loja.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card title="Produtos" value={`${available}/${products.length}`} sub="disponíveis" />
        <Card title="Fotos na galeria" value={String(gallery.length)} sub="publicadas" />
        <Card
          title="Taxa de entrega"
          value={settings.deliveryFeeCents > 0 ? `R$ ${(settings.deliveryFeeCents / 100).toFixed(2)}` : "Grátis"}
          sub="atual"
        />
      </div>

      {(!pixOk || !waOk) && (
        <div className="mt-6 rounded-2xl border border-laranja bg-laranja/10 p-5">
          <h3 className="font-display text-[16px] font-bold">Configuração pendente</h3>
          <ul className="mt-2 list-inside list-disc text-[14px] text-marrom">
            {!pixOk && <li>Chave Pix e nome do recebedor ainda não configurados.</li>}
            {!waOk && <li>Número de WhatsApp ainda não configurado.</li>}
          </ul>
          <Link
            href="/painel-x7k2/configuracoes"
            className="mt-3 inline-block rounded-full bg-vermelho px-5 py-2 text-[14px] font-bold text-branco"
          >
            Ir para configurações
          </Link>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/painel-x7k2/produtos" className="rounded-full bg-marrom px-5 py-2.5 text-[14px] font-bold text-creme">
          Gerenciar produtos
        </Link>
        <Link href="/painel-x7k2/galeria" className="rounded-full border border-borda px-5 py-2.5 text-[14px] font-bold">
          Gerenciar galeria
        </Link>
      </div>
    </div>
  );
}

function Card({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-branco p-5 shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
      <p className="text-[13px] text-cinza">{title}</p>
      <p className="mt-1 font-display text-[28px] font-extrabold">{value}</p>
      <p className="text-[12px] text-cinza">{sub}</p>
    </div>
  );
}
