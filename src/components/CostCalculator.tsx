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
  const [, bump] = useState(0); // force re-render after FX fetch

  /* load FX rates once a non-EUR currency is selected */
  useEffect(() => {
    if (v.currency !== "EUR") loadRates().then(() => bump((n) => n + 1));
  }, [v.currency]);

  /* recommended plan & raw-EUR costs */
  const { plan: best, cost: eur } = recommend(v);

  /* EUR price map for every plan under current commit term */
  const priceMap = Object.fromEntries(
    plans.map((p) => [p.id, p.monthlyRate * COMMIT_MULTIPLIER[v.commitTerm]])
  ) as Record<string, number>;

  /* convert once for display */
  const fx = rate(v.currency);
  const costDisp = { overT: eur.overT * fx, overB: eur.overB * fx, total: eur.total * fx };

  /* units for overage wording */
  const overTrafficTB = Math.max(0, v.trafficTB - best.features.trafficTB);
  const overBlocksPacks = Math.ceil(
    Math.max(0, v.computeBlocks - best.features.computeBlocks) / 10
  );

  const half = { sx: { width: "50%" } };

  return (
    <Stack spacing={4}>
      {/* ─── Controls ───────────────────────────────────── */}
      <Grid container rowSpacing={3}>
        {/* Traffic slider */}
        <Grid item xs={12}>
          <Typography gutterBottom>
            Traffic (TB/mo) — <strong>{v.trafficTB}</strong>
          </Typography>
          <Controller
            name="trafficTB"
            control={control}
            render={({ field }) => (
              <Slider {...field} {...half} min={1} max={100} step={1} marks valueLabelDisplay="auto" />
            )}
          />
        </Grid>

        {/* Domains slider */}
        <Grid item xs={12}>
          <Typography gutterBottom>
            Custom Domains — <strong>{v.customDomains}</strong>
          </Typography>
          <Controller
            name="customDomains"
            control={control}
            render={({ field }) => (
              <Slider {...field} {...half} min={1} max={200} step={1} marks valueLabelDisplay="auto" />
            )}
          />
        </Grid>

        {/* Compute-blocks slider */}
        <Grid item xs={12}>
          <Typography gutterBottom>
            Compute Blocks — <strong>{v.computeBlocks}</strong>
          </Typography>
          <Controller
            name="computeBlocks"
            control={control}
            render={({ field }) => (
              <Slider {...field} {...half} min={1} max={100} step={1} marks valueLabelDisplay="auto" />
            )}
          />
        </Grid>

        {/* Check-boxes */}
        <Grid item xs={12}>
          <FormControlLabel
            control={<Controller name="china" control={control} render={({ field }) => <Switch {...field} checked={field.value} />} />}
            label="Deploy in mainland China"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Controller name="support24x7" control={control} render={({ field }) => <Switch {...field} checked={field.value} />} />}
            label="24/7 Support"
          />
        </Grid>

        {/* Commit-term toggle (re-ordered) */}
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

        {/* Currency dropdown */}
        <Grid item xs={12}>
          <Typography gutterBottom>Currency</Typography>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <TextField
                select
                {...field}
                sx={{ width: 200 }}
                onChange={(e) => field.onChange(e.target.value as Currency)}
              >
                {["EUR", "USD", "DKK", "GBP", "SEK", "NOK"].map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      {/* ─── Carousel of base SKUs ─────────────────────── */}
      <PlanCarousel plans={plans} selectedId={best.id} currency={v.currency} priceMap={priceMap} />

      {/* ─── Overage breakdown ─────────────────────────── */}
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
