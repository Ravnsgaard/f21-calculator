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
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Cost breakdown for {plan.name}
        </Typography>

        {/* overages only */}
        {cost.overT === 0 && cost.overB === 0 ? (
          <Typography variant="body2" gutterBottom>
            No overages — everything fits inside the plan quotas.
          </Typography>
        ) : (
          <>
            {cost.overT > 0 && (
              <PriceLine label="Traffic overage" valueEUR={cost.overT} currency={currency} />
            )}
            {cost.overB > 0 && (
              <PriceLine label="Compute-block overage" valueEUR={cost.overB} currency={currency} />
            )}
          </>
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
