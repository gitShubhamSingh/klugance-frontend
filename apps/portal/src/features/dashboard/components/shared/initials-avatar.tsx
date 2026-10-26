import { cn } from "@/lib/utils";

import { getInitials } from "../../lib/dashboard-utils";
import { toneStyles, type Tone } from "../../lib/tones";

type Props = {
  name: string;
  tone?: Tone;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-20 text-2xl",
};

export function InitialsAvatar({
  name,
  tone,
  size = "md",
  className,
}: Props) {
  const style = tone ? toneStyles[tone] : null;

  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        sizes[size],
        style ? [style.soft, style.text] : "bg-muted text-foreground",
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
