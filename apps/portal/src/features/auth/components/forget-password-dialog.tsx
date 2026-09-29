"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ForgotPasswordDialog({
  open,
  onOpenChange,
}: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleClose() {
    onOpenChange(false);

    // Reset when dialog closes.
    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
      setIsSubmitting(false);
    }, 200);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setIsSubmitting(true);

    /*
     * TODO:
     * Connect this to:
     *
     * POST /auth/forgot-password
     *
     * For now we simulate a successful request.
     */
    await new Promise((resolve) =>
      setTimeout(resolve, 800),
    );

    setIsSubmitting(false);
    setSubmitted(true);
  }

  function handleBack() {
    setSubmitted(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
        } else {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <>
            <DialogHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-muted">
                <Mail className="size-5" />
              </div>

              <DialogTitle>
                Forgot your password?
              </DialogTitle>

              <DialogDescription>
                Enter the email address associated with
                your Klugance account and we'll send you
                a password reset link.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="forgot-password-email">
                  Email address
                </Label>

                <Input
                  id="forgot-password-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  required
                />
              </div>

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
                  disabled={
                    isSubmitting || !email.trim()
                  }
                >
                  {isSubmitting
                    ? "Sending..."
                    : "Send reset link"}
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

              <DialogTitle>
                Check your email
              </DialogTitle>

              <DialogDescription>
                If an account exists for this email
                address, we've sent a password reset link.
                Please check your inbox and follow the
                instructions.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>

              <Button
                type="button"
                onClick={handleClose}
              >
                OK
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}