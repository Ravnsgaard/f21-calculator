import type { Currency } from "../constants";

const cache: Partial<Record<Currency, number>> = { EUR: 1 };

export async function loadRates(): Promise<void> {
  if (cache.USD) return;                         // already fetched
  const r = await fetch("/api/rates").then((res) => res.json());
  Object.assign(cache, r as Record<Currency, number>);
}

export function getRate(c: Currency) {
  return cache[c] ?? 1;
}

export function fmt(eur: number, currency: Currency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(eur * getRate(currency));
}
