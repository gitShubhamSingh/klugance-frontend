import type { ReactNode } from "react";

import { PortalShell } from "@/components/layout/portal-shell";

type Props = {
  children: ReactNode;
};

export default function PortalLayout({
  children,
}: Props) {
  return <PortalShell>{children}</PortalShell>;
}
