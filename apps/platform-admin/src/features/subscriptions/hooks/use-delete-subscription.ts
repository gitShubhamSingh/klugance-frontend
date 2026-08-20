"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  subscriptionService,
} from "../services";

export function useDeleteSubscription() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      subscriptionId: string,
    ) =>
      subscriptionService.delete(
        subscriptionId,
      ),

    onSuccess: async (
      _,
      subscriptionId,
    ) => {
      /*
       * Remove the deleted subscription
       * detail from cache.
       */
      queryClient.removeQueries({
        queryKey: [
          "subscription",
          subscriptionId,
        ],
      });

      /*
       * Refetch subscription list.
       */
      await queryClient.invalidateQueries({
        queryKey: [
          "subscriptions",
        ],
      });
    },
  });
}