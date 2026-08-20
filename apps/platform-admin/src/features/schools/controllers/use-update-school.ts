"use client";

import { UseFormReturn } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/core/api/get-error-message";

import { useUpdateSchoolMutation } from "../hooks";
import { UpdateSchoolFormValues } from "../schemas";

interface Props {
  schoolId: string;

  form: UseFormReturn<UpdateSchoolFormValues>;

  onSuccess?: () => void;
}

export function useUpdateSchool({
  schoolId,
  form,
  onSuccess,
}: Props) {
  const queryClient =
    useQueryClient();

  const mutation =
    useUpdateSchoolMutation();

  const onSubmit =
    form.handleSubmit(
      async (values) => {
        try {
          await mutation.mutateAsync({
            id: schoolId,
            payload: values,
          });

          // School list
          await queryClient.invalidateQueries({
            queryKey: ["schools"],
          });

          // School detail
          await queryClient.invalidateQueries({
            queryKey: [
              "school",
              schoolId,
            ],
          });

          toast.success(
            "School updated successfully.",
          );

          onSuccess?.();
        } catch (error) {
          toast.error(
            getErrorMessage(error),
          );
        }
      },
    );

  return {
    onSubmit,
    loading: mutation.isPending,
  };
}