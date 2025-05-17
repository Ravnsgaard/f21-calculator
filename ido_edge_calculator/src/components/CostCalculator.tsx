"use client";
import { Grid, Slider, Typography, FormControlLabel, Switch, ToggleButtonGroup, ToggleButton, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { CommitTerm, Currency } from "../constants";
import { recommend } from "../utils/recommend";
import { ensureRates } from "../utils/currency";
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
  trafficTB: 1,
  customDomains: 1,
  computeBlocks: 1,
  china: false,
  support24x7: false,
  commitTerm: "3yr",
  currency: "EUR"
};

export function CostCalculator() {
  const { control, watch } = useForm<FormValues>({ defaultValues: defaults });
  const values = watch();

  const [ratesReady, setRatesReady] = useState(false);
  useEffect(() => {
    if (!ratesReady && values.currency !== "EUR") {
      ensureRates().then(() => setRatesReady(true));
    }
  }, [values.currency, ratesReady]);

  const { plan, cost } = recommend(values);

  return (
    <Stack gap={4}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography gutterBottom>Traffic (TB/mo)</Typography>
          <Controller name="trafficTB" control={control} render={({ field }) => <Slider {...field} min={1} max={100} step={1} marks valueLabelDisplay="auto" />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography gutterBottom>Custom Domains</Typography>
          <Controller name="customDomains" control={control} render={({ field }) => <Slider {...field} min={1} max={200} step={1} marks valueLabelDisplay="auto" />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography gutterBottom>Compute Blocks</Typography>
          <Controller name="computeBlocks" control={control} render={({ field }) => <Slider {...field} min={1} max={100} step={1} marks valueLabelDisplay="auto" />} />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControlLabel control={<Controller name="china" control={control} render={({ field }) => <Switch {...field} checked={field.value} />} />} label="Deploy in mainland China" />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControlLabel control={<Controller name="support24x7" control={control} render={({ field }) => <Switch {...field} checked={field.value} />} />} label="24/7 Support" />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography gutterBottom>Commit Term</Typography>
          <Controller
            name="commitTerm"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup exclusive fullWidth {...field} onChange={(_, v) => v && field.onChange(v)}>
                <ToggleButton value="monthly">Monthly</ToggleButton>
                <ToggleButton value="1yr">1 Year</ToggleButton>
                <ToggleButton value="3yr">3 Years</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography gutterBottom>Currency</Typography>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup exclusive fullWidth {...field} onChange={(_, v) => v && field.onChange(v)}>
                <ToggleButton value="EUR">EUR</ToggleButton>
                <ToggleButton value="USD">USD</ToggleButton>
                <ToggleButton value="DKK">DKK</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Grid>
      </Grid>
      <ResultCard plan={plan} cost={cost} currency={values.currency} />
    </Stack>
  );
}
