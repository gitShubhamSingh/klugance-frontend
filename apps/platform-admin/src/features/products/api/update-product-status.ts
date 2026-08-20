import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import { Product } from "../types";

import {
  UpdateProductStatusValues,
} from "../schemas";

interface UpdateProductStatusResponse {
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

export async function updateProductStatus(
  id: string,
  payload: UpdateProductStatusValues,
): Promise<Product> {
  const { data } =
    await apiClient.patch<UpdateProductStatusResponse>(
      API_ENDPOINTS.PRODUCTS.STATUS(id),
      payload,
    );

  return data.data;
}