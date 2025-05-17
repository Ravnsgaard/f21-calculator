import type { Currency } from "../constants";

const cache: Partial<Record<Currency, number>> = { EUR: 1 };

export async function ensureRates() {
  if (cache.USD && cache.DKK) return cache;
  const res = await fetch(
    "https://api.exchangerate.host/latest?base=EUR&symbols=USD,DKK",
    { next: { revalidate: 3600 } } // cache on server for 1 h
  );
  const { rates } = (await res.json()) as { rates: Record<string, number> };
  cache.USD = rates.USD;
  cache.DKK = rates.DKK;
  return cache;
}

export function fmt(eur: number, currency: Currency) {
  const rate = cache[currency] ?? 1;
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    eur * rate
  );
}
