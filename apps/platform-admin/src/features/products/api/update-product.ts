import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import { Product } from "../types";
import { UpdateProductFormValues } from "../schemas";

interface UpdateProductResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: Product;
  errors: unknown[];
  meta: unknown;
  timestamp: string;
  trace_id: string | null;
  encrypted: boolean;
  algorithm: string | null;
  version: string;
}

export async function updateProduct(
  id: string,
  payload: UpdateProductFormValues,
): Promise<Product> {
  const { data } =
    await apiClient.put<UpdateProductResponse>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      payload,
    );

  return data.data;
}