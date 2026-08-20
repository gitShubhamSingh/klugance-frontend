"use client";

import { UseFormReturn } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/core/api/get-error-message";

import { useCreateSchoolMutation } from "../hooks/use-create-school";

import { CreateSchoolFormValues } from "../schemas/create-school.schema";

interface Props {
  form: UseFormReturn<CreateSchoolFormValues>;
  onSuccess?: () => void;
}

export function useCreateSchool({
  form,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();

  const mutation = useCreateSchoolMutation();

  const onSubmit = form.handleSubmit(
    async (values) => {
      try {
        await mutation.mutateAsync(values);

        await queryClient.invalidateQueries({
          queryKey: ["schools"],
        });

        toast.success(
          "School created successfully."
        );

        form.reset();

        onSuccess?.();
      } catch (error) {
        toast.error(
          getErrorMessage(error)
        );
      }
    },
  );

  return {
    onSubmit,
    loading: mutation.isPending,
  };
}