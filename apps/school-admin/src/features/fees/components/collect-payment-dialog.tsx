"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  FeeStudent,
  PaymentMethod,
} from "../types";

type Props = {
  student: FeeStudent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CollectPaymentDialog({
  student,
  open,
  onOpenChange,
}: Props) {
  const [amount, setAmount] = useState("");

  if (!student) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Collect Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="font-medium">
              {student.first_name}{" "}
              {student.last_name}
            </p>

            <p className="text-sm text-muted-foreground">
              {student.class_name} ·{" "}
              {student.section_name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">
                Outstanding
              </p>

              <p className="mt-1 text-lg font-semibold">
                ₹
                {student.outstanding_amount.toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">
                Due Date
              </p>

              <p className="mt-1 text-sm font-semibold">
                {student.due_date}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="payment-amount"
              className="text-sm font-medium"
            >
              Amount
            </label>

            <Input
              id="payment-amount"
              type="number"
              min={1}
              max={student.outstanding_amount}
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="Enter payment amount"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Payment Method
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(
                [
                  "Cash",
                  "UPI",
                  "Bank Transfer",
                  "Card",
                  "Cheque",
                ] as PaymentMethod[]
              ).map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant="outline"
                  className="h-10"
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              !amount ||
              Number(amount) <= 0 ||
              Number(amount) >
                student.outstanding_amount
            }
            onClick={() => {
              onOpenChange(false);
              setAmount("");
            }}
          >
            Collect Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}