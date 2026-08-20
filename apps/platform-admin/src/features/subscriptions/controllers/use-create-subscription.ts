"use client";

import type {
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
  useCreateSubscriptionMutation,
} from "../hooks";

import type {
  CreateSubscriptionFormValues,
} from "../schemas";

interface Props {
  form: UseFormReturn<CreateSubscriptionFormValues>;
  onSuccess?: () => void;
}

export function useCreateSubscription({
  form,
  onSuccess,
}: Props) {
  const queryClient =
    useQueryClient();

  const mutation =
    useCreateSubscriptionMutation();

  const onSubmit =
    form.handleSubmit(
      async (values) => {
        try {
          await mutation.mutateAsync(
            values,
          );

          await queryClient.invalidateQueries({
            queryKey: [
              "subscriptions",
            ],
          });

          toast.success(
            "Subscription created successfully.",
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
    loading: mutation.isPending,
  };
}