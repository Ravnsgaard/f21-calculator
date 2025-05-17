"use client";
import { Stack, Typography } from "@mui/material";
import { Currency } from "../constants";
import { fmt } from "../utils/currency";
export function PriceLine({ label, valueEUR, currency }: { label: string; valueEUR: number; currency: Currency }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2" fontWeight={600}>{fmt(valueEUR, currency)}</Typography>
    </Stack>
  );
}
