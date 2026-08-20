"use client";

import {
  CalendarDays,
  Clock3,
  GraduationCap,
  Package,
  ReceiptText,
} from "lucide-react";

import {
  BaseDialog,
} from "@/components/common/dialog/base-dialog";

import {
  useSubscription,
} from "../../hooks";

interface ViewSubscriptionDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  subscriptionId: string | null;
}

export function ViewSubscriptionDialog({
  open,
  onOpenChange,
  subscriptionId,
}: ViewSubscriptionDialogProps) {
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
      title="Subscription Details"
      description="School subscription, product, plan, and billing information."
      size="xl"
    >
      {isLoading && (
        <SubscriptionDetailLoading />
      )}

      {isError && (
        <SubscriptionDetailError
          message={
            error instanceof Error
              ? error.message
              : "Unable to load subscription details."
          }
        />
      )}

      {!isLoading &&
        !isError &&
        subscription && (
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <div className="space-y-8">
              <SubscriptionHeader
                subscription={
                  subscription
                }
              />

              <div className="grid gap-8 lg:grid-cols-2">
                <DetailSection
                  icon={
                    GraduationCap
                  }
                  title="School"
                >
                  <DetailField
                    label="School Name"
                    value={
                      subscription
                        .school.name
                    }
                  />

                  <DetailField
                    label="School Code"
                    value={
                      subscription
                        .school.code
                    }
                  />

                  <DetailField
                    label="School ID"
                    value={
                      subscription
                        .school.id
                    }
                    mono
                  />
                </DetailSection>

                <DetailSection
                  icon={Package}
                  title="Product"
                >
                  <DetailField
                    label="Product Name"
                    value={
                      subscription
                        .product.name
                    }
                  />

                  <DetailField
                    label="Product Code"
                    value={
                      subscription
                        .product.code
                    }
                  />

                  <DetailField
                    label="Product ID"
                    value={
                      subscription
                        .product.id
                    }
                    mono
                  />
                </DetailSection>

                <DetailSection
                  icon={ReceiptText}
                  title="Plan"
                >
                  <DetailField
                    label="Plan Name"
                    value={
                      subscription
                        .plan.name
                    }
                  />

                  <DetailField
                    label="Plan Code"
                    value={
                      subscription
                        .plan.code
                    }
                  />

                  <DetailField
                    label="Billing Cycle"
                    value={formatBillingCycle(
                      subscription
                        .plan
                        .billing_cycle,
                    )}
                  />

                  <DetailField
                    label="Price"
                    value={formatMoney(
                      subscription
                        .plan.price,
                      subscription
                        .plan.currency,
                    )}
                  />

                  <DetailField
                    label="Plan ID"
                    value={
                      subscription
                        .plan.id
                    }
                    mono
                  />
                </DetailSection>

                <DetailSection
                  icon={CalendarDays}
                  title="Subscription Period"
                >
                  <DetailField
                    label="Start Date"
                    value={formatDate(
                      subscription
                        .start_date,
                    )}
                  />

                  <DetailField
                    label="End Date"
                    value={formatDate(
                      subscription
                        .end_date,
                    )}
                  />

                  <DetailField
                    label="Status"
                    value={
                      subscription.status
                    }
                  />

                  <DetailField
                    label="Subscription ID"
                    value={
                      subscription.id
                    }
                    mono
                  />
                </DetailSection>
              </div>

              <DetailSection
                icon={Clock3}
                title="Metadata"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <DetailField
                    label="Created At"
                    value={formatDateTime(
                      subscription
                        .created_at,
                    )}
                  />

                  <DetailField
                    label="Updated At"
                    value={formatDateTime(
                      subscription
                        .updated_at,
                    )}
                  />
                </div>
              </DetailSection>
            </div>
          </div>
        )}
    </BaseDialog>
  );
}



type Subscription =
  NonNullable<
    ReturnType<
      typeof useSubscription
    >["data"]
  >;

function SubscriptionHeader({
  subscription,
}: {
  subscription: Subscription;
}) {
  const active =
    subscription.status ===
    "ACTIVE";

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-lg font-semibold tracking-tight">
            {
              subscription
                .school.name
            }
          </h2>

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
                : subscription.status}
            </span>
          </div>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          {
            subscription
              .product.name
          }
          {" · "}
          {
            subscription
              .plan.name
          }
        </p>
      </div>

      <div className="shrink-0 sm:text-right">
        <div className="text-xl font-semibold tracking-tight">
          {formatMoney(
            subscription.plan.price,
            subscription
              .plan.currency,
          )}
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          {formatBillingCycle(
            subscription
              .plan
              .billing_cycle,
          )}
        </div>
      </div>
    </div>
  );
}


import type {
    LucideIcon,
  } from "lucide-react";
  
  function DetailSection({
    icon: Icon,
    title,
    children,
  }: {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </div>
  
          <h3 className="text-sm font-semibold">
            {title}
          </h3>
        </div>
  
        <div className="space-y-4">
          {children}
        </div>
      </section>
    );
  }


  function DetailField({
    label,
    value,
    mono = false,
  }: {
    label: string;
    value: React.ReactNode;
    mono?: boolean;
  }) {
    return (
      <div>
        <div className="text-xs text-muted-foreground">
          {label}
        </div>
  
        <div
          className={
            mono
              ? "mt-1 break-all font-mono text-xs text-foreground/75"
              : "mt-1 text-sm font-medium"
          }
        >
          {value || "—"}
        </div>
      </div>
    );
  }


  function SubscriptionDetailLoading() {
    return (
      <div className="space-y-8 py-2">
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
  
        <div className="grid gap-8 lg:grid-cols-2">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="space-y-4"
            >
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
  
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
  
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
  
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  function SubscriptionDetailError({
    message,
  }: {
    message: string;
  }) {
    return (
      <div className="rounded-xl bg-destructive/5 p-6">
        <p className="text-sm font-medium text-destructive">
          Unable to load subscription
        </p>
  
        <p className="mt-1 text-xs text-muted-foreground">
          {message}
        </p>
      </div>
    );
  }


  function formatBillingCycle(
    cycle: string,
  ) {
    switch (cycle) {
      case "MONTHLY":
        return "Monthly";
  
      case "YEARLY":
        return "Yearly";
  
      default:
        return cycle;
    }
  }
  
  function formatMoney(
    price: string,
    currency: string,
  ) {
    const amount =
      Number(price);
  
    if (
      !Number.isFinite(amount)
    ) {
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
  
  function formatDate(
    value: string,
  ) {
    const date = new Date(
      `${value}T00:00:00`,
    );
  
    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return value;
    }
  
    return new Intl.DateTimeFormat(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    ).format(date);
  }
  
  function formatDateTime(
    value: string,
  ) {
    const date =
      new Date(value);
  
    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return value;
    }
  
    return new Intl.DateTimeFormat(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    ).format(date);
  }