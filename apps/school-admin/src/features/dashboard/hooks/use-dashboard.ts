"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services";

export const dashboardKeys = {
  all: ["school-dashboard"] as const,

  overview: () =>
    [...dashboardKeys.all, "overview"] as const,
};

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () =>
      dashboardService.getOverview(),
  });
}