"use client";

import {
  Settings,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function SettingsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Settings className="size-5 text-muted-foreground" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Settings
          </h1>

          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage your account, subscription, payments and support.
          </p>
        </div>
      </div>

      <Badge
        variant="secondary"
        className="w-fit rounded-full"
      >
        <ShieldCheck className="mr-1.5 size-3.5" />
        School Admin
      </Badge>
    </div>
  );
}