import {
    Layers3,
  } from "lucide-react";
  
  import type {
    SubscriptionPlan,
  } from "../../types";
  
  interface SubscriptionPlanCellProps {
    plan: SubscriptionPlan;
  }
  
  export function SubscriptionPlanCell({
    plan,
  }: SubscriptionPlanCellProps) {
    return (
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Layers3 className="size-4 text-muted-foreground" />
        </div>
  
        <div className="min-w-0">
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                className="font-mono text-[5px] leading-tight text-muted-foreground/60 sm:text-[10px] md:text-[11px]"
                title={plan.id}
                >
                {plan.id}
                </span>
            </div>
          <div className="max-w-[220px] truncate text-sm font-medium">
            {plan.name}
          </div>
  
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium">
              {plan.code}
            </span>
  
            <span>•</span>
  
            
          </div>
        </div>
      </div>
    );
  }