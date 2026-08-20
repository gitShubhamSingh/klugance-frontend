import {
    GraduationCap,
  } from "lucide-react";
  
  import type {
    SubscriptionSchool,
  } from "../../types";
  
  interface SubscriptionSchoolCellProps {
    school: SubscriptionSchool;
  }
  
  export function SubscriptionSchoolCell({
    school,
  }: SubscriptionSchoolCellProps) {
    return (
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <GraduationCap className="size-4 text-muted-foreground" />
        </div>
  
        <div className="min-w-0">

          <div className="max-w-[220px] text-sm font-medium">
            {school.name}
          </div>
  
            
        </div>
      </div>
    );
  }