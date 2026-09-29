"use client";

import { useState } from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AccountSecurity() {
  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <LockKeyhole className="size-5" />
            </div>

            <div>
              <CardTitle>
                Change Password
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Update your administrator account password.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="max-w-xl space-y-5">
            <PasswordField
              label="Current Password"
              show={showCurrent}
              onToggle={() =>
                setShowCurrent(!showCurrent)
              }
            />

            <PasswordField
              label="New Password"
              show={showNew}
              onToggle={() =>
                setShowNew(!showNew)
              }
            />

            <PasswordField
              label="Confirm New Password"
              show={showConfirm}
              onToggle={() =>
                setShowConfirm(!showConfirm)
              }
            />

            <div className="rounded-xl bg-muted/40 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />

                <div>
                  <p className="text-sm font-medium">
                    Password requirements
                  </p>

                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <li>
                      • At least 8 characters
                    </li>
                    <li>
                      • At least one uppercase letter
                    </li>
                    <li>
                      • At least one number
                    </li>
                    <li>
                      • At least one special character
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Button>
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PasswordField({
  label,
  show,
  onToggle,
}: {
  label: string;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          className="pr-10"
        />

        <button
          type="button"
          onClick={onToggle}
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