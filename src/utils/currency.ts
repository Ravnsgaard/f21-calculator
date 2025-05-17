import type { Currency } from "../constants";

/**
 * Browser-side FX helper.
 * • Cache = { EUR: 1 } at start.
 * • First time a non-EUR currency is selected, we fetch live rates
 *   from open.er-api.com (no key, CORS-enabled) and merge them.
 * • Subsequent conversions read directly from the cache.
 */

const cache: Partial<Record<Currency, number>> = { EUR: 1 };
const url = "https://open.er-api.com/v6/latest/EUR";
let fetching = false;

/** Fetch and cache rates (runs once per session). */
export async function loadRates() {
  if (cache.USD || fetching) return;
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
    /* network error → leave cache at 1 : 1 */
  } finally {
    fetching = false;
  }
}

/** Return conversion factor (EUR→currency). */
export function rate(c: Currency) {
  return cache[c] ?? 1;
}

/** Format EUR amount in the chosen currency. */
export function fmt(eur: number, currency: Currency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(eur * rate(currency));
}
