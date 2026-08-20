"use client";

import { useMutation } from "@tanstack/react-query";

import { productService } from "../services";
import { UpdateProductFormValues } from "../schemas";

interface UpdateProductVariables {
  id: string;
  payload: UpdateProductFormValues;
}

export function useUpdateProductMutation() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateProductVariables) =>
      productService.update(
        id,
        payload,
      ),
  });
}