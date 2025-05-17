import type { Currency } from "../constants";

/**
 * Lightweight FX helper using open.er-api.com (free, no key).
 *   • Cache starts with { EUR: 1 }.
 *   • First time a non-EUR currency is selected we fetch live rates and merge.
 */

const cache: Partial<Record<Currency, number>> = { EUR: 1 };
const url = "https://open.er-api.com/v6/latest/EUR";
let fetching = false;

export async function ensureRates() {
  if (cache.USD || fetching) return;        // already have rates or request in-flight
  fetching = true;
  try {
    const { rates } = await fetch(url).then((r) => r.json());
    Object.assign(cache, {
      USD: rates.USD,
      DKK: rates.DKK,
      GBP: rates.GBP,
      SEK: rates.SEK,
      NOK: rates.NOK
    } as Record<Currency, number>);
  } catch {
    /* silent fail: keep cache = 1 for all */
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
