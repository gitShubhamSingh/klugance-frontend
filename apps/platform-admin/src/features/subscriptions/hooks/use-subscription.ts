"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  subscriptionService,
} from "../services";

export function useSubscription(
  id?: string | null,
) {
  return useQuery({
    queryKey: [
      "subscription",
      id,
    ],

    queryFn: () =>
      subscriptionService.get(id!),

    enabled: Boolean(id),

    staleTime: 30_000,
  });
}