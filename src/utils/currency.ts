import type { Currency } from "../constants";

const cache: Partial<Record<Currency, number>> = { EUR: 1 };

/** Fetch EUR-base FX rates from our API route once per session. */
export async function loadRates() {
  if (cache.USD) return;                             // already cached
  try {
    const rates = await fetch("/api/rates").then((r) => r.json());
    Object.assign(cache, rates as Record<Currency, number>);
  } catch {
    /* network error → leave cache as 1s */
  }
}

export function rate(c: Currency) {
  return cache[c] ?? 1;
}

export function fmt(eur: number, currency: Currency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(eur * rate(currency));
}
