"use client";

import { IndianRupee, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  onCollectPayment: () => void;
};

export function FeesHeader({
  onCollectPayment,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <IndianRupee className="size-5 text-muted-foreground" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Fees
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage student fees, collections and outstanding dues.
          </p>
        </div>
      </div>

      <Button onClick={onCollectPayment}>
        <Plus className="mr-2 size-4" />
        Collect Payment
      </Button>
    </div>
  );
}