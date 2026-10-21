
"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/core/auth/api/auth.api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function getApiError(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as {
      response?: { data?: { detail?: unknown; message?: unknown } };
    }).response;

    const message = response?.data?.detail ?? response?.data?.message;

    if (typeof message === "string") return message;
  }

  return error instanceof Error
    ? error.message
    : "Unable to request a password reset. Please try again.";
}

export function ForgotPasswordDialog({ open, onOpenChange }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    if (isSubmitting) return;

    onOpenChange(false);
    setEmail("");
    setSubmitted(false);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();
    if (!normalizedEmail || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      await authApi.requestPasswordReset(normalizedEmail);
      setSubmitted(true);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <>
            <DialogHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-muted">
                <Mail className="size-5" />
              </div>
              <DialogTitle>Forgot your password?</DialogTitle>
              <DialogDescription>
                Enter your account email address. If an account exists,
                we&apos;ll send you a password reset link.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="forgot-password-email">Email address</Label>
                <Input
                  id="forgot-password-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  maxLength={254}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-muted">
                <CheckCircle2 className="size-5" />
              </div>
              <DialogTitle>Check your email</DialogTitle>
              <DialogDescription>
                If an account exists for this email address, password reset
                instructions have been sent. Check your inbox and follow the link.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setSubmitted(false);
                setError("");
              }}>
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
              <Button type="button" onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
