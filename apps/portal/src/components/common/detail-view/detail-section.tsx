"use client";

import { ReactNode } from "react";

interface DetailSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DetailSection({
  title,
  description,
  children,
}: DetailSectionProps) {
  return (
    <section className="p-1">
      {/* <div className="border-b px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div> */}

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}