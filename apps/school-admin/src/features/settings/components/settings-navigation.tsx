"use client";

import {
  CreditCard,
  HelpCircle,
  LockKeyhole,
  MessageSquareText,
  Settings2,
} from "lucide-react";

type SettingsSection =
  | "overview"
  | "security"
  | "billing"
  | "support"
  | "feedback";

type Props = {
  section: SettingsSection;
  onSectionChange: (
    section: SettingsSection,
  ) => void;
};

const items: {
  id: SettingsSection;
  label: string;
  description: string;
  icon: typeof Settings2;
}[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Account summary",
    icon: Settings2,
  },
  {
    id: "security",
    label: "Security",
    description: "Password & access",
    icon: LockKeyhole,
  },
  {
    id: "billing",
    label: "Billing",
    description: "Payments & invoices",
    icon: CreditCard,
  },
  {
    id: "support",
    label: "Support",
    description: "Get assistance",
    icon: HelpCircle,
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Share your thoughts",
    icon: MessageSquareText,
  },
];

export function SettingsNavigation({
  section,
  onSectionChange,
}: Props) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;

        const active =
          section === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              onSectionChange(item.id)
            }
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
              active
                ? "bg-muted"
                : "hover:bg-muted/60",
            ].join(" ")}
          >
            <div
              className={[
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                active
                  ? "bg-background"
                  : "bg-muted/60",
              ].join(" ")}
            >
              <Icon className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium">
                {item.label}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </nav>
  );
}