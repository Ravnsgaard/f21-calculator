import type { Currency } from "../constants";

const cache: Partial<Record<Currency, number>> = { EUR: 1 };

export async function ensureRates() {
  if (cache.USD) return cache; // all rates already cached

  const symbols = "USD,DKK,GBP,SEK,NOK";
  const res = await fetch(`https://api.exchangerate.host/latest?base=EUR&symbols=${symbols}`);
  const { rates } = (await res.json()) as { rates: Record<string, number> };

  Object.assign(cache, {
    USD: rates.USD,
    DKK: rates.DKK,
    GBP: rates.GBP,
    SEK: rates.SEK,
    NOK: rates.NOK
  });
  return cache;
}

export function fmt(eur: number, currency: Currency) {
  const rate = cache[currency] ?? 1;
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    eur * rate
  );
}
