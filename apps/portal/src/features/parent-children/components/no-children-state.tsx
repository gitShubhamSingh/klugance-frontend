import { AlertCircle, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

export function NoChildrenState() {
  return (
    <div className="rounded-2xl border border-dashed p-10 text-center">
      <UsersRound className="mx-auto size-7 text-muted-foreground" />
      <h2 className="mt-3 font-semibold">No students linked yet</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Ask the school office to link your child to your account.
      </p>
    </div>
  );
}

export function LoadErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
      <AlertCircle className="size-7 text-destructive" />
      <h2 className="mt-3 font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
