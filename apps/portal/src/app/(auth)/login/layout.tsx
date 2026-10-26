import type { ReactNode } from "react";

import { GuestRoute } from "@/core/auth/components/guest-route";

/** The login page is only for signed-out users. */
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <GuestRoute>{children}</GuestRoute>;
}
