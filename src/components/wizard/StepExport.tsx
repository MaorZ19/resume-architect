"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileText,
  File,
  Copy,
  Mail,
  CheckCircle,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { useWizardStore } from "@/stores/wizardStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ExportFormat = "pdf" | "docx" | "txt" | "copy" | "email";

interface ExportOption {
  id: ExportFormat;
  title: string;
  description: string;
  icon: React.ReactNode;
  primary?: boolean;
}

const exportOptions: ExportOption[] = [
  {
    id: "pdf",
    title: "Download PDF",
    description: "Best for job applications",
    icon: <FileText className="w-6 h-6" />,
    primary: true,
  },
  {
    id: "docx",
    title: "Download Word",
    description: "Editable document format",
    icon: <File className="w-6 h-6" />,
  },
  {
    id: "txt",
    title: "Plain Text",
    description: "For copy-paste to forms",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: "copy",
    title: "Copy to Clipboard",
    description: "Quick copy for pasting",
    icon: <Copy className="w-6 h-6" />,
  },
  {
    id: "email",
    title: "Send to Email",
    description: "Receive in your inbox",
    icon: <Mail className="w-6 h-6" />,
  },
];

export function StepExport() {
  const { optimizedResume, prevStep, reset } = useWizardStore();
  const [downloadedFormats, setDownloadedFormats] = useState<Set<ExportFormat>>(
    new Set()
  );
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(format);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setDownloadedFormats((prev) => new Set([...prev, format]));
    setIsExporting(null);

    // TODO: Implement actual export via n8n workflow
    if (format === "copy") {
      // Copy to clipboard
      navigator.clipboard.writeText(optimizedResume?.summary || "");
    }
  };

  const handleStartOver = () => {
    if (
      confirm(
        "Are you sure you want to start over? This will clear all your progress."
      )
    ) {
      reset();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium"
        >
          <PartyPopper className="w-4 h-4" />
          Step 5 of 5 - Complete!
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900">
          Your Resume is Ready!
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Download your optimized resume in your preferred format and start
          applying with confidence.
        </p>
      </div>

      {/* Success Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  Congratulations!
                </h2>
                <p className="text-slate-600">
                  Your resume has been optimized with{" "}
                  <span className="font-semibold text-green-600">
                    {optimizedResume?.atsScore}% ATS compatibility
                  </span>
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {optimizedResume?.addedKeywords?.length || 0} keywords added
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {optimizedResume?.changes?.length || 0} improvements made
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export Options */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportOptions.map((option, index) => {
          const isDownloaded = downloadedFormats.has(option.id);
          const isLoading = isExporting === option.id;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "border-2 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1",
                  option.primary
                    ? "border-blue-200 bg-blue-50/50"
                    : "border-transparent",
                  isDownloaded && "border-green-200 bg-green-50/50"
                )}
                onClick={() => !isLoading && handleExport(option.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        option.primary
                          ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                          : isDownloaded
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                        >
                          <Download className="w-6 h-6" />
                        </motion.div>
                      ) : isDownloaded ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        option.icon
                      )}
                    </div>
                    {option.primary && !isDownloaded && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        Recommended
                      </span>
                    )}
                    {isDownloaded && (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        Downloaded
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 mt-4">
                    {option.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Review
        </Button>
        <Button variant="ghost" onClick={handleStartOver} className="text-slate-500">
          Start Over with New Resume
        </Button>
      </div>

      {/* Tips */}
      <Card className="border-0 bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base">What&apos;s Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0">
              1
            </div>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">Apply confidently</span>{" "}
              — Your resume is now optimized for this specific role
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0">
              2
            </div>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">Prepare for interviews</span>{" "}
              — Review the changes we made so you can speak to them
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0">
              3
            </div>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">Apply to more jobs</span>{" "}
              — Come back to optimize your resume for each new opportunity
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
