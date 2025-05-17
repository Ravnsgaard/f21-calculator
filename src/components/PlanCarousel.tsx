"use client";
import { Box, IconButton, Stack } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useEffect, useRef } from "react";
import { Plan } from "../data/plans";
import { PlanCard } from "./PlanCard";
import { Currency } from "../constants";
import { fmt } from "../utils/currency";

interface Props {
  plans: Plan[];
  selectedId: string;
  currency: Currency;
}

export function PlanCarousel({ plans, selectedId, currency }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  /* scroll selected card into view whenever selectedId changes */
  useEffect(() => {
    const idx = plans.findIndex((p) => p.id === selectedId);
    const node = ref.current?.children[idx] as HTMLElement | undefined;
    node?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedId, plans]);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    const delta = dir === "left" ? -240 : 240;
    ref.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton onClick={() => scroll("left")}>
        <ChevronLeft />
      </IconButton>

      <Box
        ref={ref}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollPadding: "0 50%",
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        {plans.map((p) => (
          <PlanCard
            key={p.id}
            plan={p}
            priceEUR={p.monthlyRate}
            currency={currency}
            selected={p.id === selectedId}
          />
        ))}
      </Box>

      <IconButton onClick={() => scroll("right")}>
        <ChevronRight />
      </IconButton>
    </Stack>
  );
}
