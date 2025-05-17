"use client";
import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import { Plan } from "../data/plans";
import { Currency } from "../constants";
import { fmt } from "../utils/currency";

const tint: Record<string, string> = {
  "basic-2": "#ECEFF1",
  "basic-5": "#CFD8DC",
  "edge-regional": "#B3E5FC",
  "edge-global-30": "#C8E6C9",
  "edge-global-50": "#A5D6A7",
  "edge-global-100": "#81C784",
  "edge-dedicated": "#80DEEA"
};

interface Props {
  plan: Plan;
  priceEUR: number;
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
      {/* colored header */}
      <Box sx={{ height: 6, bgcolor: tint[plan.id] ?? "grey.200" }} />

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
