import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { generatePix } from "@/lib/pix";
import { formatBRL } from "@/lib/format";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }
  const { customer, items, paymentMethod } = parsed.data;

  // Configurações + preços SEMPRE do banco (nunca confiar no cliente).
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    return NextResponse.json({ error: "Loja não configurada" }, { status: 503 });
  }

  const ids = items.map((i) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, available: true },
  });

  type ProductRow = { id: string; name: string; priceCents: number; stockQty: number | null };
  const byId = new Map<string, ProductRow>(
    products.map((p: ProductRow) => [p.id, p]),
  );

  const lines: { name: string; qty: number; lineCents: number }[] = [];
  let subtotalCents = 0;
  for (const item of items) {
    const p = byId.get(item.id);
    if (!p) {
      return NextResponse.json(
        { error: "Um dos itens não está mais disponível" },
        { status: 409 },
      );
    }
    if (p.stockQty !== null && item.qty > p.stockQty) {
      return NextResponse.json(
        {
          error:
            p.stockQty === 0
              ? `"${p.name}" está esgotado.`
              : `Só temos ${p.stockQty} unidade(s) de "${p.name}" disponível.`,
        },
        { status: 409 },
      );
    }
    const lineCents = p.priceCents * item.qty;
    subtotalCents += lineCents;
    lines.push({ name: p.name, qty: item.qty, lineCents });
  }

  const feeCents = settings.deliveryFeeCents ?? 0;
  const totalCents = subtotalCents + feeCents;

  // Pix configurado? Se não, devolve o resumo mas sinaliza (sem gerar QR quebrado).
  const pixConfigured =
    settings.pixKey.trim().length > 0 && settings.merchantName.trim().length > 0;

  // So gera Pix/QR se o cliente escolheu pagar via Pix. Cartao e dinheiro
  // sao acertados na entrega, entao nem passam pelo gerador.
  let pix: { brCode: string; qrDataUrl: string } | null = null;
  if (paymentMethod === "PIX" && pixConfigured) {
    try {
      pix = await generatePix({
        pixKey: settings.pixKey,
        merchantName: settings.merchantName,
        merchantCity: settings.merchantCity || "POTIRENDABA",
        amountCents: totalCents,
        reference: customer.name,
      });
    } catch {
      return NextResponse.json(
        { error: "Não foi possível gerar o Pix. Confira a chave nas configurações." },
        { status: 500 },
      );
    }
  }

  // Mensagem do WhatsApp com o resumo do pedido.
  const PAYMENT_LABELS: Record<typeof paymentMethod, string> = {
    PIX: "Pix",
    CARTAO_CREDITO: "Cartão de crédito",
    CARTAO_DEBITO: "Cartão de débito",
    DINHEIRO: "Dinheiro",
  };
  const paymentLabel = PAYMENT_LABELS[paymentMethod];

  const itemLines = lines
    .map((l) => `• ${l.qty}x ${l.name} — ${formatBRL(l.lineCents)}`)
    .join("\n");
  const feeLine = feeCents > 0 ? `\nEntrega: ${formatBRL(feeCents)}` : "\nEntrega: Grátis";
  const paymentClosingLine =
    paymentMethod === "PIX"
      ? "Segue o comprovante do Pix."
      : `Pagamento combinado: ${paymentLabel} (na entrega).`;
  const message =
    `*Novo pedido — VG Cookies*\n\n` +
    `*Nome:* ${customer.name}\n` +
    `*Endereço:* ${customer.address}\n` +
    (customer.phone ? `*Telefone:* ${customer.phone}\n` : "") +
    `\n*Itens:*\n${itemLines}\n` +
    `\nSubtotal: ${formatBRL(subtotalCents)}${feeLine}\n` +
    `*Total: ${formatBRL(totalCents)}*\n` +
    `*Pagamento:* ${paymentLabel}\n\n` +
    paymentClosingLine;

  const whatsappUrl = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`
    : null;

  return NextResponse.json({
    paymentMethod,
    pixConfigured,
    brCode: pix?.brCode ?? null,
    qrDataUrl: pix?.qrDataUrl ?? null,
    subtotalCents,
    feeCents,
    totalCents,
    whatsappUrl,
    summary: { customer, lines },
  });
}