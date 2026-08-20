"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/core/api/get-error-message";

import { useDeleteProductMutation } from "../hooks";
import { PRODUCT_QUERY_KEYS } from "../hooks/use-products";

interface Props {
  productId: string;
  onSuccess?: () => void;
}

export function useDeleteProduct({
  productId,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();

  const mutation =
    useDeleteProductMutation();

  async function onDelete() {
    try {
      await mutation.mutateAsync(
        productId,
      );

      /*
       * Remove stale detail cache for deleted product.
       */
      queryClient.removeQueries({
        queryKey:
          PRODUCT_QUERY_KEYS.detail(
            productId,
          ),
      });

      /*
       * Refetch product list.
       */
      await queryClient.invalidateQueries({
        queryKey:
          PRODUCT_QUERY_KEYS.all,
      });

      toast.success(
        "Product deleted successfully.",
      );

      onSuccess?.();
    } catch (error) {
      toast.error(
        getErrorMessage(error),
      );
    }
  }

  return {
    onDelete,
    loading: mutation.isPending,
  };
}