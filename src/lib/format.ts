// Dinheiro sempre em centavos internamente. Formatacao so na borda (UI).

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Valor em reais com 2 casas e ponto decimal, para o payload EMV do Pix.
export function centsToPixAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}
