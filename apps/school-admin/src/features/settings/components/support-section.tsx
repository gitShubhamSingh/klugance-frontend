"use client";

import {
  BookOpen,
  Headphones,
  MessageCircle,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SupportSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Contact Support
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            We're here to help with technical, account and billing issues.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <SupportCard
              icon={MessageCircle}
              title="Live Chat"
              description="Chat with our support team."
              action="Start Chat"
            />

            <SupportCard
              icon={Phone}
              title="Phone Support"
              description="Talk directly with our support team."
              action="Contact Support"
            />

            <SupportCard
              icon={BookOpen}
              title="Help Center"
              description="Browse guides and documentation."
              action="Open Help Center"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Need to report an issue?
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Create a support ticket and our team will track it for you.
          </p>
        </CardHeader>

        <CardContent>
          <Button>
            <Headphones className="mr-2 size-4" />
            Create Support Ticket
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SupportCard({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof MessageCircle;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
        <Icon className="size-5" />
      </div>

      <p className="mt-4 font-semibold">
        {title}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>

      <Button
        variant="outline"
        size="sm"
        className="mt-4"
      >
        {action}
      </Button>
    </div>
  );
}