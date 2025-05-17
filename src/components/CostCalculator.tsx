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

/* 👉  Default quotas = Edge Global 30  */
const defaults: FormValues = {
  trafficTB: 3,
  customDomains: 30,
  computeBlocks: 10,
  china: true,            // ← matches plan
  support24x7: false,
  commitTerm: "3yr",
  currency: "EUR"
};

export default function CostCalculator() {
  /* …hooks unchanged… */

  const wide = { sx: { width: "50%" } };   // ← reuse for sliders & selects

  return (
    <Stack gap={4}>
      <Grid container rowSpacing={3}>
        {/* — Sliders each row, 50 % width — */}
        <Grid item xs={12}>
          <Typography gutterBottom>
            Traffic (TB/mo) — <strong>{v.trafficTB}</strong>
          </Typography>
          <Controller
            name="trafficTB"
            control={control}
            render={({ field }) => (
              <Slider {...field} {...wide} min={1} max={100} step={1} marks valueLabelDisplay="auto" />
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
              <Slider {...field} {...wide} min={1} max={200} step={1} marks valueLabelDisplay="auto" />
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
              <Slider {...field} {...wide} min={1} max={100} step={1} marks valueLabelDisplay="auto" />
            )}
          />
        </Grid>

        {/* — Checkboxes each row, no width tweak needed — */}
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

        {/* — Commit term toggle — */}
        <Grid item xs={12}>
          <ToggleButtonGroup exclusive {...wide} {...control.register("commitTerm")} value={v.commitTerm} onChange={(_, val) => control.setValue("commitTerm", val)}>
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="1yr">1 Year</ToggleButton>
            <ToggleButton value="3yr">3 Years</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {/* — Currency dropdown — */}
        <Grid item xs={12}>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <TextField select {...wide} {...field} onChange={(e) => field.onChange(e.target.value as Currency)}>
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

      <ResultCard plan={plan} cost={cost} currency={v.currency} />
    </Stack>
  );
}
