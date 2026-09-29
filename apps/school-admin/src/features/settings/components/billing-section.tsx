"use client";

import {
  ArrowUpRight,
  CreditCard,
  Download,
  Receipt,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const invoices = [
  {
    id: "INV-2026-00124",
    date: "01 Jun 2026",
    amount: "₹24,999",
    status: "Paid",
  },
  {
    id: "INV-2025-00118",
    date: "01 Jun 2025",
    amount: "₹22,999",
    status: "Paid",
  },
  {
    id: "INV-2024-00097",
    date: "01 Jun 2024",
    amount: "₹19,999",
    status: "Paid",
  },
];

export function BillingSection() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>
            Subscription & Billing
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Manage your school's subscription and payments.
          </p>
        </CardHeader>

        <CardContent>
          <div className="rounded-2xl border bg-muted/20 p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">
                    Professional
                  </p>

                  <Badge className="rounded-full">
                    Active
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Annual subscription
                </p>
              </div>

              <div className="text-left lg:text-right">
                <p className="text-2xl font-bold">
                  ₹24,999
                </p>

                <p className="text-xs text-muted-foreground">
                  per year
                </p>
              </div>

              <Button>
                Make Payment
                <ArrowUpRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <BillingStat
              label="Next Billing"
              value="01 Jun 2027"
            />

            <BillingStat
              label="Students"
              value="842 / 1,000"
            />

            <BillingStat
              label="Payment Method"
              value="•••• 4242"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>
                Payment Methods
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Payment methods used for subscription billing.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
            >
              Add Method
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <CreditCard className="size-5" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Visa ending in 4242
                </p>

                <p className="text-xs text-muted-foreground">
                  Expires 08/29
                </p>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="rounded-full"
            >
              Default
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <CardTitle>
            Billing History
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            View and download your previous invoices.
          </p>
        </CardHeader>

        <CardContent>
          <div className="divide-y rounded-xl border">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <Receipt className="size-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {invoice.id}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {invoice.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {invoice.amount}
                    </p>

                    <Badge
                      variant="secondary"
                      className="rounded-full"
                    >
                      {invoice.status}
                    </Badge>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                  >
                    <Download className="size-4" />

                    <span className="sr-only">
                      Download invoice
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BillingStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/40 px-4 py-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}