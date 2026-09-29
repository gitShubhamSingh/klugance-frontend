"use client";

import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SettingsSection =
  | "overview"
  | "security"
  | "billing"
  | "support"
  | "feedback";

type Props = {
  onNavigate: (
    section: SettingsSection,
  ) => void;
};

export function SettingsOverview({
  onNavigate,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Current Subscription</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Your school's current Klugance subscription.
              </p>
            </div>

            <Badge
              variant="secondary"
              className="w-fit rounded-full"
            >
              <CheckCircle2 className="mr-1.5 size-3.5" />
              Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Info
              label="Plan"
              value="Professional"
            />

            <Info
              label="Billing"
              value="₹24,999 / year"
            />

            <Info
              label="Next Payment"
              value="01 Jun 2027"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              onClick={() =>
                onNavigate("billing")
              }
            >
              Manage Billing
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>

          <p className="text-sm text-muted-foreground">
            Keep your school administrator account secure.
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <ShieldCheck className="size-5" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Account security
                </p>

                <p className="text-xs text-muted-foreground">
                  Password last changed 42 days ago.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() =>
                onNavigate("security")
              }
            >
              <LockKeyhole className="mr-2 size-4" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard
          icon={CreditCard}
          title="Payments"
          description="Manage payments, invoices and billing."
          onClick={() =>
            onNavigate("billing")
          }
        />

        <ActionCard
          icon={MessageSquareText}
          title="Contact Support"
          description="Get help from the Klugance support team."
          onClick={() =>
            onNavigate("support")
          }
        />

        <ActionCard
          icon={MessageSquareText}
          title="Give Feedback"
          description="Help us improve the school platform."
          onClick={() =>
            onNavigate("feedback")
          }
        />
      </div>
    </div>
  );
}

function Info({
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

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof CreditCard;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
        <Icon className="size-5" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="font-semibold">
          {title}
        </p>

        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>
    </button>
  );
}