import {
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    assignSubjectToClass,
    removeSubjectFromClass,
    updateClassSubject,
  } from "../api/class-subjects-api";
  
  import { subjectQueryKeys } from "../constants/subject-query-keys";
  
  import type {
    CreateClassSubjectPayload,
    UpdateClassSubjectPayload,
  } from "../types";
  
  export function useAssignSubjectToClass() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (
        payload: CreateClassSubjectPayload,
      ) => assignSubjectToClass(payload),
  
      onSuccess: (_, variables) => {
        void queryClient.invalidateQueries({
          queryKey:
            subjectQueryKeys.classSubjects(
              variables.class_id,
            ),
        });
      },
    });
  }
  
  export function useUpdateClassSubject() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        classSubjectId,
        payload,
      }: {
        classSubjectId: string;
        payload: UpdateClassSubjectPayload;
      }) =>
        updateClassSubject(
          classSubjectId,
          payload,
        ),
  
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: subjectQueryKeys.all,
        });
      },
    });
  }
  
  export function useRemoveSubjectFromClass() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        classSubjectId,
        classId,
      }: {
        classSubjectId: string;
        classId: string;
      }) =>
        removeSubjectFromClass(classSubjectId),
  
      onSuccess: (_, variables) => {
        void queryClient.invalidateQueries({
          queryKey:
            subjectQueryKeys.classSubjects(
              variables.classId,
            ),
        });
      },
    });
  }