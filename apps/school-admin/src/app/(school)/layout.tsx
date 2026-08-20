import type { ReactNode } from "react";

import { AppShell } from "./_components/app-shell";

type Props = {
  children: ReactNode;
};

export default function SchoolLayout({
  children,
}: Props) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}