"use client";

import {
  useMemo,
  useState,
  useCallback
} from "react";

import { Plus } from "lucide-react";

import {
  AppPage,
} from "@/components/common/app-page";

import {
  DataTable,
} from "@/components/common/data-table/data-table";

import {
  Button,
} from "@/components/ui/button";

import {
  useSubscriptions,
  useUpdateSubscriptionStatus,
} from "@/features/subscriptions/hooks";

import {
  getSubscriptionColumns,
} from "@/features/subscriptions/constants";

import type {
    Subscription,
    SubscriptionStatus
  } from "@/features/subscriptions/types";

import {
    CreateSubscriptionDialog,
    ViewSubscriptionDialog,
    EditSubscriptionDialog,
    DeleteSubscriptionDialog,
  } from "@/features/subscriptions/components/dialogs";

export default function SubscriptionsPage() {
  const {
    data: subscriptions = [],
    isLoading,
    isError,
    error,
  } = useSubscriptions();

  const [
    selectedSubscriptionId,
    setSelectedSubscriptionId,
  ] = useState<string | null>(
    null,
  );
  
  const [
    openViewDialog,
    setOpenViewDialog,
  ] = useState(false);

  const [
    openCreateDialog,
    setOpenCreateDialog,
  ] = useState(false);

  const [
    openEditDialog,
    setOpenEditDialog,
  ] = useState(false);

  const [
    openDeleteDialog,
    setOpenDeleteDialog,
  ] = useState(false);
  
  const selectedSubscription = useMemo(
    () =>
      subscriptions.find(
        (subscription) =>
          subscription.id ===
          selectedSubscriptionId,
      ) ?? null,
    [
      subscriptions,
      selectedSubscriptionId,
    ],
  );

  const updateStatusMutation =
    useUpdateSubscriptionStatus();
    
    const handleStatusChange =
    useCallback(
        async (
        subscription: Subscription,
        ) => {
        if (subscription.is_deleted) {
            return;
        }

        let nextStatus:
            SubscriptionStatus;

        if (
            subscription.status ===
            "ACTIVE"
        ) {
            nextStatus =
            "SUSPENDED";
        } else if (
            subscription.status ===
            "SUSPENDED"
        ) {
            nextStatus =
            "ACTIVE";
        } else {
            return;
        }

        await updateStatusMutation.mutateAsync({
            id: subscription.id,
            status: nextStatus,
        });
        },
        [updateStatusMutation],
    );


  const columns = useMemo(
  () =>
    getSubscriptionColumns({
      onView: (
        subscription,
      ) => {
        setSelectedSubscriptionId(
          subscription.id,
        );

        setOpenViewDialog(
          true,
        );
      },

      onStatusChange: (
        subscription,
      ) => {
        void handleStatusChange(
          subscription,
        );
      },

      onDelete: (
        subscription,
      ) => {
        setSelectedSubscriptionId(
          subscription.id,
        );

        setOpenDeleteDialog(
          true,
        );
      },
    }),
  [handleStatusChange],
);

  if (isLoading) {
    return (
      <AppPage>
        <div className="flex h-64 items-center justify-center">
          Loading subscriptions...
        </div>
      </AppPage>
    );
  }

  if (isError) {
    return (
      <AppPage>
        <div className="flex h-64 items-center justify-center text-destructive">
          {error instanceof Error
            ? error.message
            : "Unable to load subscriptions."}
        </div>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <DataTable
        columns={columns}
        data={subscriptions}
        toolbarActions={
         <Button
            type="button"
            onClick={() =>
                setOpenCreateDialog(true)
            }
            >
            <Plus className="size-4" />
            Add Subscription
          </Button>
        }
      />

      <ViewSubscriptionDialog
        open={openViewDialog}
        onOpenChange={(open) => {
            setOpenViewDialog(
            open,
            );

            if (!open) {
            setSelectedSubscriptionId(
                null,
            );
            }
        }}
        subscriptionId={
            selectedSubscriptionId
        }
        />

     <EditSubscriptionDialog
        open={openEditDialog}
        onOpenChange={(open) => {
            setOpenEditDialog(
            open,
            );

            if (!open) {
            setSelectedSubscriptionId(
                null,
            );
            }
        }}
        subscriptionId={
            selectedSubscriptionId
        }
        />

    <DeleteSubscriptionDialog
        open={openDeleteDialog}
        onOpenChange={(open) => {
            setOpenDeleteDialog(open);

            if (!open) {
            setSelectedSubscriptionId(
                null,
            );
            }
        }}
        subscription={
            selectedSubscription
        }
        />

    <CreateSubscriptionDialog
        open={openCreateDialog}
        onOpenChange={
            setOpenCreateDialog
        }
        />

    </AppPage>
  );
}