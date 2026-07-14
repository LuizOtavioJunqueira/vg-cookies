import "server-only";
import { createStaticPix, hasError } from "pix-utils";
import QRCode from "qrcode";
import { centsToPixAmount } from "@/lib/format";

export interface PixResult {
  brCode: string; // copia-e-cola
  qrDataUrl: string; // imagem PNG em data URL
}

export interface PixInput {
  pixKey: string;
  merchantName: string; // max 25 chars
  merchantCity: string; // max 15 chars
  amountCents: number; // subtotal + taxa
  reference?: string; // texto curto no campo de info (ex.: nome do cliente)
}

// Gera um Pix estatico com valor exato. O QR e unico por compra porque o
// valor muda. A chave nunca sai do servidor.
export async function generatePix(input: PixInput): Promise<PixResult> {
  const pix = createStaticPix({
    merchantName: sanitize(input.merchantName, 25),
    merchantCity: sanitize(input.merchantCity, 15),
    pixKey: input.pixKey,
    infoAdicional: input.reference ? sanitize(input.reference, 25) : "",
    transactionAmount: Number(centsToPixAmount(input.amountCents)),
  });

  if (hasError(pix)) {
    throw new Error(`Payload Pix inválido: ${pix.message}`);
  }

  const brCode = pix.toBRCode();
  const qrDataUrl = await QRCode.toDataURL(brCode, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
  });

  return { brCode, qrDataUrl };
}

// EMV nao aceita acentos/caracteres especiais; normaliza e corta no limite.
function sanitize(value: string, max: number): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim()
    .slice(0, max);
}
