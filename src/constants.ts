export const COMMIT_MULTIPLIER = { "3yr": 1.0, "1yr": 1.2, monthly: 1.44 } as const;

/** ✔️  needed by CostCalculator and recommend.ts */
export type CommitTerm = keyof typeof COMMIT_MULTIPLIER;

/** Currencies shown in the dropdown */
export type Currency = "EUR" | "USD" | "DKK" | "GBP" | "SEK" | "NOK";

export const OVERAGE = {
  trafficPerTB: 400,
  computeBlocksPack: 400,
  computeBlocksPackSize: 10
} as const;
