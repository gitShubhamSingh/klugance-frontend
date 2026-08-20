import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

export async function deleteSection(
  id: string,
): Promise<void> {
  await apiClient.delete(
    API_ENDPOINTS.SECTIONS.DELETE(id),
  );
}