"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getErrorMessage,
} from "@/core/api/get-error-message";

import {
  useUpdatePlanStatusMutation,
} from "../hooks";

import {
  PLAN_QUERY_KEYS,
} from "../hooks/use-plans";

import { Plan } from "../types";

export function useUpdatePlanStatus() {
  const queryClient =
    useQueryClient();

  const mutation =
    useUpdatePlanStatusMutation();

  async function updateStatus(
    plan: Plan,
  ) {
    const nextStatus:
      Plan["status"] =
      plan.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    try {
      await mutation.mutateAsync({
        id: plan.id,

        payload: {
          status: nextStatus,
        },
      });

      await queryClient.invalidateQueries({
        queryKey:
          PLAN_QUERY_KEYS.all,
      });

      toast.success(
        nextStatus === "ACTIVE"
          ? "Plan activated successfully."
          : "Plan deactivated successfully.",
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error),
      );
    }
  }

  return {
    updateStatus,
    loading: mutation.isPending,

    updatingPlanId:
      mutation.variables?.id,
  };
}