"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "./login-form";

import {ForgotPasswordDialog} from "./forget-password-dialog"

export function LoginCard() {
  const [forgotPasswordOpen, setForgotPasswordOpen] =
    useState(false);

  return (
    <>
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl">
            Welcome Back
          </CardTitle>

          <CardDescription>
            Sign in to continue to your Klugance School admin Portal.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <LoginForm />

          <div className="text-right">
            <button
              type="button"
              onClick={() =>
                setForgotPasswordOpen(true)
              }
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </CardContent>
      </Card>

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </>
  );
}