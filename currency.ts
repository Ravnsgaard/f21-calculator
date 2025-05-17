import type { Currency } from "../constants";
let cache: Record<Currency, number> | null = null;
export async function ensureRates() {
  if (cache) return cache;
  const res = await fetch("https://api.exchangerate.host/latest?base=EUR&symbols=USD,DKK");
  const { rates } = (await res.json()) as { rates: Record<string, number> };
  cache = { EUR: 1, USD: rates.USD, DKK: rates.DKK } as Record<Currency, number>;
  return cache;
}
export function fmt(eur: number, currency: Currency) {
  const rate = cache?.[currency] ?? 1;
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(eur * rate);
}
