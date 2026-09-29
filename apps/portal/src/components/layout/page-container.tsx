import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({
  children,
  className,
}: Props) {
  return (
    <main
      className={cn(
        "flex-1 p-4 sm:p-6 lg:p-8",
        className,
      )}
    >
      {children}
    </main>
  );
}
