"use client";

import { BaseDialog } from "@/components/common/dialog";

import { useCreateSchool } from "../../controllers";

import { SchoolFormProvider } from "../providers";

import { SchoolWizard } from "../wizard";

interface CreateSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSchoolDialog({
  open,
  onOpenChange,
}: CreateSchoolDialogProps) {
  return (
    <SchoolFormProvider>
      {(form) => {
        const controller = useCreateSchool({
          form,
          onSuccess: () => {
            onOpenChange(false);
          },
        });

        return (
          <BaseDialog
            open={open}
            loading={controller.loading}
            size="xl"
            title="Create School"
            description="Create a new school along with its owner and principal."
            onOpenChange={(value) => {
              if (!controller.loading) {
                onOpenChange(value);
              }
            }}
          >
            <SchoolWizard
              form={form}
              loading={controller.loading}
              onSubmit={controller.onSubmit}
              onCancel={() => {
                form.reset();
                onOpenChange(false);
              }}
            />
          </BaseDialog>
        );
      }}
    </SchoolFormProvider>
  );
}