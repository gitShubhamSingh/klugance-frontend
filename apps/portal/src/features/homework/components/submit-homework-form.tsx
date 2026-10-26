"use client";

import { useState } from "react";
import { Link2, Loader2, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { SubmitHomeworkPayload } from "@/features/student/types/student";

/** Answer text and/or a link (e.g. a photo of the work in Drive). */
export function SubmitHomeworkForm({
  initialText,
  initialLink,
  submitLabel,
  submitting,
  error,
  onSubmit,
  onCancel,
}: {
  initialText?: string | null;
  initialLink?: string | null;
  submitLabel: string;
  submitting: boolean;
  error: string | null;
  onSubmit: (payload: SubmitHomeworkPayload) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initialText ?? "");
  const [link, setLink] = useState(initialLink ?? "");

  const trimmedLink = link.trim();
  const linkInvalid = Boolean(trimmedLink) && !/^https?:\/\//i.test(trimmedLink);
  const empty = !text.trim() && !trimmedLink;

  return (
    <form
      className="space-y-3 rounded-xl border bg-muted/30 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (empty || linkInvalid || submitting) return;
        onSubmit({ submission_text: text.trim() || null, attachment_url: trimmedLink || null });
      }}
    >
      <div>
        <label htmlFor="hw-answer" className="text-xs font-medium">
          Answer
        </label>
        <Textarea
          id="hw-answer"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={10000}
          rows={4}
          placeholder="Write the answer, or describe what was done"
          className="mt-1 bg-background"
        />
      </div>
      <div>
        <label htmlFor="hw-link" className="text-xs font-medium">
          Link <span className="font-normal text-muted-foreground">(optional, e.g. a photo in Google Drive)</span>
        </label>
        <div className="relative mt-1">
          <Link2 className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="hw-link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://"
            aria-invalid={linkInvalid || undefined}
            className="bg-background pl-8"
          />
        </div>
        {linkInvalid && <p className="mt-1 text-xs text-destructive">The link must start with http:// or https://</p>}
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={empty || linkInvalid || submitting}>
          {submitting ? <Loader2 className="animate-spin" /> : <SendHorizontal />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
