import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ensure this route runs on every request (with caching below)

/** GET /api/rates → { USD: 1.09, DKK: 7.45, GBP: 0.85, SEK: 11.3, NOK: 11.6 } */
export async function GET() {
  const symbols = "USD,DKK,GBP,SEK,NOK";
  const r = await fetch(`https://api.exchangerate.host/latest?base=EUR&symbols=${symbols}`);
  const { rates } = await r.json();
  return NextResponse.json(rates, {
    headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" }
  });
}
