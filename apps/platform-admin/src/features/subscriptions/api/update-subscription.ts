import {
    apiClient,
  } from "@/core/api/client";
  
  import {
    API_ENDPOINTS,
  } from "@/core/api/endpoints";
  
  import type {
    UpdateSubscriptionFormValues,
  } from "../schemas";
  
  import type {
    Subscription,
  } from "../types";
  
  export async function updateSubscription(
    id: string,
    payload: UpdateSubscriptionFormValues,
  ): Promise<Subscription> {
    const { data } =
      await apiClient.put(
        API_ENDPOINTS.SUBSCRIPTIONS.UPDATE(
          id,
        ),
        payload,
      );
  
    return data.data;
  }