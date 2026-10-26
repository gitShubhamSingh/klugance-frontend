"use client";

import { useState } from "react";
import { ChevronDown, CircleCheck, Receipt, WalletCards, type LucideIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import { formatCurrency } from "@/features/dashboard/lib/dashboard-utils";
import {
  ChildSwitcher,
  LoadErrorState,
  NoChildrenState,
  childClassLabel,
  childName,
  useSelectedChild,
} from "@/features/parent-children";
import { parseTimestamp } from "@/features/communication/lib/chat-utils";
import { cn } from "@/lib/utils";

import { useParentFees } from "../hooks/use-parent-fees";
import type { ParentFeeInvoice } from "../types/parent-fees";

function formatDate(iso: string) {
  return parseTimestamp(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function ParentFeesPage() {
  const { childrenQuery, children, child, setChildId } = useSelectedChild();
  const feesQuery = useParentFees(child?.student_profile_id ?? null);
  const data = feesQuery.data;

  return (
    <PageContainer>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fees</h1>
            <p className="mt-2 text-muted-foreground">
              {child ? `Invoices and payments for ${childName(child)} · ${childClassLabel(child)}` : "Invoices and payments"}
            </p>
          </div>
          <ChildSwitcher options={children} value={child?.student_profile_id ?? null} onChange={setChildId} />
        </div>

        {childrenQuery.isLoading || (child && feesQuery.isLoading) ? (
          <div className="space-y-4" role="status" aria-label="Loading fees">
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        ) : childrenQuery.isError ? (
          <LoadErrorState
            title="Unable to load your children"
            message={getErrorMessage(childrenQuery.error)}
            onRetry={() => void childrenQuery.refetch()}
          />
        ) : !child ? (
          <NoChildrenState />
        ) : feesQuery.isError || !data ? (
          <LoadErrorState
            title="Unable to load fees"
            message={getErrorMessage(feesQuery.error)}
            onRetry={() => void feesQuery.refetch()}
          />
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <Stat icon={WalletCards} label="Total billed" value={formatCurrency(data.summary.total_amount)} />
              <Stat icon={CircleCheck} label="Paid" value={formatCurrency(data.summary.paid_amount)} />
              <Stat
                icon={Receipt}
                label="Outstanding"
                value={formatCurrency(data.summary.due_amount)}
                warn={data.summary.due_amount > 0}
              />
            </section>

            {data.invoices.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-10 text-center">
                <Receipt className="mx-auto size-7 text-muted-foreground" />
                <h2 className="mt-3 font-semibold">No invoices yet</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fee invoices appear here once the school issues them.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {[...data.invoices].reverse().map((invoice) => (
                  <InvoiceCard key={invoice.id} invoice={invoice} />
                ))}
              </ul>
            )}

            <p className="rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              Online payment isn&apos;t available yet. Please pay at the school office; payments appear here once
              recorded.
            </p>
          </>
        )}
      </div>
    </PageContainer>
  );
}

function Stat({ icon: Icon, label, value, warn }: { icon: LucideIcon; label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl bg-muted",
            warn && "bg-rose-500/10 text-rose-700 dark:text-rose-300",
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
    </div>
  );
}

function InvoiceCard({ invoice }: { invoice: ParentFeeInvoice }) {
  const [open, setOpen] = useState(invoice.due_amount > 0);
  const paid = invoice.due_amount <= 0;
  const percent = invoice.total_amount ? Math.round((invoice.paid_amount / invoice.total_amount) * 100) : 0;

  return (
    <li className="overflow-hidden rounded-2xl border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/40 sm:p-5"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{invoice.structure_name}</p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-2xs font-medium",
                paid
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
              )}
            >
              {paid ? "Paid" : invoice.paid_amount > 0 ? "Partly paid" : "Due"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {invoice.invoice_number} · Issued {formatDate(invoice.issued_at)}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-semibold tabular-nums">{formatCurrency(invoice.total_amount)}</p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {paid ? "Fully paid" : `${formatCurrency(invoice.due_amount)} due`}
          </p>
        </div>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="grid gap-5 border-t p-4 sm:grid-cols-2 sm:p-5">
          <div>
            <p className="text-sm font-medium">Breakdown</p>
            {invoice.components.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No breakdown available.</p>
            ) : (
              <ul className="mt-2 divide-y rounded-xl border text-sm">
                {invoice.components.map((c, i) => (
                  <li key={`${c.name}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2">
                    <span>
                      {c.name}
                      {c.is_optional && <span className="ml-1.5 text-xs text-muted-foreground">(optional)</span>}
                    </span>
                    <span className="tabular-nums">{formatCurrency(c.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">Payments</p>
            {invoice.payments.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No payments recorded yet.</p>
            ) : (
              <ul className="mt-2 divide-y rounded-xl border text-sm">
                {invoice.payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="min-w-0">
                      <span className="block">{formatDate(p.paid_at)}</span>
                      {p.payment_reference && (
                        <span className="block truncate text-xs text-muted-foreground">Ref. {p.payment_reference}</span>
                      )}
                    </span>
                    <span className="font-medium tabular-nums">{formatCurrency(p.amount_paid)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
