"use client";
import {
  Grid,
  Slider,
  Typography,
  FormControlLabel,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  TextField,
  MenuItem
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { COMMIT_MULTIPLIER, CommitTerm, Currency } from "../constants";
import { recommend } from "../utils/recommend";
import { loadRates, rate } from "../utils/currency";
import { plans } from "../data/plans";
import { PlanCarousel } from "./PlanCarousel";
import { ResultCard } from "./ResultCard";

interface FormValues {
  trafficTB: number;
  customDomains: number;
  computeBlocks: number;
  china: boolean;
  support24x7: boolean;
  commitTerm: CommitTerm;
  currency: Currency;
}

const defaults: FormValues = {
  trafficTB: 3,
  customDomains: 30,
  computeBlocks: 10,
  china: true,
  support24x7: false,
  commitTerm: "3yr",
  currency: "EUR"
};

export default function CostCalculator() {
  const { control, watch } = useForm<FormValues>({ defaultValues: defaults });
  const v = watch();
  const [, bump] = useState(0);

  useEffect(() => {
    if (v.currency !== "EUR") loadRates().then(() => bump((n) => n + 1));
  }, [v.currency]);

  const { plan: best, cost: eur } = recommend(v);
  const priceMap = Object.fromEntries(
    plans.map((p) => [p.id, p.monthlyRate * COMMIT_MULTIPLIER[v.commitTerm]])
  ) as Record<string, number>;

  const fx = rate(v.currency);
  const costDisp = { overT: eur.overT * fx, overB: eur.overB * fx, total: eur.total * fx };

  const overTrafficTB = Math.max(0, v.trafficTB - best.features.trafficTB);
  const overBlocksPacks = Math.ceil(
    Math.max(0, v.computeBlocks - best.features.computeBlocks) / 10
  );

  const half = { sx: { width: "50%" } };

  return (
    <Stack spacing={4}>
      {/* ── Controls ─────────────────────────────────────── */}
      <Grid container rowSpacing={3}>
        {/* sliders & checkboxes unchanged … */}
        {/* Commit term toggle (re-ordered & relabeled) */}
        <Grid item xs={12}>
          <Typography gutterBottom>Commit Term</Typography>
          <Controller
            name="commitTerm"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                exclusive
                {...half}
                {...field}
                onChange={(_, v) => v && field.onChange(v)}
              >
                <ToggleButton value="3yr">3 yr • annual prepay</ToggleButton>
                <ToggleButton value="1yr">1 yr • annual prepay</ToggleButton>
                <ToggleButton value="monthly">Monthly</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Grid>

        {/* Currency dropdown unchanged… */}
      </Grid>

      {/* ── Carousel & overage card ──────────────────────── */}
      <PlanCarousel
        plans={plans}
        selectedId={best.id}
        currency={v.currency}
        priceMap={priceMap}
      />
      <ResultCard
        plan={best}
        costEUR={eur}
        currency={v.currency}
        overTrafficTB={overTrafficTB}
        overBlocksPacks={overBlocksPacks}
      />
    </Stack>
  );
}
