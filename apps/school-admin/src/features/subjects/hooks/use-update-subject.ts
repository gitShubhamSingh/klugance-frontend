"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  toast,
} from "sonner";

import {
  updateSubject,
} from "../api/subjects-api";

import {
  subjectQueryKeys,
} from "../api/query-keys";

import type {
  ClassSubject,
} from "../types/class-subject";

import type {
  UpdateSubjectPayload,
} from "../types";

interface UpdateSubjectVariables {
  subjectId: string;

  classId: string;

  payload: UpdateSubjectPayload;
}

export function useUpdateSubject() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      subjectId,
      payload,
    }: UpdateSubjectVariables) =>
      updateSubject(
        subjectId,
        payload,
      ),

    onSuccess: (
      updatedSubject,
      variables,
    ) => {
      /*
       * =====================================================
       * UPDATE CURRENT CLASS SUBJECTS CACHE IMMEDIATELY
       * =====================================================
       */

      queryClient.setQueryData<
        ClassSubject[]
      >(
        subjectQueryKeys.classSubjects(
          variables.classId,
        ),

        (oldData = []) => {
          return oldData.map(
            (classSubject) => {
              if (
                classSubject.subject_id !==
                updatedSubject.id
              ) {
                return classSubject;
              }

              return {
                ...classSubject,

                subject: {
                  id: updatedSubject.id,

                  name: updatedSubject.name,

                  code:
                    updatedSubject.code,

                  description:
                    updatedSubject.description,
                },
              };
            },
          );
        },
      );

      /*
       * =====================================================
       * UPDATE INDIVIDUAL SUBJECT CACHE
       * =====================================================
       */

      queryClient.setQueryData(
        subjectQueryKeys.detail(
          updatedSubject.id,
        ),

        updatedSubject,
      );

      /*
       * =====================================================
       * REFRESH FROM SERVER IN BACKGROUND
       *
       * UI updates immediately from setQueryData.
       * This ensures backend synchronization afterward.
       * =====================================================
       */

      void queryClient.invalidateQueries({
        queryKey:
          subjectQueryKeys.classSubjects(
            variables.classId,
          ),
      });

      toast.success(
        "Subject updated successfully.",
      );
    },
  });
}