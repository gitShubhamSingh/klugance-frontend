import {
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    createSubject,
    deleteSubject,
    updateSubject,
  } from "../api/subjects-api";
  
  import { subjectQueryKeys } from "../constants/subject-query-keys";
  
  import type {
    CreateSubjectPayload,
    UpdateSubjectPayload,
  } from "../types";
  
  export function useCreateSubject() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (
        payload: CreateSubjectPayload,
      ) => createSubject(payload),
  
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: subjectQueryKeys.all,
        });
      },
    });
  }
  
  export function useUpdateSubject() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        subjectId,
        payload,
      }: {
        subjectId: string;
        payload: UpdateSubjectPayload;
      }) =>
        updateSubject(
          subjectId,
          payload,
        ),
  
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: subjectQueryKeys.all,
        });
      },
    });
  }
  
  export function useDeleteSubject() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (subjectId: string) =>
        deleteSubject(subjectId),
  
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: subjectQueryKeys.all,
        });
      },
    });
  }