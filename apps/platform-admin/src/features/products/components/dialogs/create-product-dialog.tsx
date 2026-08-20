"use client";

import {
  BaseDialog,
  DialogFooter,
} from "@/components/common/dialog";

import {
  useCreateProduct,
} from "../../controllers";

import {
  ProductForm,
} from "../forms";

import {
  ProductFormProvider,
} from "../providers";

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
}

export function CreateProductDialog({
  open,
  onOpenChange,
}: CreateProductDialogProps) {
  return (
    <ProductFormProvider>
      {(form) => {
        const controller =
          useCreateProduct({
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
            title="Create Product"
            description="Add a new product to the Klugance platform."
            size="md"
            loading={controller.loading}
            footer={
              <DialogFooter
                cancelLabel="Cancel"
                submitLabel="Create Product"
                loading={
                  controller.loading
                }
                onCancel={() => {
                  if (
                    controller.loading
                  ) {
                    return;
                  }

                  form.reset();
                  onOpenChange(false);
                }}
                onSubmit={
                  controller.onSubmit
                }
              />
            }
          >
            <ProductForm
              form={form}
            />
          </BaseDialog>
        );
      }}
    </ProductFormProvider>
  );
}