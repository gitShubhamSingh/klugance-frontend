"use client";

import {
  UseFormReturn,
} from "react-hook-form";

import {
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  getErrorMessage,
} from "@/core/api/get-error-message";

import {
  useUpdatePlanMutation,
} from "../hooks";

import {
  PLAN_QUERY_KEYS,
} from "../hooks/use-plans";

import {
  UpdatePlanFormValues,
} from "../schemas";

interface Props {
  planId: string;

  form:
    UseFormReturn<UpdatePlanFormValues>;

  onSuccess?: () => void;
}

export function useUpdatePlan({
  planId,
  form,
  onSuccess,
}: Props) {
  const queryClient =
    useQueryClient();

  const mutation =
    useUpdatePlanMutation();

  const onSubmit =
    form.handleSubmit(
      async (values) => {
        try {
          await mutation.mutateAsync({
            id: planId,

            payload: {
              name: values.name,

              billing_cycle:
                values.billing_cycle,

              price: Number(
                values.price,
              ),

              currency:
                values.currency.toUpperCase(),
            },
          });

          await queryClient.invalidateQueries({
            queryKey:
              PLAN_QUERY_KEYS.all,
          });

          toast.success(
            "Plan updated successfully.",
          );

          onSuccess?.();
        } catch (error) {
          toast.error(
            getErrorMessage(error),
          );
        }
      },
    );

  return {
    onSubmit,
    loading: mutation.isPending,
  };
}