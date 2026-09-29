"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import type { FeeStudent } from "../types";

type Props = {
  student: FeeStudent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getName(student: FeeStudent) {
  return [
    student.first_name,
    student.middle_name,
    student.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

export function FeeDetailsDialog({
  student,
  open,
  onOpenChange,
}: Props) {
  if (!student) {
    return null;
  }

  const percentage =
    student.total_fee > 0
      ? Math.round(
          (student.paid_amount /
            student.total_fee) *
            100,
        )
      : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Student Fee Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">
              {getName(student)}
            </h3>

            <p className="text-sm text-muted-foreground">
              {student.class_name} ·{" "}
              {student.section_name} ·{" "}
              {student.admission_number}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">
                Total
              </p>

              <p className="mt-1 font-semibold">
                {formatCurrency(student.total_fee)}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">
                Paid
              </p>

              <p className="mt-1 font-semibold">
                {formatCurrency(student.paid_amount)}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">
                Due
              </p>

              <p className="mt-1 font-semibold">
                {formatCurrency(
                  student.outstanding_amount,
                )}
              </p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Collection Progress
              </span>

              <span className="font-medium">
                {percentage}%
              </span>
            </div>

            <Progress value={percentage} />
          </div>

          <div>
            <h4 className="mb-3 font-semibold">
              Fee Breakdown
            </h4>

            <div className="divide-y rounded-xl border">
              {student.fee_breakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="text-sm">
                    {item.name}
                  </span>

                  <span className="text-sm font-medium">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">
              Installments
            </h4>

            <div className="space-y-2">
              {student.installments.map(
                (installment) => (
                  <div
                    key={installment.id}
                    className="flex items-center justify-between rounded-xl border px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {installment.due_date}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(
                          installment.amount,
                        )}
                      </p>
                    </div>

                    <Badge
                      variant={
                        installment.status ===
                        "paid"
                          ? "default"
                          : "outline"
                      }
                      className="rounded-full"
                    >
                      {installment.status}
                    </Badge>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}