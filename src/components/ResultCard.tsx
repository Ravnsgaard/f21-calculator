"use client";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { Plan } from "../data/plans";
import { Currency } from "../constants";
import { fmt } from "../utils/currency";
import { PriceLine } from "./PriceLine";
export function ResultCard({ plan, cost, currency }: { plan: Plan; cost: { base: number; overT: number; overB: number; total: number }; currency: Currency; }) {
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{plan.name}</Typography>
        <Stack spacing={0.5}>
          <Typography variant="caption">Includes:</Typography>
          <Typography variant="caption">• {plan.features.trafficTB} TB traffic</Typography>
          <Typography variant="caption">• {plan.features.computeBlocks} compute blocks</Typography>
          <Typography variant="caption">• {plan.features.customDomains} custom domains</Typography>
        </Stack>
        <Divider sx={{ my: 1 }} />
        <PriceLine label="Base" valueEUR={cost.base} currency={currency} />
        {cost.overT > 0 && <PriceLine label="Traffic overage" valueEUR={cost.overT} currency={currency} />}
        {cost.overB > 0 && <PriceLine label="Compute-block overage" valueEUR={cost.overB} currency={currency} />}
        <Divider sx={{ my: 1 }} />
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={700}>Total / mo</Typography>
          <Typography fontWeight={700}>{fmt(cost.total, currency)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
