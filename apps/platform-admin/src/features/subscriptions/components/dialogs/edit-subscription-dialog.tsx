"use client";

import {
  BaseDialog,
} from "@/components/common/dialog/base-dialog";

import {
  useSubscription,
} from "../../hooks";

import {
  UpdateSubscriptionForm,
} from "../forms";

interface EditSubscriptionDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  subscriptionId: string | null;
}

export function EditSubscriptionDialog({
  open,
  onOpenChange,
  subscriptionId,
}: EditSubscriptionDialogProps) {
  const {
    data: subscription,
    isLoading,
    isError,
    error,
  } = useSubscription(
    open
      ? subscriptionId
      : null,
  );

  return (
    <BaseDialog
      open={open}
      onOpenChange={
        onOpenChange
      }
      title="Edit Subscription"
      description="Update the subscription plan and validity period."
      size="lg"
      loading={false}
    >
      {isLoading && (
        <EditSubscriptionLoading />
      )}

      {isError && (
        <div className="rounded-xl bg-destructive/5 p-5">
          <p className="text-sm font-medium text-destructive">
            Unable to load subscription
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Unable to load subscription details."}
          </p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        subscription && (
          <UpdateSubscriptionForm
            subscription={
              subscription
            }
            onSuccess={() =>
              onOpenChange(false)
            }
          />
        )}
    </BaseDialog>
  );
}

function EditSubscriptionLoading() {
  return (
    <div className="space-y-5">
      <div className="h-24 animate-pulse rounded-xl bg-muted" />

      <div className="space-y-2">
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />

        <div className="h-10 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-10 animate-pulse rounded-lg bg-muted" />

        <div className="h-10 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}