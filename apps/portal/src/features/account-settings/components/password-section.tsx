"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Loader2, LockKeyhole, Mail, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/core/auth/api/auth.api";
import { sessionService } from "@/core/auth/session/session.service";
import { useAuthStore } from "@/core/auth/store/auth.store";
import { cn } from "@/lib/utils";

import { getAccountErrorMessage } from "../lib/api-error";
import { getPasswordLimitError, getPasswordStrength, passwordRules } from "../lib/password-policy";
import { SettingsCard } from "./settings-card";

const strengthColors = ["bg-muted", "bg-rose-500", "bg-amber-500", "bg-emerald-400", "bg-emerald-500"];

export function PasswordSection() {
  const router = useRouter();
  const email = useAuthStore((state) => state.user?.email);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendingReset, setSendingReset] = useState(false);

  const rulesPassed = passwordRules.every((r) => r.test(next));
  const limitError = getPasswordLimitError(next);
  const matches = confirm.length > 0 && next === confirm;
  const sameAsCurrent = next.length > 0 && next === current;
  const strength = getPasswordStrength(next);

  const canSubmit =
    current.length > 0 && rulesPassed && !limitError && matches && !sameAsCurrent && !submitting;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const response = await authApi.changePassword({
        current_password: current,
        new_password: next,
      });

      toast.success(response?.message || "Password changed", {
        description: "For your security, please sign in again with your new password.",
      });

      // The backend revokes existing tokens, so end this session cleanly.
      sessionService.logout();
      router.replace("/login");
    } catch (err) {
      setError(getAccountErrorMessage(err, "Unable to change your password. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  async function sendResetLink() {
    if (!email) return;
    setSendingReset(true);
    try {
      await authApi.requestPasswordReset(email);
      toast.success("Reset link sent", { description: `Check ${email} for instructions.` });
    } catch (err) {
      toast.error(getAccountErrorMessage(err, "Couldn't send the reset link. Please try again."));
    } finally {
      setSendingReset(false);
    }
  }

  return (
    <SettingsCard
      id="password"
      title="Password & security"
      description="Use a strong password you don't use anywhere else."
    >
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_minmax(0,16rem)]" noValidate>
        <div className="space-y-4">
          <PasswordField
            label="Current password"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
          />

          <div>
            <PasswordField
              label="New password"
              value={next}
              onChange={setNext}
              autoComplete="new-password"
              invalid={Boolean(limitError) || sameAsCurrent}
            />
            {next && (
              <div className="mt-2 flex items-center gap-3">
                <div className="flex flex-1 gap-1" aria-hidden>
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors",
                        i <= strength.score ? strengthColors[strength.score] : "bg-muted",
                      )}
                    />
                  ))}
                </div>
                <span className="w-12 text-right text-xs font-medium text-muted-foreground">{strength.label}</span>
              </div>
            )}
            {limitError && <p className="mt-1.5 text-xs text-destructive">{limitError}</p>}
            {sameAsCurrent && (
              <p className="mt-1.5 text-xs text-destructive">Your new password must be different from the current one.</p>
            )}
          </div>

          <div>
            <PasswordField
              label="Confirm new password"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
              invalid={confirm.length > 0 && !matches}
            />
            {confirm.length > 0 && (
              <p
                className={cn(
                  "mt-1.5 flex items-center gap-1 text-xs",
                  matches ? "text-emerald-700 dark:text-emerald-400" : "text-destructive",
                )}
              >
                {matches ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                {matches ? "Passwords match" : "Passwords don't match"}
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={sendResetLink}
              disabled={!email || sendingReset}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
            >
              {sendingReset ? <Loader2 className="size-3.5 animate-spin" /> : <Mail className="size-3.5" />}
              Forgot your current password?
            </button>
            <Button type="submit" disabled={!canSubmit} className="sm:min-w-40">
              {submitting ? <Loader2 className="animate-spin" /> : <LockKeyhole />}
              {submitting ? "Updating…" : "Update password"}
            </Button>
          </div>
        </div>

        {/* Requirements */}
        <aside className="h-fit rounded-xl bg-muted/40 p-4">
          <p className="text-sm font-medium">Your password must have</p>
          <ul className="mt-3 space-y-2">
            {passwordRules.map((rule) => {
              const ok = rule.test(next);
              return (
                <li key={rule.id} className="flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      "flex size-4.5 items-center justify-center rounded-full transition-colors",
                      ok ? "bg-emerald-500 text-white" : "border border-muted-foreground/30",
                    )}
                  >
                    {ok && <Check className="size-3" />}
                  </span>
                  <span className={cn(ok ? "text-foreground" : "text-muted-foreground")}>{rule.label}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            After changing your password you&apos;ll be signed out on all devices.
          </p>
        </aside>
      </form>
    </SettingsCard>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  invalid,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  invalid?: boolean;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={invalid || undefined}
          className="h-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
