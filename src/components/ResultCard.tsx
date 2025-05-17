"use client";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { Plan } from "../data/plans";
import { Currency } from "../constants";
import { fmt } from "../utils/currency";
import { PriceLine } from "./PriceLine";

export function ResultCard({
  plan,
  cost,
  currency
}: {
  plan: Plan;
  cost: { base: number; overT: number; overB: number; total: number };
  currency: Currency;
}) {
  const f = plan.features;
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {plan.name}
        </Typography>

        <Stack spacing={0.5} mb={1}>
          <Typography variant="caption">Quotas / Features:</Typography>
          <Typography variant="caption">• {f.customDomains} custom domains</Typography>
          <Typography variant="caption">• {f.trafficTB} TB traffic / mo</Typography>
          <Typography variant="caption">• {f.computeBlocks} compute blocks</Typography>
          {f.serviceHours !== undefined && (
            <Typography variant="caption">• {f.serviceHours} service hours</Typography>
          )}
          <Typography variant="caption">• Logs retained {f.logRetentionDays} days</Typography>
          <Typography variant="caption">• China mainland: {f.china ? "✔️" : "—"}</Typography>
          <Typography variant="caption">• 24/7 Support: {f.support24x7 ? "✔️" : "—"}</Typography>
          {f.radrSlaHours !== undefined && (
            <Typography variant="caption">• RADR SLA: {f.radrSlaHours} h</Typography>
          )}
        </Stack>

        <Divider sx={{ my: 1 }} />

        <PriceLine label="Base" valueEUR={cost.base} currency={currency} />
        {cost.overT > 0 && <PriceLine label="Traffic overage" valueEUR={cost.overT} currency={currency} />}
        {cost.overB > 0 && (
          <PriceLine label="Compute-block overage" valueEUR={cost.overB} currency={currency} />
        )}

        <Divider sx={{ my: 1 }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={700}>Total / mo</Typography>
          <Typography fontWeight={700}>{fmt(cost.total, currency)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
