"use client";

import {
  BaseDialog,
  DialogFooter,
} from "@/components/common/dialog";

import {
  useCreatePlan,
} from "../../controllers";

import {
  CreatePlanForm,
} from "../forms";

import {
  CreatePlanFormProvider,
} from "../providers";

interface CreatePlanDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  productId: string;
}

export function CreatePlanDialog({
  open,
  onOpenChange,
  productId,
}: CreatePlanDialogProps) {
  return (
    <CreatePlanFormProvider>
      {(form) => {
        const controller =
          useCreatePlan({
            productId,
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
          title="Create Plan"
          description="Add a subscription plan to this product."
          size="lg"
          loading={controller.loading}
          overlayClassName="bg-black/20 backdrop-blur-md"
            footer={
              <DialogFooter
                cancelLabel="Cancel"
                submitLabel="Create Plan"
                loading={
                  controller.loading
                }
                onCancel={() => {
                  if (
                    !controller.loading
                  ) {
                    form.reset();
                    onOpenChange(
                      false,
                    );
                  }
                }}
                onSubmit={
                  controller.onSubmit
                }
              />
            }
          >
            <CreatePlanForm
              form={form}
            />
          </BaseDialog>
        );
      }}
    </CreatePlanFormProvider>
  );
}