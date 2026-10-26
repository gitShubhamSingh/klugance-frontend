"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { SubmitHomeworkPayload } from "@/features/student/types/student";

import {
  cancelHomework,
  closeHomework,
  createHomework,
  generateQuestions,
  getChildHomework,
  getHomeworkOptions,
  getSectionStudents,
  getTeacherHomework,
  getTeacherHomeworkDetail,
  reviewSubmission,
  submitChildHomework,
  type ChildHomeworkSource,
} from "../api/homework";
import type {
  CreateHomeworkPayload,
  GenerateQuestionsPayload,
  ReviewPayload,
  TeacherHomeworkDetail,
} from "../types/homework";

export const homeworkKeys = {
  teacher: ["teacher-homework"] as const,
  options: () => [...homeworkKeys.teacher, "options"] as const,
  students: (sectionId: string) => [...homeworkKeys.teacher, "students", sectionId] as const,
  list: () => [...homeworkKeys.teacher, "list"] as const,
  detail: (id: string) => [...homeworkKeys.teacher, "detail", id] as const,
  child: (source: ChildHomeworkSource, date: string) =>
    ["child-homework", source.role, source.role === "parent" ? source.studentId : "me", date] as const,
};

/* ── teacher ── */

export function useHomeworkOptions() {
  return useQuery({ queryKey: homeworkKeys.options(), queryFn: getHomeworkOptions, staleTime: 5 * 60_000 });
}

export function useSectionStudents(sectionId: string | null) {
  return useQuery({
    queryKey: homeworkKeys.students(sectionId ?? ""),
    queryFn: () => getSectionStudents(sectionId!),
    enabled: Boolean(sectionId),
    staleTime: 5 * 60_000,
  });
}

export function useTeacherHomework() {
  return useQuery({ queryKey: homeworkKeys.list(), queryFn: getTeacherHomework, refetchInterval: 60_000 });
}

export function useTeacherHomeworkDetail(id: string | null) {
  return useQuery({
    queryKey: homeworkKeys.detail(id ?? ""),
    queryFn: () => getTeacherHomeworkDetail(id!),
    enabled: Boolean(id),
    refetchInterval: 30_000,
  });
}

export function useCreateHomework() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHomeworkPayload) => createHomework(payload),
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: homeworkKeys.list() }),
  });
}

/** Drafts questions with AI; nothing is cached or saved. */
export function useGenerateQuestions() {
  return useMutation({
    mutationFn: (payload: GenerateQuestionsPayload) => generateQuestions(payload),
    retry: false,
  });
}

function useDetailWrite<TArgs>(fn: (args: TArgs) => Promise<TeacherHomeworkDetail>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    retry: false,
    onSuccess: async (detail) => {
      queryClient.setQueryData(homeworkKeys.detail(detail.id), detail);
      await queryClient.invalidateQueries({ queryKey: homeworkKeys.list() });
    },
  });
}

export function useReviewSubmission() {
  return useDetailWrite(
    ({ homeworkId, enrollmentId, payload }: { homeworkId: string; enrollmentId: string; payload: ReviewPayload }) =>
      reviewSubmission(homeworkId, enrollmentId, payload),
  );
}

export function useCloseHomework() {
  return useDetailWrite((id: string) => closeHomework(id));
}

export function useCancelHomework() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelHomework(id),
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: homeworkKeys.list() }),
  });
}

/* ── student / parent ── */

export function useChildHomework(source: ChildHomeworkSource | null, date: string) {
  return useQuery({
    queryKey: source ? homeworkKeys.child(source, date) : ["child-homework", "none"],
    queryFn: () => getChildHomework(source!, date),
    enabled: Boolean(source),
    refetchInterval: 60_000,
  });
}

export function useSubmitChildHomework(source: ChildHomeworkSource | null, date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ homeworkId, payload }: { homeworkId: string; payload: SubmitHomeworkPayload }) =>
      submitChildHomework(source!, homeworkId, payload, date),
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["child-homework"] });
      // The student dashboard shows homework too.
      await queryClient.invalidateQueries({ queryKey: ["student"] });
    },
  });
}
