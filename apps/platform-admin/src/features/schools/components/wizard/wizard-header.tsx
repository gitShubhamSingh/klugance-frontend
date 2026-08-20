"use client";

import { Check } from "lucide-react";

const steps = [
  "School",
  "Owner",
  "Principal",
];

interface Props {
  currentStep: number;
}

export function WizardHeader({
  currentStep,
}: Props) {
    return (
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-8">
            {steps.map((step, index) => {
              const completed = index < currentStep;
              const active = index === currentStep;
      
              return (
                <div
                  key={step}
                  className="flex items-center"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={[
                        "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all",
      
                        completed &&
                          "border-primary bg-primary text-primary-foreground",
      
                        active &&
                          "border-primary bg-primary text-primary-foreground",
      
                        !completed &&
                          !active &&
                          "bg-muted",
                      ].join(" ")}
                    >
                      {completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
      
                    <span className="mt-2 text-xs font-medium whitespace-nowrap">
                      {step}
                    </span>
                  </div>
      
                  {index !== steps.length - 1 && (
                    <div
                      className={[
                        "mx-6 h-[2px] w-24",
      
                        completed
                          ? "bg-primary"
                          : "bg-border",
                      ].join(" ")}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }