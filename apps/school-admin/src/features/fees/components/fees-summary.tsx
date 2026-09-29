import type { FeeSummary } from "../types";

type Props = {
  summary: FeeSummary;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FeesSummary({
  summary,
}: Props) {
  const cards = [
    {
      label: "Total Fees",
      value: formatCurrency(summary.total_fee),
      description: "Expected for current period",
    },
    {
      label: "Collected",
      value: formatCurrency(summary.collected),
      description: `${summary.collection_percentage}% collected`,
    },
    {
      label: "Outstanding",
      value: formatCurrency(summary.outstanding),
      description: `${100 - summary.collection_percentage}% remaining`,
    },
    {
      label: "Overdue",
      value: formatCurrency(summary.overdue),
      description: `${summary.overdue_students} students`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border bg-card p-5 shadow-sm"
        >
          <p className="text-sm text-muted-foreground">
            {card.label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
            {card.value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}