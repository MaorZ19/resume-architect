"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Link as LinkIcon, FileText, Sparkles, Loader2 } from "lucide-react";
import { useWizardStore } from "@/stores/wizardStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StepJobInput() {
  const {
    jobDescription,
    setJobDescriptionSource,
    setJobDescriptionUrl,
    setJobDescriptionText,
    setJobDescriptionLoading,
    nextStep,
    canProceedToStep,
  } = useWizardStore();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSourceChange = (source: "url" | "text") => {
    setJobDescriptionSource(source);
  };

  const handleContinue = async () => {
    if (jobDescription.source === "url" && jobDescription.url) {
      // TODO: Trigger n8n workflow to scrape URL
      setIsProcessing(true);
      setJobDescriptionLoading(true);

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setJobDescriptionLoading(false);
      setIsProcessing(false);
    }

    nextStep();
  };

  const canContinue = canProceedToStep(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
        >
          <Sparkles className="w-4 h-4" />
          Step 1 of 5
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900">
          Paste the Job Description
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Enter the job posting URL or paste the full job description text.
          Our AI will analyze the requirements and keywords.
        </p>
      </div>

      {/* Source Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          variant={jobDescription.source === "url" ? "default" : "outline"}
          onClick={() => handleSourceChange("url")}
          className="gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          Paste URL
        </Button>
        <Button
          variant={jobDescription.source === "text" ? "default" : "outline"}
          onClick={() => handleSourceChange("text")}
          className="gap-2"
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </Button>
      </div>

      {/* Input Card */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">
            {jobDescription.source === "url"
              ? "Job Posting URL"
              : "Job Description Text"}
          </CardTitle>
          <CardDescription>
            {jobDescription.source === "url"
              ? "Works with LinkedIn, Indeed, Glassdoor, and most job boards"
              : "Copy and paste the complete job description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobDescription.source === "url" ? (
            <Input
              type="url"
              placeholder="https://www.linkedin.com/jobs/view/..."
              value={jobDescription.url || ""}
              onChange={(e) => setJobDescriptionUrl(e.target.value)}
              className="h-12"
            />
          ) : (
            <Textarea
              placeholder="Paste the full job description here...

Example:
We are looking for a Senior Software Engineer with 5+ years of experience in React and Node.js..."
              value={jobDescription.rawText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              className="min-h-[300px] text-base leading-relaxed"
            />
          )}

          {/* Character count for text input */}
          {jobDescription.source === "text" && (
            <div className="flex justify-between text-sm">
              <span
                className={cn(
                  "text-slate-400",
                  jobDescription.rawText.length > 50 && "text-green-600"
                )}
              >
                {jobDescription.rawText.length > 50 ? (
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Looking good!
                  </span>
                ) : (
                  "Minimum 50 characters"
                )}
              </span>
              <span className="text-slate-400">
                {jobDescription.rawText.length} characters
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button
          size="xl"
          variant="gradient"
          onClick={handleContinue}
          disabled={!canContinue || isProcessing}
          className="min-w-[200px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 rounded-xl bg-slate-100/80 text-sm text-slate-600">
        <p className="font-medium text-slate-700 mb-2">Tips for best results:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Include the complete job description, not just highlights</li>
          <li>Make sure requirements and qualifications are included</li>
          <li>The more detail, the better our AI can tailor your resume</li>
        </ul>
      </div>
    </div>
  );
}
