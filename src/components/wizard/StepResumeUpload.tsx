"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useWizardStore } from "@/stores/wizardStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StepResumeUpload() {
  const {
    resume,
    setResumeSource,
    setResumeFile,
    setResumeText,
    setResumeLoading,
    nextStep,
    prevStep,
    canProceedToStep,
  } = useWizardStore();

  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file && (file.type === "application/pdf" || file.name.endsWith(".pdf"))) {
        setResumeFile(file);
        setResumeSource("file");
      }
    },
    [setResumeFile, setResumeSource]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setResumeSource("file");
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null as unknown as File);
    setResumeSource("file");
  };

  const handleContinue = async () => {
    if (resume.file) {
      setIsProcessing(true);
      setResumeLoading(true);

      // TODO: Upload to Supabase and trigger n8n parsing workflow
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setResumeLoading(false);
      setIsProcessing(false);
    }

    nextStep();
  };

  const canContinue = canProceedToStep(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
        >
          <Upload className="w-4 h-4" />
          Step 2 of 5
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900">
          Upload Your Current Resume
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Upload your existing resume as a PDF, or paste the text directly.
          We&apos;ll analyze it against the job requirements.
        </p>
      </div>

      {/* Source Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          variant={resume.source === "file" ? "default" : "outline"}
          onClick={() => setResumeSource("file")}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
        <Button
          variant={resume.source === "text" ? "default" : "outline"}
          onClick={() => setResumeSource("text")}
          className="gap-2"
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </Button>
      </div>

      {/* Upload/Input Card */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">
            {resume.source === "file" ? "Upload Resume" : "Resume Text"}
          </CardTitle>
          <CardDescription>
            {resume.source === "file"
              ? "Supports PDF files up to 10MB"
              : "Copy and paste your complete resume"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resume.source === "file" ? (
            <>
              {resume.file ? (
                /* File Preview */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl border-2 border-green-200 bg-green-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {resume.fileName}
                      </p>
                      <p className="text-sm text-slate-500">
                        Ready to analyze
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>
              ) : (
                /* Dropzone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "p-12 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
                    isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                  )}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                        isDragActive ? "bg-blue-100" : "bg-slate-100"
                      )}
                    >
                      <Upload
                        className={cn(
                          "w-8 h-8 transition-colors",
                          isDragActive ? "text-blue-600" : "text-slate-400"
                        )}
                      />
                    </div>
                    <p className="text-lg font-medium text-slate-700 mb-1">
                      {isDragActive
                        ? "Drop your resume here"
                        : "Drag & drop your resume"}
                    </p>
                    <p className="text-sm text-slate-500">
                      or click to browse files
                    </p>
                  </label>
                </div>
              )}
            </>
          ) : (
            /* Text Input */
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your complete resume text here...

Example:
John Doe
Senior Software Engineer

EXPERIENCE
Tech Company (2020-Present)
- Led development of microservices architecture
- Improved system performance by 40%
..."
                value={resume.rawText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[350px] text-base leading-relaxed"
              />
              <div className="flex justify-between text-sm">
                <span
                  className={cn(
                    "text-slate-400",
                    resume.rawText.length > 50 && "text-green-600"
                  )}
                >
                  {resume.rawText.length > 50
                    ? "✓ Looking good!"
                    : "Minimum 50 characters"}
                </span>
                <span className="text-slate-400">
                  {resume.rawText.length} characters
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          size="lg"
          variant="gradient"
          onClick={handleContinue}
          disabled={!canContinue || isProcessing}
          className="min-w-[180px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Analyze Resume
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
