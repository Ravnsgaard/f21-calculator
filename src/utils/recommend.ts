import { plans, Plan } from "../data/plans";
import { COMMIT_MULTIPLIER, CommitTerm, OVERAGE } from "../constants";

export interface Spec {
  trafficTB: number;
  customDomains: number;
  computeBlocks: number;
  china: boolean;
  support24x7: boolean;
  commitTerm: CommitTerm;
}

/** Choose the cheapest plan that meets domain quota + checkboxes; allow overages for traffic & blocks. */
export function recommend(spec: Spec) {
  const meets = (p: Plan) =>
    p.features.customDomains >= spec.customDomains &&          // ← NEW domain constraint
    (!spec.china || p.features.china) &&
    (!spec.support24x7 || p.features.support24x7);

  const pool = plans.filter(meets);
  /* never empty because Dedicated covers all */

  const price = (p: Plan) => {
    const f = p.features;
    const overT = Math.max(0, spec.trafficTB - f.trafficTB) * OVERAGE.trafficPerTB;
    const overB =
      Math.ceil(Math.max(0, spec.computeBlocks - f.computeBlocks) / OVERAGE.computeBlocksPackSize) *
      OVERAGE.computeBlocksPack;
    const base = p.monthlyRate * COMMIT_MULTIPLIER[spec.commitTerm];
    return { base, overT, overB, total: base + overT + overB } as const;
  };

  return pool.reduce<{ plan: Plan; cost: ReturnType<typeof price> } | null>((best, p) => {
    const c = price(p);
    return !best || c.total < best.cost.total ? { plan: p, cost: c } : best;
  }, null)!;
}
