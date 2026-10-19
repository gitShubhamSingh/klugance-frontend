
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/core/auth/api/auth.api";
import { getErrorMessage } from "@/core/api/get-error-message";

type Props = {
  token: string;
};

export function ResetPasswordPage({ token }: Props) {
  const validToken = token.trim().length >= 32;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (validToken) {
      // Keep the token in component state/props but remove it from the address bar.
      window.history.replaceState(null, "", "/reset-password");
    }
  }, [validToken]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    if (!validToken) {
      setError("This password reset link is invalid. Please request a new one.");
      return;
    }

    if (password.length < 12 || password.length > 128) {
      setError("Your password must contain between 12 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.confirmPasswordReset(token, password);
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="space-y-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <KeyRound className="size-6" />
          </div>

          <CardTitle className="text-2xl">
            {success
              ? "Password updated"
              : !validToken
                ? "Invalid reset link"
                : "Create a new password"}
          </CardTitle>

          <CardDescription>
            {success
              ? "Your password has been reset successfully. Please sign in using your new password."
              : !validToken
                ? "This link is missing or invalid. Request a new password reset link to continue."
                : "Choose a strong password for your Klugance account."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success || !validToken ? (
            <div className="space-y-4">
              {!success && (
                <p className="text-sm text-muted-foreground">
                  Reset links expire after 20 minutes and can only be used once.
                </p>
              )}

              <Button className="w-full">
                <Link href="/login">
                  {success ? "Back to sign in" : "Go to sign in"}
                </Link>
              </Button>

              {!success && (
                <p className="text-center text-sm text-muted-foreground">
                  Open the Forgot password option on the sign-in page to request a new link.
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>

                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    className="pr-11"
                    minLength={12}
                    maxLength={128}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Use between 12 and 128 characters.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>

                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter new password"
                    className="pr-11"
                    minLength={12}
                    maxLength={128}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmation password"
                        : "Show confirmation password"
                    }
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isSubmitting ||
                  password.length < 12 ||
                  password.length > 128 ||
                  confirmPassword.length < 12 ||
                  confirmPassword.length > 128
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
