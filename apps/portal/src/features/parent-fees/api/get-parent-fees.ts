import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

import type { ParentChildFees } from "../types/parent-fees";

/** Invoices and payments for a child linked to the signed-in parent. */
export async function getParentFees(studentId: string): Promise<ParentChildFees> {
  const { data } = await apiClient.get<ApiResponse<ParentChildFees>>(
    API_ENDPOINTS.PARENT.FEES,
    { params: { student_id: studentId } },
  );

  return data.data;
}
