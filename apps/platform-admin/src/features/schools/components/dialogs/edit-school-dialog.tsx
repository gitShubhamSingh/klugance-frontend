"use client";

import { UseFormReturn } from "react-hook-form";

import {
  BaseDialog,
  DialogFooter,
} from "@/components/common/dialog";

import { useUpdateSchool } from "../../controllers";

import {
  UpdateSchoolFormValues,
} from "../../schemas";

import { School } from "../../types";

import {
  UpdateSchoolForm,
} from "../forms";

import {
  UpdateSchoolFormProvider,
} from "../providers";

interface EditSchoolDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  school: School | null;
}

export function EditSchoolDialog({
  open,
  onOpenChange,
  school,
}: EditSchoolDialogProps) {
  if (!school) {
    return null;
  }

  return (
    <UpdateSchoolFormProvider
      key={school.id}
      school={school}
    >
      {(form) => (
        <EditSchoolDialogContent
          open={open}
          onOpenChange={onOpenChange}
          school={school}
          form={form}
        />
      )}
    </UpdateSchoolFormProvider>
  );
}

interface EditSchoolDialogContentProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  school: School;

  form:
    UseFormReturn<UpdateSchoolFormValues>;
}

function EditSchoolDialogContent({
  open,
  onOpenChange,
  school,
  form,
}: EditSchoolDialogContentProps) {
  const controller =
    useUpdateSchool({
      schoolId: school.id,
      form,

      onSuccess: () => {
        onOpenChange(false);
      },
    });

  return (
    <BaseDialog
      open={open}
      onOpenChange={(value) => {
        if (!controller.loading) {
          onOpenChange(value);
        }
      }}
      title="Edit School"
      description={`Update ${school.name}.`}
      size="lg"
      loading={controller.loading}
      footer={
        <DialogFooter
          cancelLabel="Cancel"
          submitLabel="Save Changes"
          loading={controller.loading}
          onCancel={() => {
            if (!controller.loading) {
              onOpenChange(false);
            }
          }}
          onSubmit={controller.onSubmit}
        />
      }
    >
      <div>
        <p className="text-xs text-muted-foreground">
          School Code
        </p>

        <p className="mt-1 font-mono text-sm font-medium">
          {school.code}
        </p>
      </div>

      <UpdateSchoolForm
        form={form}
      />
    </BaseDialog>
  );
}