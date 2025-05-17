import type { Currency } from "../constants";

const cache: Partial<Record<Currency, number>> = { EUR: 1 };

export async function loadRates() {
  if (cache.USD) return;               // already have rates
  const data = await fetch("/api/rates").then((r) => r.json());
  Object.assign(cache, data as Record<Currency, number>);
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
