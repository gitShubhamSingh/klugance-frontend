"use client";

import {
  BaseDialog,
  DialogFooter,
} from "@/components/common/dialog";

import {
  useUpdatePlan,
} from "../../controllers";

import { Plan } from "../../types";

import {
  UpdatePlanForm,
} from "../forms";

import {
  UpdatePlanFormProvider,
} from "../providers";

interface EditPlanDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  plan: Plan | null;
}

export function EditPlanDialog({
  open,
  onOpenChange,
  plan,
}: EditPlanDialogProps) {
  if (!plan) {
    return null;
  }

  return (
    <UpdatePlanFormProvider
      key={plan.id}
      plan={plan}
    >
      {(form) => (
        <EditPlanDialogContent
          open={open}
          onOpenChange={
            onOpenChange
          }
          plan={plan}
          form={form}
        />
      )}
    </UpdatePlanFormProvider>
  );
}


import {
    UseFormReturn,
  } from "react-hook-form";
  
  import {
    UpdatePlanFormValues,
  } from "../../schemas";
  
  interface EditPlanDialogContentProps {
    open: boolean;
  
    onOpenChange: (
      open: boolean,
    ) => void;
  
    plan: Plan;
  
    form:
      UseFormReturn<UpdatePlanFormValues>;
  }
  
  function EditPlanDialogContent({
    open,
    onOpenChange,
    plan,
    form,
  }: EditPlanDialogContentProps) {
    const controller =
      useUpdatePlan({
        planId: plan.id,
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
        title="Edit Plan"
        description={`Update ${plan.name}.`}
        size="lg"
        loading={
          controller.loading
        }
        footer={
          <DialogFooter
            cancelLabel="Cancel"
            submitLabel="Save Changes"
            loading={
              controller.loading
            }
            onCancel={() => {
              if (
                !controller.loading
              ) {
                onOpenChange(false);
              }
            }}
            onSubmit={
              controller.onSubmit
            }
          />
        }
      >
        <div className="mb-1">
          <p className="text-xs text-muted-foreground">
            Plan Code
          </p>
  
          <p className="mt-1 font-mono text-sm font-medium">
            {plan.code}
          </p>
        </div>
  
        <UpdatePlanForm
          form={form}
        />
      </BaseDialog>
    );
  }