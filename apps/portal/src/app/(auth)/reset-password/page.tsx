
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResetPasswordPage } from "@/features/auth/pages/reset-password-page";

function ResetPasswordRoute() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  return <ResetPasswordPage token={token} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </main>
      }
    >
      <ResetPasswordRoute />
    </Suspense>
  );
}
