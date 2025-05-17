import type { Currency } from "../constants";

const cache: Partial<Record<Currency, number>> = { EUR: 1 };

/** Load EUR-base rates once per browser session (or revalidate in 1 h). */
export async function ensureRates() {
  if (cache.USD && cache.DKK && cache.GBP && cache.SEK && cache.NOK) return cache;

  const symbols = "USD,DKK,GBP,SEK,NOK";
  const res = await fetch(`https://api.exchangerate.host/latest?base=EUR&symbols=${symbols}`, {
    next: { revalidate: 3600 }      // tell Next.js to re-use the response for one hour
  });
  const { rates } = (await res.json()) as { rates: Record<string, number> };

  cache.USD = rates.USD;
  cache.DKK = rates.DKK;
  cache.GBP = rates.GBP;
  cache.SEK = rates.SEK;
  cache.NOK = rates.NOK;
  return cache;
}

/** Format a price stored in EUR into the chosen currency. */
export function fmt(eur: number, currency: Currency) {
  const rate = cache[currency] ?? 1;           // ‘1’ for EUR until rates load
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(eur * rate);
}
