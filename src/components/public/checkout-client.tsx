"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { formatBRL } from "@/lib/format";

interface CheckoutResult {
  pixConfigured: boolean;
  brCode: string | null;
  qrDataUrl: string | null;
  subtotalCents: number;
  feeCents: number;
  totalCents: number;
  whatsappUrl: string | null;
  summary: {
    customer: { name: string; address: string; phone?: string };
    lines: { name: string; qty: number; lineCents: number }[];
  };
}

export function CheckoutClient({
  deliveryFeeCents,
  pixConfigured,
  whatsappConfigured,
}: {
  deliveryFeeCents: number;
  pixConfigured: boolean;
  whatsappConfigured: boolean;
}) {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotalCents());
  const clear = useCart((s) => s.clear);
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [copied, setCopied] = useState(false);

  const total = subtotal + deliveryFeeCents;

  async function handleSubmit() {
    setError(null);
    if (name.trim().length < 2) return setError("Informe seu nome.");
    if (address.trim().length < 5) return setError("Informe o endereço de entrega.");

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, address, phone },
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao finalizar. Tente novamente.");
        return;
      }
      setResult(data as CheckoutResult);
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!result?.brCode) return;
    await navigator.clipboard.writeText(result.brCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  // Carrinho vazio e ainda sem resultado
  if (items.length === 0 && !result) {
    return (
      <Shell>
        <h1 className="text-[28px]">Seu carrinho está vazio</h1>
        <p className="mt-2 text-cinza">Adicione cookies antes de finalizar.</p>
        <BackLink />
      </Shell>
    );
  }

  // TELA DE RESUMO / PIX
  if (result) {
    return (
      <Shell>
        <span className="mb-4 block h-[4px] w-9 rounded-full bg-laranja" aria-hidden />
        <h1 className="text-[28px]">Pedido gerado!</h1>

        <div className="mt-5 rounded-2xl bg-branco p-5 text-left shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
          <p className="text-[14px] text-cinza">Entrega para</p>
          <p className="font-bold">{result.summary.customer.name}</p>
          <p className="text-[14px]">{result.summary.customer.address}</p>

          <ul className="mt-4 border-t border-borda pt-3 text-[14px]">
            {result.summary.lines.map((l, idx) => (
              <li key={idx} className="flex justify-between py-0.5">
                <span>
                  {l.qty}x {l.name}
                </span>
                <span>{formatBRL(l.lineCents)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-borda pt-2 text-[14px] text-cinza">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatBRL(result.subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span>Entrega</span>
              <span>{result.feeCents > 0 ? formatBRL(result.feeCents) : "Grátis"}</span>
            </div>
          </div>
          <div className="mt-1 flex justify-between text-[18px] font-bold">
            <span>Total</span>
            <span>{formatBRL(result.totalCents)}</span>
          </div>
        </div>

        {result.pixConfigured && result.qrDataUrl ? (
          <div className="mt-5 rounded-2xl bg-branco p-5 shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
            <p className="text-[15px] font-bold">Pague com Pix</p>
            <p className="mt-1 text-[13px] text-cinza">
              Escaneie o QR Code ou use o código copia e cola. O valor já vem certo.
            </p>
            <Image
              src={result.qrDataUrl}
              alt="QR Code do Pix"
              width={220}
              height={220}
              className="mx-auto my-4 rounded-xl"
              unoptimized
            />
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-creme px-3 py-2 text-[12px]">
                {result.brCode}
              </code>
              <button
                onClick={copyCode}
                className="whitespace-nowrap rounded-lg bg-marrom px-3 py-2 text-[13px] font-bold text-creme"
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-laranja bg-laranja/10 p-5 text-[14px]">
            O Pix ainda não foi configurado pela loja. Finalize o pedido pelo WhatsApp
            que combinamos o pagamento por lá.
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-borda bg-branco p-4 text-[13.5px] text-cinza">
          <b className="text-marrom">Atenção:</b> após enviar a mensagem, anexe o
          print do comprovante na conversa do WhatsApp. O envio da imagem é feito
          por você, dentro do WhatsApp.
        </div>

        {result.whatsappUrl ? (
          <a
            href={result.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => clear()}
            className="mt-5 block rounded-full bg-vermelho px-6 py-4 text-center text-[15px] font-bold text-branco transition-colors hover:bg-vermelho-esc"
          >
            Enviar comprovante no WhatsApp
          </a>
        ) : (
          <p className="mt-5 rounded-xl bg-creme p-3 text-center text-[13px] text-cinza">
            WhatsApp não configurado pela loja.
          </p>
        )}

        <button
          onClick={() => {
            clear();
            router.push("/");
          }}
          className="mt-3 block w-full text-center text-[13px] text-cinza underline"
        >
          Fazer novo pedido
        </button>
      </Shell>
    );
  }

  // TELA DE FORMULÁRIO
  return (
    <Shell>
      <span className="mb-4 block h-[4px] w-9 rounded-full bg-laranja" aria-hidden />
      <h1 className="text-[28px]">Finalizar pedido</h1>

      {(!pixConfigured || !whatsappConfigured) && (
        <p className="mt-3 rounded-xl bg-laranja/10 p-3 text-[13px] text-marrom">
          Alguns dados da loja ainda estão sendo configurados. Você consegue
          finalizar mesmo assim.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 text-left">
        <Field label="Nome" value={name} onChange={setName} placeholder="Seu nome completo" />
        <Field
          label="Endereço de entrega"
          value={address}
          onChange={setAddress}
          placeholder="Rua, número, bairro, referência"
        />
        <Field
          label="Telefone (opcional)"
          value={phone}
          onChange={setPhone}
          placeholder="(17) 90000-0000"
        />
      </div>

      <div className="mt-5 rounded-2xl bg-branco p-4 text-[14px] shadow-[0_2px_10px_rgba(58,29,12,0.06)]">
        <div className="flex justify-between text-cinza">
          <span>Subtotal</span>
          <span>{formatBRL(subtotal)}</span>
        </div>
        <div className="mt-1 flex justify-between text-cinza">
          <span>Entrega</span>
          <span>{deliveryFeeCents > 0 ? formatBRL(deliveryFeeCents) : "Grátis"}</span>
        </div>
        <div className="mt-2 flex justify-between text-[18px] font-bold">
          <span>Total</span>
          <span>{formatBRL(total)}</span>
        </div>
      </div>

      {error && <p className="mt-3 text-[14px] font-semibold text-vermelho">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-5 w-full rounded-full bg-vermelho px-6 py-4 text-[15px] font-bold text-branco transition-colors hover:bg-vermelho-esc disabled:opacity-60"
      >
        {loading ? "Gerando pedido..." : "Gerar Pix e finalizar"}
      </button>
      <BackLink />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-[520px] px-5 py-12 text-center">
      {children}
    </main>
  );
}

function BackLink() {
  return (
    <Link href="/" className="mt-4 inline-block text-[13px] text-cinza underline">
      Voltar ao cardápio
    </Link>
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
      <span className="mb-1 block text-[13px] font-semibold text-marrom">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-borda bg-branco px-4 py-3 text-[15px] outline-none focus:border-vermelho"
      />
    </label>
  );
}
