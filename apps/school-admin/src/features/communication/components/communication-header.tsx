"use client";

import {
  Bell,
  Mail,
  MessageSquare,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function CommunicationHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <MessageSquare className="size-5 text-muted-foreground" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Communication
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage announcements, messages, and school
            communication.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Communication notifications"
        >
          <Bell className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
        >
          <Mail className="mr-2 size-4" />
          Templates
        </Button>

        <Button type="button">
          <Plus className="mr-2 size-4" />
          Compose
        </Button>
      </div>
    </div>
  );
}