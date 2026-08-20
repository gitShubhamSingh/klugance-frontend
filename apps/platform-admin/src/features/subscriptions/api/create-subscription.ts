import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import type {
  Subscription,
} from "../types";

import type {
  CreateSubscriptionFormValues,
} from "../schemas";

export async function createSubscription(
  payload: CreateSubscriptionFormValues,
): Promise<Subscription> {
  const { data } =
    await apiClient.post(
      API_ENDPOINTS.SUBSCRIPTIONS.CREATE,
      payload,
    );

  return data.data;
}