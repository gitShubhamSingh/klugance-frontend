"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  subscriptionService,
} from "../services";

import type {
  SubscriptionStatus,
} from "../types";

interface Variables {
  id: string;
  status: SubscriptionStatus;
}

export function useUpdateSubscriptionStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: Variables) =>
      subscriptionService.updateStatus(
        id,
        status,
      ),

    onSuccess: async (
      subscription,
      variables,
    ) => {
      queryClient.setQueryData(
        [
          "subscription",
          variables.id,
        ],
        subscription,
      );

      await queryClient.invalidateQueries({
        queryKey: [
          "subscriptions",
        ],
      });
    },
  });
}