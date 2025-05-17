export interface Plan {
  id: string;
  name: string;
  monthlyRate: number;
  features: { customDomains: number; trafficTB: number; computeBlocks: number; china: boolean; support24x7: boolean; };
}
export const plans: Plan[] = [
  { id: "basic-2", name: "Basic 2", monthlyRate: 450, features: { customDomains: 2, trafficTB: 0.5, computeBlocks: 1, china: false, support24x7: false } },
  { id: "basic-5", name: "Basic 5", monthlyRate: 675, features: { customDomains: 5, trafficTB: 0.5, computeBlocks: 3, china: false, support24x7: false } },
  { id: "edge-regional", name: "IDO Edge Regional", monthlyRate: 1495, features: { customDomains: 20, trafficTB: 3, computeBlocks: 5, china: true, support24x7: false } },
  { id: "edge-global-30", name: "IDO Edge Global 30", monthlyRate: 1995, features: { customDomains: 30, trafficTB: 3, computeBlocks: 10, china: true, support24x7: false } },
  { id: "edge-global-50", name: "IDO Edge Global 50", monthlyRate: 2995, features: { customDomains: 50, trafficTB: 10, computeBlocks: 20, china: true, support24x7: true } },
  { id: "edge-global-100", name: "IDO Edge Global 100", monthlyRate: 4995, features: { customDomains: 100, trafficTB: 20, computeBlocks: 50, china: true, support24x7: true } },
  { id: "edge-dedicated", name: "IDO Edge Dedicated", monthlyRate: 12495, features: { customDomains: 200, trafficTB: 20, computeBlocks: 100, china: true, support24x7: true } }
];
