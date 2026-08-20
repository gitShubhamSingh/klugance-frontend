import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type {
  Subscription,
} from "../types";

export async function getSubscription(
  id: string,
): Promise<Subscription> {
  const { data } = await apiClient.get(
    API_ENDPOINTS.SUBSCRIPTIONS.DETAIL(id),
  );

  return data.data;
}