"use client";

import {
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  getErrorMessage,
} from "@/core/api/get-error-message";

import {
  useUpdateProductStatusMutation,
} from "../hooks";

import {
  PRODUCT_QUERY_KEYS,
} from "../hooks/use-products";

import {
  ProductStatus,
} from "../types";

export function useUpdateProductStatus() {
  const queryClient =
    useQueryClient();

  const mutation =
    useUpdateProductStatusMutation();

  async function updateStatus(
    productId: string,
    status: ProductStatus,
  ) {
    try {
      const product =
        await mutation.mutateAsync({
          id: productId,

          payload: {
            status,
          },
        });

      /*
       * Keep currently cached detail fresh.
       */
      queryClient.setQueryData(
        PRODUCT_QUERY_KEYS.detail(
          productId,
        ),
        product,
      );

      /*
       * Refresh product list.
       */
      await queryClient.invalidateQueries({
        queryKey:
          PRODUCT_QUERY_KEYS.all,
      });

      toast.success(
        status === "ACTIVE"
          ? "Product activated successfully."
          : "Product deactivated successfully.",
      );

      return product;
    } catch (error) {
      toast.error(
        getErrorMessage(error),
      );

      throw error;
    }
  }

  return {
    updateStatus,
    loading: mutation.isPending,
  };
}