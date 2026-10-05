"use client";

import { useQuery } from "@tanstack/react-query";

import { getPeriods } from "../api";

export const periodKeys = {
  all: ["periods"] as const,
  list: () => [...periodKeys.all, "list"] as const,
};

export function usePeriods() {
  return useQuery({
    queryKey: periodKeys.list(),
    queryFn: getPeriods,
  });
}