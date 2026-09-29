import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

export async function deleteTeacherClassAssignment(
  teacherClassId: string,
): Promise<void> {
  await apiClient.delete(
    API_ENDPOINTS.TEACHER_CLASS_ASSIGNMENTS.DELETE(
      teacherClassId,
    ),
  );
}