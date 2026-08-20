"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { LoginForm } from "./login-form";

export function LoginCard() {
  return (
    <Card className="w-full max-w-md border-0 shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl">
          Welcome Back
        </CardTitle>

        <CardDescription>
          Sign in to continue to Platform Admin.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <LoginForm />

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}