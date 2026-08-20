"use client";

import { UseFormReturn } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getErrorMessage,
} from "@/core/api/get-error-message";

import {
  useCreateProductMutation,
} from "../hooks";

import {
  PRODUCT_QUERY_KEYS,
} from "../hooks/use-products";

import {
  CreateProductFormValues,
} from "../schemas";

interface Props {
  form: UseFormReturn<CreateProductFormValues>;
  onSuccess?: () => void;
}

export function useCreateProduct({
  form,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();

  const mutation =
    useCreateProductMutation();

  const onSubmit = form.handleSubmit(
    async (values) => {
      try {
        const product =
          await mutation.mutateAsync(
            values,
          );

        await queryClient.invalidateQueries({
          queryKey:
            PRODUCT_QUERY_KEYS.all,
        });

        toast.success(
          "Product created successfully.",
        );

        form.reset();

        onSuccess?.();

        return product;
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