"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { teacherDashboardKeys } from "@/features/dashboard/hooks/use-teacher-dashboard";
import { teacherStudentKeys } from "@/features/teacher-students/hooks/use-teacher-students";

import {
  getAttendanceRecords,
  getTodayRegisters,
  saveRegister,
} from "../api/teacher-attendance";
import type { SaveRegisterPayload } from "../types/teacher-attendance";

export const teacherAttendanceKeys = {
  all: ["teacher-attendance"] as const,
  today: (date: string) => [...teacherAttendanceKeys.all, "today", date] as const,
  records: (sectionId: string, month: string) =>
    [...teacherAttendanceKeys.all, "records", sectionId, month] as const,
};

export function useTodayRegisters(date: string) {
  return useQuery({
    queryKey: teacherAttendanceKeys.today(date),
    queryFn: () => getTodayRegisters(date),
  });
}

export function useAttendanceRecords(sectionId: string | null, month: string) {
  return useQuery({
    queryKey: teacherAttendanceKeys.records(sectionId ?? "", month),
    queryFn: () => getAttendanceRecords(sectionId!, month),
    enabled: Boolean(sectionId),
  });
}

export function useSaveRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveRegisterPayload) => saveRegister(payload),
    // Never retry a write automatically.
    retry: false,
    onSuccess: async () => {
      // Attendance feeds the dashboard and My Students too.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: teacherAttendanceKeys.all }),
        queryClient.invalidateQueries({ queryKey: teacherDashboardKeys.all }),
        queryClient.invalidateQueries({ queryKey: teacherStudentKeys.all }),
      ]);
    },
  });
}
