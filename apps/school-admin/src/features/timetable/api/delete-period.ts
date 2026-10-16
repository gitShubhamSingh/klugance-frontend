
import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

export async function deletePeriod(
  periodId: string,
): Promise<void> {
  await apiClient.delete(
    API_ENDPOINTS.PERIODS.DELETE(periodId),
  );
}
