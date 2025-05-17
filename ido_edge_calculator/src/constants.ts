export const COMMIT_MULTIPLIER = { "3yr": 1.0, "1yr": 1.2, monthly: 1.44 } as const;
export const OVERAGE = { trafficPerTB: 400, computeBlocksPack: 400, computeBlocksPackSize: 10 } as const;
export type CommitTerm = keyof typeof COMMIT_MULTIPLIER;
export type Currency = "EUR" | "USD" | "DKK";
