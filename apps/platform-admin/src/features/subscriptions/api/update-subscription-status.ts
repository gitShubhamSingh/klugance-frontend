import {
    apiClient,
  } from "@/core/api/client";
  
  import {
    API_ENDPOINTS,
  } from "@/core/api/endpoints";
  
  import type {
    Subscription,
    SubscriptionStatus,
  } from "../types";
  
  export async function updateSubscriptionStatus(
    id: string,
    status: SubscriptionStatus,
  ): Promise<Subscription> {
    const { data } =
      await apiClient.patch(
        API_ENDPOINTS.SUBSCRIPTIONS.STATUS(
          id,
        ),
        {
          status,
        },
      );
  
    return data.data;
  }