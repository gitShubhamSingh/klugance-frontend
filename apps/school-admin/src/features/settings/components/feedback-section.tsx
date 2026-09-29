"use client";

import {
  Bug,
  Lightbulb,
  MessageSquareText,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeedbackSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <MessageSquareText className="size-5" />
            </div>

            <div>
              <CardTitle>
                Give Feedback
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Help us improve Klugance for your school.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <FeedbackType
              icon={Lightbulb}
              title="Feature Request"
              description="Suggest something new."
            />

            <FeedbackType
              icon={Bug}
              title="Report a Problem"
              description="Tell us what isn't working."
            />
          </div>

          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium">
              Your Feedback
            </label>

            <Textarea
              placeholder="Tell us what you think..."
              className="min-h-32 resize-none"
            />
          </div>

          <Button className="mt-4">
            <Send className="mr-2 size-4" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function FeedbackType({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Lightbulb;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted/50"
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4" />
      </div>

      <div>
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </button>
  );
}