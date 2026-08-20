"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  subscriptionService,
} from "../services";

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],

    queryFn: () =>
      subscriptionService.list(),
  });
}