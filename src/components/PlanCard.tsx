"use client";
import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import { Plan } from "../data/plans";
import { Currency } from "../constants";
import { fmt } from "../utils/currency";

const tint: Record<string, string> = {
  "basic-2": "#BE2B7B",
  "basic-5": "#8A3178",
  "edge-regional": "#613773",
  "edge-global-30": "#4E3A79",
  "edge-global-50": "#424180",
  "edge-global-100": "#2F4888",
  "edge-dedicated": "#005297"
};

interface Props {
  plan: Plan;
  priceEUR: number;        // **already includes commit multiplier**
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
        transition: "transform .3s, box-shadow .3s",
        transform: selected ? "scale(1.05)" : "scale(0.95)",
        boxShadow: selected ? 6 : 1,
        borderColor: selected ? "primary.main" : "divider"
      }}
    >
      <Box sx={{ height: 6, bgcolor: tint[plan.id] ?? "grey.200" }} />
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={600}>{plan.name}</Typography>
          <Typography variant="h6">{fmt(priceEUR, currency)}</Typography>
          <Typography variant="caption">Includes:</Typography>
          <Typography variant="caption">• {plan.features.customDomains} domains</Typography>
          <Typography variant="caption">• {plan.features.trafficTB} TB traffic</Typography>
          <Typography variant="caption">• {plan.features.computeBlocks} compute blocks</Typography>
          {plan.features.support24x7 && <Typography variant="caption">• 24/7 support</Typography>}
          {plan.features.china && <Typography variant="caption">• China mainland</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}
