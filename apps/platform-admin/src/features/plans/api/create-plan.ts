import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import {
  CreatePlanRequest,
  Plan,
} from "../types";

interface CreatePlanResponse {
  success: boolean;
  status_code: number;
  message: string;

  data: Plan;

  errors: unknown[];
  meta: unknown;

  timestamp: string;
  trace_id: string | null;

  encrypted: boolean;
  algorithm: string | null;
  version: string;
}

export async function createPlan(
  payload: CreatePlanRequest,
): Promise<Plan> {
  const { data } =
    await apiClient.post<CreatePlanResponse>(
      API_ENDPOINTS.PLANS.CREATE,
      payload,
    );

  return data.data;
}