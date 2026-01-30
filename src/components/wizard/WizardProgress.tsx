"use client";

import { cn } from "@/lib/utils";
import { Check, FileText, Upload, MessageSquare, Eye, Download } from "lucide-react";
import type { WizardStep } from "@/stores/wizardStore";

interface WizardProgressProps {
  currentStep: WizardStep;
  canProceedToStep: (step: WizardStep) => boolean;
}

const steps = [
  { number: 1, title: "Job Description", icon: FileText },
  { number: 2, title: "Upload Resume", icon: Upload },
  { number: 3, title: "AI Questions", icon: MessageSquare },
  { number: 4, title: "Review", icon: Eye },
  { number: 5, title: "Export", icon: Download },
] as const;

export function WizardProgress({ currentStep, canProceedToStep }: WizardProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isAccessible = canProceedToStep(step.number as WizardStep);
          const Icon = step.icon;

          return (
            <div key={step.number} className="flex items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
                      : isCurrent
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-100"
                      : isAccessible
                      ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      : "bg-slate-100 text-slate-300"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium transition-colors hidden sm:block",
                    isCurrent
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-green-600"
                      : "text-slate-400"
                  )}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 md:w-20 lg:w-28 h-1 mx-2 rounded-full transition-all duration-500",
                    currentStep > step.number
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-slate-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
