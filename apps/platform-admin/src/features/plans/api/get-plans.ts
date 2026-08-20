import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import { Plan } from "../types";

interface GetPlansResponse {
  success: boolean;
  status_code: number;
  message: string;

  data: Plan[];

  errors: unknown[];
  meta: unknown;

  timestamp: string;
  trace_id: string | null;

  encrypted: boolean;
  algorithm: string | null;
  version: string;
}

export async function getPlans(): Promise<Plan[]> {
  const { data } =
    await apiClient.get<GetPlansResponse>(
      API_ENDPOINTS.PLANS.LIST,
    );

  return data.data;
}