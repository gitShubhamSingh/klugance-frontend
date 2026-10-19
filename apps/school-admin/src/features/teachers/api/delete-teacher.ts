
import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

export async function deleteTeacher(
  teacherId: string,
): Promise<void> {
  await apiClient.delete(
    API_ENDPOINTS.TEACHERS.DELETE(teacherId),
  );
}
