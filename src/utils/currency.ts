import type { Currency } from "../constants";

const cache: Partial<Record<Currency, number>> = { EUR: 1 };
const symbols = "USD,DKK,GBP,SEK,NOK";
const url = `https://api.exchangerate.host/latest?base=EUR&symbols=${symbols}`;

/** Fetch and cache FX rates the first time a non-EUR currency is selected. */
export async function loadRates() {
  if (cache.USD) return;                     // already cached
  try {
    const { rates } = await fetch(url).then((r) => r.json());
    Object.assign(cache, rates as Record<Currency, number>);
  } catch {
    /* network error → keep cache as-is (all conversions = 1:1) */
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
