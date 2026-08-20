import type {
    SubscriptionStatus,
  } from "../../types";
  
  interface StatusCellProps {
    status: SubscriptionStatus;
  }
  
  export function StatusCell({
    status,
  }: StatusCellProps) {
    const active =
      status === "ACTIVE";
  
    return (
      <div className="flex items-center gap-2">
        <span
          className={
            active
              ? "size-2 rounded-full bg-emerald-500"
              : "size-2 rounded-full bg-muted-foreground"
          }
        />
  
        <span className="text-sm">
          {active
            ? "Active"
            : "Inactive"}
        </span>
      </div>
    );
  }