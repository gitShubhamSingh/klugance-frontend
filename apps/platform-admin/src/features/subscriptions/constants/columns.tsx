"use client";

import type {
  ColumnDef,
} from "@tanstack/react-table";

import {
  CalendarDays,
  Eye,
  MoreHorizontal,
  Power,
  Trash2,
} from "lucide-react";

import {
  DataTableColumnHeader,
} from "@/components/common/data-table/data-table-column-header";

import {
  Button,
} from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
  Subscription,
} from "../types";

import {
  SubscriptionSchoolCell,
} from "../components/cells";

export interface SubscriptionColumnActions {
  onView: (
    subscription: Subscription,
  ) => void;

  onStatusChange: (
    subscription: Subscription,
  ) => void;

  onDelete: (
    subscription: Subscription,
  ) => void;
}

export function getSubscriptionColumns({
  onView,
  onStatusChange,
  onDelete,
}: SubscriptionColumnActions): ColumnDef<Subscription>[] {
  return [
    /*
     * SCHOOL + BILLING
     */
    {
      id: "school",

      accessorFn: (row) =>
        row.school.name,

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="School"
        />
      ),

      cell: ({ row }) => (
        <SchoolBillingCell
          subscription={
            row.original
          }
        />
      ),
    },

    /*
     * PRODUCT + PLAN
     */
    {
      id: "productPlan",

      accessorFn: (row) =>
        `${row.product.name} ${row.plan.name}`,

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Product & Plan"
        />
      ),

      cell: ({ row }) => (
        <ProductPlanCell
          subscription={
            row.original
          }
        />
      ),
    },

    /*
     * SUBSCRIPTION PERIOD
     */
    {
      id: "period",

      accessorFn: (row) =>
        row.start_date,

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Period"
        />
      ),

      cell: ({ row }) => (
        <SubscriptionPeriodCell
          subscription={
            row.original
          }
        />
      ),
    },

    /*
     * STATUS
     */
    {
      id: "status",

      accessorFn: (row) =>
        row.is_deleted
          ? "DELETED"
          : row.status,

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      ),

      cell: ({ row }) => (
        <SubscriptionStatusCell
          subscription={
            row.original
          }
        />
      ),
    },

    /*
     * ACTIONS
     */
    {
      id: "actions",

      enableHiding: false,
      enableSorting: false,

      cell: ({ row }) => {
        const subscription =
          row.original;

        const isDeleted =
          subscription.is_deleted;

        const canDeactivate =
          subscription.status ===
          "ACTIVE";

        const canActivate =
          subscription.status ===
          "SUSPENDED";

        const canChangeStatus =
          canDeactivate ||
          canActivate;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                  />
                }
              >
                <MoreHorizontal className="size-4" />

                <span className="sr-only">
                  Open actions
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-44"
              >
                <DropdownMenuItem
                  onClick={() =>
                    onView(
                      subscription,
                    )
                  }
                >
                  <Eye className="size-4" />

                  View
                </DropdownMenuItem>

                {!isDeleted && (
                  <>
                    {canChangeStatus && (
                      <>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(
                              subscription,
                            )
                          }
                        >
                          <Power className="size-4" />

                          {canDeactivate
                            ? "Deactivate"
                            : "Activate"}
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        onDelete(
                          subscription,
                        )
                      }
                    >
                      <Trash2 className="size-4" />

                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}

/*
 * SCHOOL + BILLING
 *
 * School remains the primary entity.
 * Billing is secondary subscription context.
 */
function SchoolBillingCell({
  subscription,
}: {
  subscription: Subscription;
}) {
  const {
    school,
    plan,
  } = subscription;

  return (
    <div className="min-w-[230px]">
      <SubscriptionSchoolCell
        school={school}
      />

      <div className="ml-12 mt-0 flex items-center gap-2">
        <span className="font-mono text-[10px] font-medium text-muted-foreground">
          {formatMoney(
            plan.price,
            plan.currency,
          )}
        </span>

        <span className="text-[10px] text-muted-foreground/40">
          •
        </span>

        <span className="text-[10px] text-muted-foreground">
          {formatBillingShort(
            plan.billing_cycle,
          )}
        </span>
      </div>
    </div>
  );
}

/*
 * PRODUCT + PLAN
 *
 * Product is the parent.
 * Plan is visually nested beneath it.
 */
function ProductPlanCell({
  subscription,
}: {
  subscription: Subscription;
}) {
  const {
    product,
    plan,
  } = subscription;

  return (
    <div className="min-w-[250px]">
      {/* PRODUCT */}
      <div>
        <div
          className="max-w-[260px] truncate text-sm font-medium"
          title={product.name}
        >
          {product.name}
        </div>

       
      </div>

      {/* PLAN */}
      <div className="mt-2 flex items-start gap-2">
        <div className="mt-1 h-5 w-px shrink-0 bg-border" />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-medium">
              {plan.name}
            </span>

            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
              {formatBillingCycle(
                plan.billing_cycle,
              )}
            </span>
          </div>

         
        </div>
      </div>
    </div>
  );
}

/*
 * PERIOD
 *
 * Dates + human readable duration.
 */
function SubscriptionPeriodCell({
  subscription,
}: {
  subscription: Subscription;
}) {
  return (
    <div className="min-w-[155px]">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />

        <span className="whitespace-nowrap text-xs font-medium">
          {formatDate(
            subscription.start_date,
          )}
        </span>
      </div>

      <div className="ml-[22px] mt-1 flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground/60">
          to
        </span>

        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {formatDate(
            subscription.end_date,
          )}
        </span>
      </div>

      <div className="ml-[22px] mt-1 text-[10px] text-muted-foreground/60">
        {formatDuration(
          subscription.start_date,
          subscription.end_date,
        )}
      </div>
    </div>
  );
}

/*
 * STATUS
 */
function SubscriptionStatusCell({
  subscription,
}: {
  subscription: Subscription;
}) {
  if (subscription.is_deleted) {
    return (
      <StatusBadge
        label="Deleted"
        className="bg-destructive/10 text-destructive"
        dotClassName="bg-destructive"
      />
    );
  }

  switch (subscription.status) {
    case "ACTIVE":
      return (
        <StatusBadge
          label="Active"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          dotClassName="bg-emerald-500"
        />
      );

    case "SUSPENDED":
      return (
        <StatusBadge
          label="Suspended"
          className="bg-orange-500/10 text-orange-600 dark:text-orange-400"
          dotClassName="bg-orange-500"
        />
      );

    case "TRIAL":
      return (
        <StatusBadge
          label="Trial"
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          dotClassName="bg-blue-500"
        />
      );

    case "PENDING":
      return (
        <StatusBadge
          label="Pending"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          dotClassName="bg-amber-500"
        />
      );

    case "ON_HOLD":
      return (
        <StatusBadge
          label="On Hold"
          className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
          dotClassName="bg-yellow-500"
        />
      );

    case "PAUSED":
      return (
        <StatusBadge
          label="Paused"
          className="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          dotClassName="bg-violet-500"
        />
      );

    case "EXPIRED":
      return (
        <StatusBadge
          label="Expired"
        />
      );

    case "CANCELLED":
      return (
        <StatusBadge
          label="Cancelled"
          className="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          dotClassName="bg-rose-500"
        />
      );

    case "ARCHIVED":
      return (
        <StatusBadge
          label="Archived"
        />
      );

    default:
      return (
        <StatusBadge
          label={formatStatusLabel(
            subscription.status,
          )}
        />
      );
  }
}

function StatusBadge({
  label,
  className =
    "bg-muted text-muted-foreground",
  dotClassName =
    "bg-muted-foreground",
}: {
  label: string;
  className?: string;
  dotClassName?: string;
}) {
  return (
    <div
      className={[
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "size-1.5 shrink-0 rounded-full",
          dotClassName,
        ].join(" ")}
      />

      {label}
    </div>
  );
}

function formatBillingCycle(
  cycle:
    Subscription["plan"]["billing_cycle"],
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

function formatBillingShort(
  cycle:
    Subscription["plan"]["billing_cycle"],
) {
  switch (cycle) {
    case "MONTHLY":
      return "per month";

    case "YEARLY":
      return "per year";

    default:
      return "per year";
  }
}

function formatMoney(
  price: string,
  currency: string,
) {
  const amount =
    Number(price);

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

function formatDate(
  value: string,
) {
  const date =
    new Date(
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
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatDuration(
  startDate: string,
  endDate: string,
) {
  const start =
    new Date(
      `${startDate}T00:00:00`,
    );

  const end =
    new Date(
      `${endDate}T00:00:00`,
    );

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return "";
  }

  const totalMonths =
    (end.getFullYear() -
      start.getFullYear()) *
      12 +
    (end.getMonth() -
      start.getMonth());

  if (totalMonths >= 12) {
    const years =
      Math.floor(
        totalMonths / 12,
      );

    const months =
      totalMonths % 12;

    if (months === 0) {
      return `${years} ${
        years === 1
          ? "year"
          : "years"
      }`;
    }

    return `${years}y ${months}m`;
  }

  if (totalMonths > 0) {
    return `${totalMonths} ${
      totalMonths === 1
        ? "month"
        : "months"
    }`;
  }

  const days =
    Math.max(
      1,
      Math.round(
        (end.getTime() -
          start.getTime()) /
          86_400_000,
      ),
    );

  return `${days} ${
    days === 1
      ? "day"
      : "days"
  }`;
}

function formatStatusLabel(
  status: string,
) {
  return status
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}