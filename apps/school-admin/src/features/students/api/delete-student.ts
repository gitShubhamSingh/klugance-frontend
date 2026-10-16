import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";

export async function deleteStudent(
  studentId: string,
): Promise<void> {
  console.log("Calling delete API for student:", studentId);

  await apiClient.delete(
    API_ENDPOINTS.STUDENTS.DELETE(studentId),
  );
}