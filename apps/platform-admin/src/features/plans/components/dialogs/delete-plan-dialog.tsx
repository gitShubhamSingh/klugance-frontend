"use client";

import { BaseDialog } from "@/components/common/dialog";
import { Button } from "@/components/ui/button";

import { useDeletePlan } from "../../controllers";
import { Plan } from "../../types";

interface DeletePlanDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  plan: Plan | null;
}

export function DeletePlanDialog({
  open,
  onOpenChange,
  plan,
}: DeletePlanDialogProps) {
  const controller = useDeletePlan({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  if (!plan) {
    return null;
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={(value) => {
        if (!controller.loading) {
          onOpenChange(value);
        }
      }}
      title="Delete Plan"
      description="This action cannot be undone."
      size="sm"
      loading={controller.loading}
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={controller.loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={controller.loading}
            onClick={() =>
              controller.deletePlan(
                plan.id,
              )
            }
          >
            {controller.loading
              ? "Deleting..."
              : "Delete Plan"}
          </Button>
        </div>
      }
    >
      <div className="text-sm text-muted-foreground">
        Are you sure you want to delete{" "}
        <span className="font-medium text-foreground">
          {plan.name}
        </span>
        ?
      </div>
    </BaseDialog>
  );
}