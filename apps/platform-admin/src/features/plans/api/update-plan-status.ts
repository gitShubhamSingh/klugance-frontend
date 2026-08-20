import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

import {
  Plan,
  UpdatePlanStatusRequest,
} from "../types";

interface UpdatePlanStatusResponse {
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

export async function updatePlanStatus(
  id: string,
  payload: UpdatePlanStatusRequest,
): Promise<Plan> {
  const { data } =
    await apiClient.patch<UpdatePlanStatusResponse>(
      API_ENDPOINTS.PLANS.STATUS(id),
      payload,
    );

  return data.data;
}