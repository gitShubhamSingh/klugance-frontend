"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  LoginForm,
} from "./login-form";

export function LoginCard() {
  return (
    <Card className="w-full max-w-md border-0 shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl">
          Welcome Back
        </CardTitle>

        <CardDescription>
          Sign in to continue to
          School Administration.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}