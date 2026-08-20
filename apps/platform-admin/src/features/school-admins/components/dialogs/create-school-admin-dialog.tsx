"use client";

import {
  useFormContext,
} from "react-hook-form";

import {
  BaseDialog,
} from "@/components/common/dialog/base-dialog";

import {
  Button,
} from "@/components/ui/button";

import {
  useCreateSchoolAdmin,
} from "../../controllers";

import type {
  CreateSchoolAdminFormValues,
} from "../../schemas";

import {
  CreateSchoolAdminForm,
} from "../forms";

import {
  CreateSchoolAdminFormProvider,
} from "../providers";

interface CreateSchoolAdminDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;
}

export function CreateSchoolAdminDialog({
  open,
  onOpenChange,
}: CreateSchoolAdminDialogProps) {
  return (
    <CreateSchoolAdminFormProvider>
      <CreateSchoolAdminDialogContent
        open={open}
        onOpenChange={
          onOpenChange
        }
      />
    </CreateSchoolAdminFormProvider>
  );
}

function CreateSchoolAdminDialogContent({
  open,
  onOpenChange,
}: CreateSchoolAdminDialogProps) {
  const form =
    useFormContext<CreateSchoolAdminFormValues>();

  const {
    createSchoolAdmin,
    isCreating,
    error,
    reset: resetMutation,
  } = useCreateSchoolAdmin();

  const handleOpenChange = (
    value: boolean,
  ) => {
    if (!value) {
      form.reset();
      resetMutation();
    }

    onOpenChange(value);
  };

  const onSubmit =
    form.handleSubmit(
      async (values) => {
        try {
          await createSchoolAdmin(
            values,
          );

          form.reset();
          resetMutation();

          onOpenChange(false);
        } catch {
          // Mutation error is rendered below.
        }
      },
    );

  return (
    <BaseDialog
      open={open}
      onOpenChange={
        handleOpenChange
      }
      title="Add School Admin"
      description="Create an administrator account and assign it to a school."
      size="lg"
      loading={isCreating}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isCreating}
            onClick={() =>
              handleOpenChange(
                false,
              )
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isCreating}
            onClick={() => {
              void onSubmit();
            }}
          >
            {isCreating
              ? "Creating..."
              : "Create Admin"}
          </Button>
        </div>
      }
    >
      <CreateSchoolAdminForm />

      {error && (
        <div className="rounded-lg bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">
            {getErrorMessage(
              error,
            )}
          </p>
        </div>
      )}
    </BaseDialog>
  );
}

function getErrorMessage(
  error: unknown,
) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Unable to create school admin.";
}