import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type { Subscription } from "../types";

export async function getSubscriptions(): Promise<
  Subscription[]
> {
  const { data } = await apiClient.get(
    API_ENDPOINTS.SUBSCRIPTIONS.LIST,
  );

  return data.data;
}