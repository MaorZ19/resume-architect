"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useWizardStore } from "@/stores/wizardStore";
import { WizardProgress } from "./WizardProgress";
import { StepJobInput } from "./StepJobInput";
import { StepResumeUpload } from "./StepResumeUpload";
import { StepAIQuestions } from "./StepAIQuestions";
import { StepReview } from "./StepReview";
import { StepExport } from "./StepExport";

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
} as const;

export function WizardContainer() {
  const { currentStep, canProceedToStep } = useWizardStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepJobInput />;
      case 2:
        return <StepResumeUpload />;
      case 3:
        return <StepAIQuestions />;
      case 4:
        return <StepReview />;
      case 5:
        return <StepExport />;
      default:
        return <StepJobInput />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Progress indicator */}
      <WizardProgress currentStep={currentStep} canProceedToStep={canProceedToStep} />

      {/* Step content */}
      <div className="container mx-auto px-4 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="max-w-4xl mx-auto"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
