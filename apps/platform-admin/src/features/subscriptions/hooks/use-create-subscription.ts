"use client";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  subscriptionService,
} from "../services";

export function useCreateSubscriptionMutation() {
  return useMutation({
    mutationFn:
      subscriptionService.create,
  });
}