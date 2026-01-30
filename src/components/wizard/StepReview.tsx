"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Gauge,
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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StepReview() {
  const {
    optimizedResume,
    setOptimizedResume,
    isOptimizing,
    setIsOptimizing,
    analysis,
    nextStep,
    prevStep,
  } = useWizardStore();

  const [activeTab, setActiveTab] = useState<"optimized" | "original" | "changes">(
    "optimized"
  );

  // Simulate resume optimization
  useEffect(() => {
    const optimizeResume = async () => {
      if (!optimizedResume && !isOptimizing) {
        setIsOptimizing(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 4000));

        // Set mock optimized resume
        setOptimizedResume({
          contact: {
            name: "John Doe",
            email: "john.doe@email.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            linkedin: "linkedin.com/in/johndoe",
          },
          summary:
            "Results-driven Senior Software Engineer with 5+ years of experience building scalable web applications using React and Node.js. Proven track record of improving system performance by up to 40% and leading cross-functional teams to deliver impactful products. Passionate about clean code, mentorship, and driving engineering excellence.",
          experience: [
            {
              id: "1",
              company: "Tech Company",
              title: "Senior Software Engineer",
              location: "San Francisco, CA",
              startDate: "2020-01",
              current: true,
              bullets: [
                "Led development of microservices architecture serving 10M+ daily users, improving system reliability by 99.9%",
                "Reduced page load time by 40% through implementation of lazy loading and code splitting strategies",
                "Mentored team of 5 junior developers, conducting code reviews and establishing best practices",
                "Collaborated with product, design, and backend teams to launch 3 major features ahead of schedule",
              ],
            },
          ],
          education: [
            {
              id: "1",
              institution: "University of California",
              degree: "B.S. Computer Science",
              endDate: "2018",
            },
          ],
          skills: [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "Python",
            "AWS",
            "Docker",
            "CI/CD",
            "Agile",
            "Team Leadership",
          ],
          rawText: "",
          optimizedSummary:
            "Results-driven Senior Software Engineer with 5+ years...",
          optimizedExperience: [],
          addedKeywords: ["microservices", "scalable", "mentorship", "CI/CD"],
          atsScore: 89,
          changes: [
            {
              section: "Summary",
              original: "Software engineer with experience in web development",
              optimized:
                "Results-driven Senior Software Engineer with 5+ years of experience...",
              reason: "Added specific years and quantifiable impact",
            },
            {
              section: "Experience",
              original: "Worked on improving system performance",
              optimized: "Reduced page load time by 40% through implementation of...",
              reason: "Added specific metrics and technical details",
            },
          ],
        });

        setIsOptimizing(false);
      }
    };

    optimizeResume();
  }, [optimizedResume, isOptimizing, setOptimizedResume, setIsOptimizing]);

  if (isOptimizing || !optimizedResume) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            Optimizing...
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900">
            Creating Your Optimized Resume
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Our AI is tailoring your resume to match the job requirements
            perfectly.
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="pt-4 border-t space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating optimized content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium"
        >
          <CheckCircle className="w-4 h-4" />
          Step 4 of 5
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900">
          Review Your Optimized Resume
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          We&apos;ve tailored your resume to the job requirements. Review the
          changes below.
        </p>
      </div>

      {/* ATS Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center"
      >
        <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-green-100"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(optimizedResume.atsScore / 100) * 251} 251`}
                    className="text-green-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-700">
                    {optimizedResume.atsScore}%
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <Gauge className="w-5 h-5" />
                  ATS Compatibility Score
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  Your resume is highly optimized for Applicant Tracking Systems
                </p>
                {analysis.data && (
                  <p className="text-xs text-green-600 mt-2">
                    +{optimizedResume.atsScore - analysis.data.atsScore} points
                    improvement
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tab Buttons */}
      <div className="flex justify-center gap-2">
        {["optimized", "original", "changes"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className="capitalize"
          >
            {tab === "changes" ? "View Changes" : `${tab} Resume`}
          </Button>
        ))}
      </div>

      {/* Content */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardContent className="p-8">
          {activeTab === "optimized" && (
            <div className="prose max-w-none">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  {optimizedResume.contact.name}
                </h2>
                <p className="text-slate-500 text-sm">
                  {optimizedResume.contact.email} • {optimizedResume.contact.phone}{" "}
                  • {optimizedResume.contact.location}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Summary
                </h3>
                <p className="text-slate-700">{optimizedResume.summary}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Experience
                </h3>
                {optimizedResume.experience.map((exp) => (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {exp.title}
                        </h4>
                        <p className="text-slate-600">{exp.company}</p>
                      </div>
                      <span className="text-sm text-slate-400">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="text-slate-700 text-sm flex items-start gap-2"
                        >
                          <span className="text-blue-500 mt-1.5">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {optimizedResume.skills.map((skill) => (
                    <span
                      key={skill}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm",
                        optimizedResume.addedKeywords.includes(skill)
                          ? "bg-green-100 text-green-700 ring-2 ring-green-200"
                          : "bg-slate-100 text-slate-700"
                      )}
                    >
                      {skill}
                      {optimizedResume.addedKeywords.includes(skill) && (
                        <span className="ml-1 text-xs">✨</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "changes" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600 mb-4">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">
                  {optimizedResume.changes.length} improvements made
                </span>
              </div>
              {optimizedResume.changes.map((change, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-600">
                      {change.section}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                      <p className="text-xs text-red-500 font-medium mb-1">
                        Original
                      </p>
                      <p className="text-sm text-slate-600 line-through">
                        {change.original}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                      <p className="text-xs text-green-500 font-medium mb-1">
                        Optimized
                      </p>
                      <p className="text-sm text-slate-700">{change.optimized}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    <span className="font-medium">Why:</span> {change.reason}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "original" && (
            <div className="text-center py-12 text-slate-400">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Original resume preview coming soon</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Questions
        </Button>
        <Button variant="gradient" onClick={nextStep} className="gap-2">
          Continue to Export
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
