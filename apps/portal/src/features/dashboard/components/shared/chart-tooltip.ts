import type { CSSProperties } from "react";

/** Recharts tooltip styling that follows the app's popover tokens. */
export const chartTooltipStyle: CSSProperties = {
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  boxShadow: "0 8px 24px -12px rgb(0 0 0 / 0.25)",
};

export const chartTooltipLabelStyle: CSSProperties = {
  color: "var(--popover-foreground)",
  fontWeight: 600,
  marginBottom: 4,
};
