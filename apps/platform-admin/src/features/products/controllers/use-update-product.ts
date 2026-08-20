"use client";

import { UseFormReturn } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getErrorMessage,
} from "@/core/api/get-error-message";

import {
  useUpdateProductMutation,
} from "../hooks";

import {
  PRODUCT_QUERY_KEYS,
} from "../hooks/use-products";

import {
  UpdateProductFormValues,
} from "../schemas";

interface Props {
  productId: string;

  form: UseFormReturn<UpdateProductFormValues>;

  onSuccess?: () => void;
}

export function useUpdateProduct({
  productId,
  form,
  onSuccess,
}: Props) {
  const queryClient =
    useQueryClient();

  const mutation =
    useUpdateProductMutation();

  const onSubmit =
    form.handleSubmit(
      async (values) => {
        try {
          const product =
            await mutation.mutateAsync({
              id: productId,
              payload: values,
            });

          /*
           * Update exact detail cache immediately.
           */
          queryClient.setQueryData(
            PRODUCT_QUERY_KEYS.detail(
              productId,
            ),
            product,
          );

          /*
           * Refetch product lists.
           */
          await queryClient.invalidateQueries({
            queryKey:
              PRODUCT_QUERY_KEYS.all,
          });

          toast.success(
            "Product updated successfully.",
          );

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