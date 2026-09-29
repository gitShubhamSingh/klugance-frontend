import type { Homework } from "../types";

type Props = {
  homework: Homework[];
};

export function HomeworkOverview({
  homework,
}: Props) {
  const total = homework.length;

  const active = homework.filter(
    (item) => item.status === "active",
  ).length;

  const dueSoon = homework.filter(
    (item) => item.status === "due_soon",
  ).length;

  const overdue = homework.filter(
    (item) => item.status === "overdue",
  ).length;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <OverviewItem
        label="Total Homework"
        value={total}
      />

      <OverviewItem
        label="Active"
        value={active}
      />

      <OverviewItem
        label="Due Soon"
        value={dueSoon}
      />

      <OverviewItem
        label="Overdue"
        value={overdue}
      />
    </div>
  );
}

function OverviewItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-card px-5 py-4">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}