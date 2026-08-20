import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import {
  Plan,
  UpdatePlanRequest,
} from "../types";

interface UpdatePlanResponse {
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

export async function updatePlan(
  id: string,
  payload: UpdatePlanRequest,
): Promise<Plan> {
  const { data } =
    await apiClient.put<UpdatePlanResponse>(
      API_ENDPOINTS.PLANS.UPDATE(id),
      payload,
    );

  return data.data;
}