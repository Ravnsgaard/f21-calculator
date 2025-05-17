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

/* Default = Edge Global 30 quotas */
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
  const [, rerender] = useState(0);          // bump when FX arrives

  /* fetch FX once a non-EUR currency is chosen */
  useEffect(() => {
    if (v.currency !== "EUR") loadRates().then(() => rerender((n) => n + 1));
  }, [v.currency]);

  /* recommended plan & costs in pure EUR */
  const { plan: best, cost: eur } = recommend(v);

  /* monthly EUR for every plan under the chosen commit term */
  const priceMap = Object.fromEntries(
    plans.map((p) => [p.id, p.monthlyRate * COMMIT_MULTIPLIER[v.commitTerm]])
  ) as Record<string, number>;

  /* convert only once for display */
  const fx = rate(v.currency);
  const costDisp = { overT: eur.overT * fx, overB: eur.overB * fx, total: eur.total * fx };

  /* overage unit counts for wording */
  const overTrafficTB = Math.max(0, v.trafficTB - best.features.trafficTB);
  const overBlocksPacks = Math.ceil(
    Math.max(0, v.computeBlocks - best.features.computeBlocks) / 10
  );

  const half = { sx: { width: "50%" } };

  return (
    <Stack spacing={4}>
      {/* ───── Controls ───── */}
      <Grid container rowSpacing={3}>
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
                <ToggleButton value="monthly">Monthly</ToggleButton>
                <ToggleButton value="1yr">1 Year</ToggleButton>
                <ToggleButton value="3yr">3 Years</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Grid>

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

      {/* ───── Carousel of base SKUs ───── */}
      <PlanCarousel plans={plans} selectedId={best.id} currency={v.currency} priceMap={priceMap} />

      {/* ───── Overage + total breakdown ───── */}
      <ResultCard
        plan={best}
        costEUR={{ overT: eur.overT, overB: eur.overB, total: eur.total }}
        currency={v.currency}
        overTrafficTB={overTrafficTB}
        overBlocksPacks={overBlocksPacks}
      />
    </Stack>
  );
}
