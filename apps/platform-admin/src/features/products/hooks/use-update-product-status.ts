"use client";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  productService,
} from "../services";

import {
  UpdateProductStatusValues,
} from "../schemas";

interface UpdateProductStatusVariables {
  id: string;

  payload: UpdateProductStatusValues;
}

export function useUpdateProductStatusMutation() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateProductStatusVariables) =>
      productService.updateStatus(
        id,
        payload,
      ),
  });
}