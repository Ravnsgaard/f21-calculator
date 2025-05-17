import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Returns EUR-base FX rates for USD, DKK, GBP, SEK, NOK.
 * Caches at the edge (Vercel) for 1 hour.
 */
export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const symbols = "USD,DKK,GBP,SEK,NOK";
  const r = await fetch(`https://api.exchangerate.host/latest?base=EUR&symbols=${symbols}`);
  const data = await r.json();
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.status(200).json(data.rates);
}
