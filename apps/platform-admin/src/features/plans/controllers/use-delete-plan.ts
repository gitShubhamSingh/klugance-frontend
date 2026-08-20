"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/core/api/get-error-message";

import { useDeletePlanMutation } from "../hooks";
import { PLAN_QUERY_KEYS } from "../hooks/use-plans";

interface Props {
  onSuccess?: () => void;
}

export function useDeletePlan({
  onSuccess,
}: Props = {}) {
  const queryClient = useQueryClient();

  const mutation =
    useDeletePlanMutation();

  async function deletePlan(
    id: string,
  ) {
    try {
      await mutation.mutateAsync(id);

      await queryClient.invalidateQueries({
        queryKey: PLAN_QUERY_KEYS.all,
      });

      toast.success(
        "Plan deleted successfully.",
      );

      onSuccess?.();
    } catch (error) {
      toast.error(
        getErrorMessage(error),
      );
    }
  }

  return {
    deletePlan,
    loading: mutation.isPending,
  };
}