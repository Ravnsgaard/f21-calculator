import { plans, Plan } from "../data/plans";
import { COMMIT_MULTIPLIER, CommitTerm, OVERAGE } from "../constants";
export interface Spec { trafficTB: number; customDomains: number; computeBlocks: number; china: boolean; support24x7: boolean; commitTerm: CommitTerm; }
export function recommend(spec: Spec) {
  const eligible = plans.filter(p => (!spec.china || p.features.china) && (!spec.support24x7 || p.features.support24x7));
  const pool = eligible.length ? eligible : plans;
  const cost = (p: Plan) => {
    const f = p.features;
    const overT = Math.max(0, spec.trafficTB - f.trafficTB) * OVERAGE.trafficPerTB;
    const overB = Math.ceil(Math.max(0, spec.computeBlocks - f.computeBlocks) / OVERAGE.computeBlocksPackSize) * OVERAGE.computeBlocksPack;
    const base = p.monthlyRate * COMMIT_MULTIPLIER[spec.commitTerm];
    return { base, overT, overB, total: base + overT + overB } as const;
  };
  return pool.reduce<{ plan: Plan; cost: ReturnType<typeof cost> } | null>((best, p) => {
    const c = cost(p); return !best || c.total < best.cost.total ? { plan: p, cost: c } : best;
  }, null)!;
}
