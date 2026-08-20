"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  planService,
} from "../services";

export const PLAN_QUERY_KEYS = {
  all: ["plans"] as const,

  list: () =>
    [...PLAN_QUERY_KEYS.all, "list"] as const,

  byProduct: (productId: string) =>
    [
      ...PLAN_QUERY_KEYS.all,
      "product",
      productId,
    ] as const,

  detail: (planId: string) =>
    [
      ...PLAN_QUERY_KEYS.all,
      "detail",
      planId,
    ] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: PLAN_QUERY_KEYS.list(),
    queryFn: planService.list,
  });
}