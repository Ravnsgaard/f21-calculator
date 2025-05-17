import type { Currency } from "../constants";

/**
 * Browser-side FX helper.
 * 1. Cache starts with { EUR: 1 }.
 * 2. First time user selects a non-EUR currency, we fetch live rates from
 *    https://api.exchangerate.host (CORS-enabled) and merge into the cache.
 * 3. Caller can await `ensureRates()` then call `rate(code)` or `fmt(value, code)`.
 */

const cache: Partial<Record<Currency, number>> = { EUR: 1 };
const symbols = "USD,DKK,GBP,SEK,NOK";
const url = `https://api.exchangerate.host/latest?base=EUR&symbols=${symbols}`;

let fetching = false;

export async function ensureRates() {
  if (cache.USD || fetching) return;          // already loaded or in-flight
  fetching = true;
  try {
    const { rates } = await fetch(url).then((r) => r.json());
    Object.assign(cache, rates as Record<Currency, number>);
  } catch {
    /* network error – keep EUR-only */
  } finally {
    fetching = false;
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
