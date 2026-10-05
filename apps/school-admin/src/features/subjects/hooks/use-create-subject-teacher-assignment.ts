
"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createSubjectTeacherAssignment,
  type CreateSubjectTeacherAssignmentPayload,
} from "../api/create-subject-teacher-assignment";

import {
  subjectQueryKeys,
} from "../api/query-keys";

import {
  subjectTeacherAssignmentKeys,
} from "./use-subject-teacher-assignments";

type CreateAssignmentVariables = {
  classId: string;
  payload: CreateSubjectTeacherAssignmentPayload;
};

export function useCreateSubjectTeacherAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
    }: CreateAssignmentVariables) =>
      createSubjectTeacherAssignment(payload),

    onSuccess: async (
      _data,
      variables,
    ) => {
      /*
       * Refresh class subjects.
       */
      await queryClient.invalidateQueries({
        queryKey:
          subjectQueryKeys.classSubjects(
            variables.classId,
          ),
      });

      /*
       * IMPORTANT:
       *
       * SubjectsGrid gets assigned teachers from:
       *
       * useSubjectTeacherAssignments(subject.id)
       *
       * Therefore we MUST invalidate the
       * subject-teacher-assignment query as well.
       */
      await queryClient.invalidateQueries({
        queryKey:
          subjectTeacherAssignmentKeys.bySubject(
            variables.payload.subject_id,
          ),
      });
    },
  });
}

