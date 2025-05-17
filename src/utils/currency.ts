import type { Currency } from "../constants";

const cache: Partial<Record<Currency, number>> = { EUR: 1 };

/** Fetch (or return cached) EUR-base FX rates from our own API route. */
export async function ensureRates() {
  if (cache.USD) return cache;          // already populated
  const res = await fetch("/api/rates").then(r => r.json());
  Object.assign(cache, res as Record<Currency, number>);
  return cache;
}

export function fmt(eur: number, currency: Currency) {
  const rate = cache[currency] ?? 1;
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    eur * rate
  );
}
