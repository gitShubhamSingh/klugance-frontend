
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/core/auth/api/auth.api";
import { sessionService } from "@/core/auth/session/session.service";

type ApiError = {
  detail?: string;
  message?: string;
};

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const response = error.response?.data;

    if (typeof response?.detail === "string") {
      return response.detail;
    }

    if (typeof response?.message === "string") {
      return response.message;
    }

    if (error.response?.status === 401) {
      return "Your session has expired. Please sign in again.";
    }

    if (error.response?.status === 429) {
      return "Too many attempts. Please wait before trying again.";
    }

    if (!error.response) {
      return "Unable to reach the server. Please try again.";
    }
  }

  return "Unable to change your password. Please try again.";
}

export function AccountSecurity() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 12) {
      setErrorMessage("Your new password must contain at least 12 characters.");
      return;
    }

    if (newPassword.length > 128) {
      setErrorMessage("Your new password must not exceed 128 characters.");
      return;
    }

    if (new TextEncoder().encode(newPassword).length > 72) {
      setErrorMessage(
        "Your new password must not exceed 72 UTF-8 bytes.",
      );
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setErrorMessage("Include at least one uppercase letter.");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setErrorMessage("Include at least one number.");
      return;
    }

    if (!/[^a-zA-Z0-9]/.test(newPassword)) {
      setErrorMessage("Include at least one special character.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage(
        "Your new password must differ from your current password.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success(response.message);

      // The backend increments token_version, so old tokens are revoked.
      // Always clear the local session and require a fresh login.
      try {
        await sessionService.logout();
      } catch {
        sessionService.clear();
      }

      router.replace("/login");
    } catch (error) {
      const message = getApiErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <LockKeyhole className="size-5" />
            </div>

            <div>
              <CardTitle>Change Password</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your administrator account password.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="max-w-xl space-y-5"
            noValidate
          >
            <PasswordField
              name="current-password"
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
              show={showCurrent}
              onToggle={() => setShowCurrent((value) => !value)}
            />

            <PasswordField
              name="new-password"
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              show={showNew}
              onToggle={() => setShowNew((value) => !value)}
            />

            <PasswordField
              name="confirm-password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              show={showConfirm}
              onToggle={() => setShowConfirm((value) => !value)}
            />

            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />

                <div>
                  <p className="text-sm font-medium">
                    Password requirements
                  </p>

                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <li>• At least 12 characters</li>
                    <li>• At least one uppercase letter</li>
                    <li>• At least one number</li>
                    <li>• At least one special character</li>
                  </ul>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function PasswordField({
  name,
  label,
  value,
  onChange,
  autoComplete,
  show,
  onToggle,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <Input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required
          maxLength={128}
          className="pr-10"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
          aria-pressed={show}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
