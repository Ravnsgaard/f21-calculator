"use client";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { Plan } from "../data/plans";
import { Currency } from "../constants";
import { fmt } from "../utils/currency";

interface Props {
  plan: Plan;
  costEUR: { overT: number; overB: number; total: number };
  currency: Currency;
  overTrafficTB: number;
  overBlocksPacks: number;
}

export function ResultCard({ plan, costEUR, currency, overTrafficTB, overBlocksPacks }: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Overage breakdown for {plan.name}
        </Typography>
        {overTrafficTB === 0 && overBlocksPacks === 0 ? (
          <Typography variant="body2">No overages — everything fits inside plan quotas.</Typography>
        ) : (
          <>
            {overTrafficTB > 0 && (
              <Typography variant="body2">{overTrafficTB} TB traffic × €400/TB</Typography>
            )}
            {overBlocksPacks > 0 && (
              <Typography variant="body2">{overBlocksPacks} packs of 10 compute blocks × €400</Typography>
            )}
          </>
        )}
        <Divider sx={{ my: 1 }} />
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={700}>Total / mo</Typography>
          <Typography fontWeight={700}>{fmt(costEUR.total, currency)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
