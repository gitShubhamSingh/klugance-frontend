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
  useCreatePlanMutation,
} from "../hooks";

import {
  PLAN_QUERY_KEYS,
} from "../hooks/use-plans";

import {
  CreatePlanFormValues,
} from "../schemas";

import {
  CreatePlanRequest,
} from "../types";

interface Props {
  productId: string;

  form: UseFormReturn<CreatePlanFormValues>;

  onSuccess?: () => void;
}

export function useCreatePlan({
  productId,
  form,
  onSuccess,
}: Props) {
  const queryClient =
    useQueryClient();

  const mutation =
    useCreatePlanMutation();

  const onSubmit =
    form.handleSubmit(
      async (values) => {
        try {
          const price =
            Number(values.price);

          if (!Number.isFinite(price)) {
            toast.error(
              "Please enter a valid price.",
            );

            return;
          }

          const payload:
            CreatePlanRequest = {
              product_id:
                productId,

              code:
                values.code,

              name:
                values.name,

              billing_cycle:
                values.billing_cycle,

              price,

              currency:
                values.currency.toUpperCase(),
            };

          await mutation.mutateAsync(
            payload,
          );

          await queryClient.invalidateQueries({
            queryKey:
              PLAN_QUERY_KEYS.all,
          });

          toast.success(
            "Plan created successfully.",
          );

          form.reset();

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
    loading:
      mutation.isPending,
  };
}