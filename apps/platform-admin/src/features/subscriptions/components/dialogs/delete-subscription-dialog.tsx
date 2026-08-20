"use client";

import {
  AlertTriangle,
} from "lucide-react";

import {
  BaseDialog,
} from "@/components/common/dialog/base-dialog";

import {
  Button,
} from "@/components/ui/button";

import type {
  Subscription,
} from "../../types";

import {
  useDeleteSubscription,
} from "../../hooks";

interface DeleteSubscriptionDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  subscription: Subscription | null;
}

export function DeleteSubscriptionDialog({
  open,
  onOpenChange,
  subscription,
}: DeleteSubscriptionDialogProps) {
  const mutation =
    useDeleteSubscription();

  if (!subscription) {
    return null;
  }

  async function handleDelete() {
    if (!subscription) {
      return;
    }

    await mutation.mutateAsync(
      subscription.id,
    );

    onOpenChange(false);
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={
        onOpenChange
      }
      title="Delete Subscription"
      description="This action will delete the selected subscription."
      size="sm"
      loading={
        mutation.isPending
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={
              mutation.isPending
            }
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={
              mutation.isPending
            }
            onClick={() =>
              void handleDelete()
            }
          >
            {mutation.isPending
              ? "Deleting..."
              : "Delete Subscription"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex gap-4 rounded-xl bg-destructive/5 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </div>

          <div>
            <p className="text-sm font-medium">
              Are you sure?
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              The subscription for{" "}
              <span className="font-medium text-foreground">
                {subscription.school.name}
              </span>{" "}
              using the{" "}
              <span className="font-medium text-foreground">
                {subscription.plan.name}
              </span>{" "}
              plan will be deleted.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <DeleteDetail
            label="School"
            value={
              subscription.school.name
            }
          />

          <DeleteDetail
            label="Product"
            value={
              subscription.product.name
            }
          />

          <DeleteDetail
            label="Plan"
            value={
              subscription.plan.name
            }
          />

          <DeleteDetail
            label="Subscription ID"
            value={
              subscription.id
            }
            mono
          />
        </div>

        {mutation.isError && (
          <div className="rounded-lg bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Unable to delete subscription."}
            </p>
          </div>
        )}
      </div>
    </BaseDialog>
  );
}

function DeleteDetail({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <span className="text-xs text-muted-foreground">
        {label}
      </span>

      <span
        className={
          mono
            ? "break-all text-right font-mono text-[11px] text-muted-foreground"
            : "text-right text-sm font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}