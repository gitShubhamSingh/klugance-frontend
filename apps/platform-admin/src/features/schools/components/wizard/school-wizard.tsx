"use client";

import { useState } from "react";

import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { WizardHeader } from "./wizard-header";
import { SchoolStep } from "./school-step";
import { OwnerStep } from "./owner-step";
import { PrincipalStep } from "./principal-step";

import { CreateSchoolFormValues } from "../../schemas/create-school.schema";
import { z } from "zod";

import { schoolSchema } from "../../schemas/school-schema";
import { ownerSchema } from "../../schemas/owner.schema";

import { AnimatePresence, motion } from "framer-motion";

interface Props {
  form: UseFormReturn<CreateSchoolFormValues>;

  loading: boolean;

  onSubmit: () => void;

  onCancel: () => void;
}

export function SchoolWizard({
  form,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const [step, setStep] = useState(0);

  const isFirstStep = step === 0;
  const isLastStep = step === 2;

  async function handleNext() {
    let fields: string[] = [];
  
    switch (step) {
      case 0:
        fields = [
          "school.name",
          "school.code",
          "school.email",
          "school.mobile_number",
          "school.website",
          "school.address",
          "school.description",
        ];
        break;
  
      case 1:
        fields = [
          "owner.first_name",
          "owner.middle_name",
          "owner.last_name",
          "owner.email",
          "owner.mobile_number",
          "owner.password",
        ];
        break;
    }
  
    const valid = await form.trigger(fields as never, {
      shouldFocus: true,
    });
  
    if (!valid) return;
  
    setStep((prev) => prev + 1);
  }

  function handleBack() {
    setStep((prev) => prev - 1);
  }

  return (
    <>
      <WizardHeader currentStep={step} />

      <div className="py-2">
        {step === 0 && (
          <SchoolStep form={form} />
        )}

        {step === 1 && (
          <OwnerStep form={form} />
        )}

        {step === 2 && (
          <PrincipalStep form={form} />
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => {
            if (isFirstStep) {
              onCancel();
            } else {
              handleBack();
            }
          }}
        >
          {isFirstStep ? "Cancel" : "Back"}
        </Button>

        {!isLastStep ? (
          <Button
            type="button"
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
            <Button
            type="button"
            disabled={loading}
            onClick={async () => {
              const valid = await form.trigger("principal");
          
              if (!valid) {
                return;
              }
          
              onSubmit();
            }}
          >
            {loading
              ? "Creating..."
              : "Create School"}
          </Button>
        )}
      </div>
    </>
  );
}