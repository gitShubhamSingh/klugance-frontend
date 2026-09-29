"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CollectionPoint } from "../types";

type Props = {
  data: CollectionPoint[];
};

function formatCurrency(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function FeesCollectionChart({
  data,
}: Props) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">
            Collection Overview
          </h2>

          <p className="text-sm text-muted-foreground">
            Daily fee collection for August 2026.
          </p>
        </div>

        <div className="text-sm font-medium text-muted-foreground">
          This Month
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                `₹${value / 1000}k`
              }
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value))
              }
            />

            <Area
              type="monotone"
              dataKey="amount"
              fill="currentColor"
              fillOpacity={0.08}
              stroke="currentColor"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}