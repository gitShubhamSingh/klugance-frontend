"use client";

import {
  BaseDialog,
} from "@/components/common/dialog";

import {
  Button,
} from "@/components/ui/button";

import {
  useCreateSubscription,
} from "../../controllers";

import {
  CreateSubscriptionFormProvider,
} from "../providers";

import {
  CreateSubscriptionForm,
} from "../forms";

interface CreateSubscriptionDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;
}

export function CreateSubscriptionDialog({
  open,
  onOpenChange,
}: CreateSubscriptionDialogProps) {
  return (
    <CreateSubscriptionFormProvider>
      {(form) => {
        const controller =
          useCreateSubscription({
            form,

            onSuccess: () => {
              onOpenChange(false);
            },
          });

        return (
          <BaseDialog
            open={open}
            onOpenChange={(value) => {
              if (
                !controller.loading
              ) {
                onOpenChange(
                  value,
                );
              }
            }}
            loading={
              controller.loading
            }
            size="md"
            title="Create Subscription"
            description="Assign a subscription plan to a school."
            footer={
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    controller.loading
                  }
                  onClick={() => {
                    form.reset();

                    onOpenChange(
                      false,
                    );
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  disabled={
                    controller.loading
                  }
                  onClick={
                    controller.onSubmit
                  }
                >
                  {controller.loading
                    ? "Creating..."
                    : "Create Subscription"}
                </Button>
              </div>
            }
          >
            <CreateSubscriptionForm
              form={form}
            />
          </BaseDialog>
        );
      }}
    </CreateSubscriptionFormProvider>
  );
}