"use client";
import {
  Grid, Slider, Typography, FormControlLabel, Switch, ToggleButtonGroup,
  ToggleButton, Stack, TextField, MenuItem
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { COMMIT_MULTIPLIER, CommitTerm, Currency } from "../constants";
import { recommend } from "../utils/recommend";
import { loadRates, rate } from "../utils/currency";
import { plans } from "../data/plans";
import { PlanCarousel } from "./PlanCarousel";
import { ResultCard } from "./ResultCard";

interface FormValues { trafficTB:number; customDomains:number; computeBlocks:number; china:boolean; support24x7:boolean; commitTerm:CommitTerm; currency:Currency }

const defaults: FormValues = { trafficTB:3, customDomains:30, computeBlocks:10, china:true, support24x7:false, commitTerm:"3yr", currency:"EUR" };

export default function CostCalculator() {
  const { control, watch } = useForm<FormValues>({ defaultValues: defaults });
  const v = watch();
  const [, bump] = useState(0);

  useEffect(() => { if (v.currency !== "EUR") loadRates().then(() => bump(n=>n+1)); }, [v.currency]);

  const { plan: best, cost: eur } = recommend(v);

  // map plan id to monthly EUR with commit multiplier
  const multiplier = COMMIT_MULTIPLIER[v.commitTerm];
  const priceMap: Record<string, number> = Object.fromEntries(plans.map(p=>[p.id, p.monthlyRate*multiplier]));

  const fx = rate(v.currency);
  const costEUR = eur; // still in EUR
  const costDisplay = { overT: costEUR.overT*fx, overB: costEUR.overB*fx, total: costEUR.total*fx };

  const overTrafficTB = Math.max(0, v.trafficTB - best.features.trafficTB);
  const overBlocksPacks = Math.ceil(Math.max(0, v.computeBlocks - best.features.computeBlocks)/10);

  const half = { sx:{ width:"50%" } };

  return (
    <Stack spacing={4}>
      {/* controls (omitted for brevity in canvas) */}
    </Stack>
  );
}
