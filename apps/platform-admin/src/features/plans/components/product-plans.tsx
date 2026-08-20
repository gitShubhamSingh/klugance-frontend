"use client";

import { useState } from "react";

import {
  CalendarDays,
  Package,
  Pencil,
  Plus,
  Power,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  CreatePlanDialog,
  DeletePlanDialog,
  EditPlanDialog,
} from "./dialogs";

import { useProductPlans } from "../hooks";
import { Plan } from "../types";

import {
    useUpdatePlanStatus,
  } from "../controllers";

interface ProductPlansProps {
  productId: string;
}

export function ProductPlans({
  productId,
}: ProductPlansProps) {
  const {
    data: plans = [],
    isLoading,
    isError,
    error,
  } = useProductPlans(productId);

  const [
    openCreateDialog,
    setOpenCreateDialog,
  ] = useState(false);

  const [
    selectedPlan,
    setSelectedPlan,
  ] = useState<Plan | null>(null);

  const [
    openDeleteDialog,
    setOpenDeleteDialog,
  ] = useState(false);

  const [
    openEditDialog,
    setOpenEditDialog,
  ] = useState(false);

  const statusController = useUpdatePlanStatus();

  function handleDelete(
    plan: Plan,
  ) {
    setSelectedPlan(plan);
    setOpenDeleteDialog(true);
  }

  function handleDeleteDialogChange(
    open: boolean,
  ) {
    setOpenDeleteDialog(open);

    if (!open) {
      setSelectedPlan(null);
    }
  }

  function handleEdit(
    plan: Plan,
  ) {
    setSelectedPlan(plan);
    setOpenEditDialog(true);
  }
  
  function handleEditDialogChange(
    open: boolean,
  ) {
    setOpenEditDialog(open);
  
    if (!open) {
      setSelectedPlan(null);
    }
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="size-4 text-muted-foreground" />

            <h3 className="text-sm font-semibold">
              Product Plans
            </h3>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Subscription plans configured for this product.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() =>
            setOpenCreateDialog(true)
          }
        >
          <Plus className="size-4" />
          Add Plan
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <PlansLoading />
      )}

      {/* Error */}
      {isError && (
        <PlansError
          message={
            error instanceof Error
              ? error.message
              : "Unable to load plans."
          }
        />
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        plans.length === 0 && (
          <PlansEmpty />
        )}

      {/* Plans */}
      {!isLoading &&
        !isError &&
        plans.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={() =>
                handleEdit(plan)
              }
              onDelete={() =>
                handleDelete(plan)
              }
              onStatusChange={() =>
                statusController.updateStatus(
                  plan,
                )
              }
              statusLoading={
                statusController.loading &&
                statusController.updatingPlanId ===
                  plan.id
              }
            />
            ))}
          </div>
        )}

      {/* Create Plan */}
      <CreatePlanDialog
        open={openCreateDialog}
        onOpenChange={
          setOpenCreateDialog
        }
        productId={productId}
      />
      
    {/* Edit Plan */}
    <EditPlanDialog
        open={openEditDialog}
        onOpenChange={
            handleEditDialogChange
        }
        plan={selectedPlan}
        />

      {/* Delete Plan */}
      <DeletePlanDialog
        open={openDeleteDialog}
        onOpenChange={
          handleDeleteDialogChange
        }
        plan={selectedPlan}
      />
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  onEdit: () => void;
  onDelete: () => void;
    onStatusChange: () => void;
  statusLoading: boolean;
}

function PlanCard({
  plan,
  onEdit,
  onDelete,
  onStatusChange,
  statusLoading,
}: PlanCardProps) {
  const active =
    plan.status === "ACTIVE";

  return (
    <div className="group rounded-xl bg-muted/30 p-5 transition-colors hover:bg-muted/50">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="truncate font-semibold">
            {plan.name}
          </h4>

          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {plan.code}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={
              active
                ? "size-2 rounded-full bg-emerald-500"
                : "size-2 rounded-full bg-muted-foreground"
            }
          />

          <span className="text-xs text-muted-foreground">
            {active
              ? "Active"
              : "Inactive"}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="mt-6">
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-semibold tracking-tight">
            {formatMoney(
              plan.price,
              plan.currency,
            )}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />

          {formatBillingCycle(
            plan.billing_cycle,
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center justify-between border-t pt-3">
  <Button
    type="button"
    variant="ghost"
    size="sm"
    disabled={statusLoading}
    onClick={onStatusChange}
    className={
      active
        ? "text-muted-foreground hover:text-destructive"
        : "text-muted-foreground hover:text-foreground"
    }
  >
    <Power className="size-4" />

    {statusLoading
      ? "Updating..."
      : active
        ? "Deactivate"
        : "Activate"}
  </Button>

    <div className="flex items-center gap-1">
        <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Edit ${plan.name}`}
        title="Edit plan"
        onClick={onEdit}
        disabled={statusLoading}
        >
        <Pencil className="size-4" />
        </Button>

        <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${plan.name}`}
        title="Delete plan"
        onClick={onDelete}
        disabled={statusLoading}
        >
        <Trash2 className="size-4 text-destructive" />
        </Button>
    </div>
    </div>
</div>
  );
}

function PlansLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl bg-muted/30 p-5"
        >
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />

          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />

          <div className="mt-8 h-7 w-28 animate-pulse rounded bg-muted" />

          <div className="mt-3 h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function PlansEmpty() {
  return (
    <div className="rounded-xl bg-muted/30 px-5 py-10 text-center">
      <Package className="mx-auto size-6 text-muted-foreground" />

      <p className="mt-3 text-sm font-medium">
        No plans configured
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        This product does not have any subscription plans yet.
      </p>
    </div>
  );
}

function PlansError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl bg-destructive/5 px-5 py-6">
      <p className="text-sm font-medium text-destructive">
        Unable to load plans
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

function formatBillingCycle(
  cycle: Plan["billing_cycle"],
) {
  switch (cycle) {
    case "MONTHLY":
      return "Billed monthly";

    case "YEARLY":
      return "Billed yearly";

    default:
      return cycle;
  }
}

function formatMoney(
  price: string,
  currency: string,
) {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return `${price} ${currency}`;
  }

  try {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    ).format(amount);
  } catch {
    return `${price} ${currency}`;
  }
}