"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  subscriptionService,
} from "../services";

import type {
  UpdateSubscriptionFormValues,
} from "../schemas";

interface UpdateSubscriptionVariables {
  id: string;
  payload: UpdateSubscriptionFormValues;
}

export function useUpdateSubscription() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateSubscriptionVariables) =>
      subscriptionService.update(
        id,
        payload,
      ),

    onSuccess: async (
      subscription,
      variables,
    ) => {
      /*
       * Update detail cache immediately
       * with the PUT response.
       */
      queryClient.setQueryData(
        [
          "subscription",
          variables.id,
        ],
        subscription,
      );

      /*
       * Refresh subscription table.
       */
      await queryClient.invalidateQueries({
        queryKey: [
          "subscriptions",
        ],
      });
    },
  });
}