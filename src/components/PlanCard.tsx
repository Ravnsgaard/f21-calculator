"use client";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Plan } from "../data/plans";
import { Currency } from "../constants";
import { fmt } from "../utils/currency";

interface Props {
  plan: Plan;
  priceEUR: number;   // base EUR monthly price (3-yr commit)
  currency: Currency;
  selected: boolean;
}

export function PlanCard({ plan, priceEUR, currency, selected }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: 240,
        flexShrink: 0,
        scrollSnapAlign: "center",
        transition: "transform 0.3s, box-shadow 0.3s",
        transform: selected ? "scale(1.05)" : "scale(0.95)",
        boxShadow: selected ? 6 : 1,
        borderColor: selected ? "primary.main" : "divider"
      }}
    >
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={600}>
            {plan.name}
          </Typography>
          <Typography variant="h6">{fmt(priceEUR, currency)}</Typography>

          <Typography variant="caption">Includes:</Typography>
          <Typography variant="caption">
            • {plan.features.customDomains} domains
          </Typography>
          <Typography variant="caption">
            • {plan.features.trafficTB} TB traffic
          </Typography>
          <Typography variant="caption">
            • {plan.features.computeBlocks} compute blocks
          </Typography>
          {plan.features.support24x7 && (
            <Typography variant="caption">• 24/7 support</Typography>
          )}
          {plan.features.china && (
            <Typography variant="caption">• China mainland</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
