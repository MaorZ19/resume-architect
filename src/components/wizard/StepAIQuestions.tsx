"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  SkipForward,
  Loader2,
  CheckCircle,
  Target,
  TrendingUp,
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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AIQuestion } from "@/types/job";

// Mock questions for demo
const mockQuestions: AIQuestion[] = [
  {
    id: "q1",
    question:
      "The job requires '3+ years of React experience.' Your resume mentions React but doesn't specify duration. How many years have you been working with React?",
    purpose: "Quantify your React experience",
    skillArea: "React",
    exampleAnswer: "I have 4 years of React experience, starting from 2020...",
  },
  {
    id: "q2",
    question:
      "The role emphasizes 'improving system performance.' Can you describe a specific project where you optimized performance? What metrics improved?",
    purpose: "Demonstrate impact with numbers",
    skillArea: "Performance Optimization",
    exampleAnswer:
      "I reduced page load time by 40% by implementing lazy loading...",
  },
  {
    id: "q3",
    question:
      "This position requires 'cross-functional collaboration.' Tell me about a time you worked with multiple teams (e.g., design, product, backend).",
    purpose: "Show teamwork skills",
    skillArea: "Collaboration",
    exampleAnswer:
      "I led a feature launch coordinating with 3 teams across 2 time zones...",
  },
];

export function StepAIQuestions() {
  const {
    analysis,
    setAnalysisData,
    setAnalysisLoading,
    answerQuestion,
    nextQuestion,
    skipQuestion,
    nextStep,
    prevStep,
  } = useWizardStore();

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Simulate initial analysis
  useEffect(() => {
    const runAnalysis = async () => {
      setAnalysisLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Set mock analysis data
      setAnalysisData({
        matchPercentage: 72,
        skillMatches: [
          { skill: "JavaScript", strength: "strong", evidence: "5 years mentioned" },
          { skill: "TypeScript", strength: "strong", evidence: "Recent projects" },
          { skill: "React", strength: "moderate", evidence: "Listed but no duration" },
        ],
        skillGaps: [
          {
            skill: "Team Leadership",
            importance: "important",
            suggestion: "Highlight any mentoring or lead experiences",
          },
          {
            skill: "CI/CD",
            importance: "nice-to-have",
            suggestion: "Mention any deployment experience",
          },
        ],
        questions: mockQuestions,
        recommendations: [
          "Add quantifiable metrics to experience bullets",
          "Include leadership examples",
        ],
        atsScore: 68,
      });

      setAnalysisLoading(false);
      setIsAnalyzing(false);
    };

    if (!analysis.data) {
      runAnalysis();
    } else {
      setIsAnalyzing(false);
    }
  }, [analysis.data, setAnalysisData, setAnalysisLoading]);

  const questions = analysis.questions.length > 0 ? analysis.questions : mockQuestions;
  const currentQuestion = questions[analysis.currentQuestionIndex];
  const progress = ((analysis.currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = analysis.currentQuestionIndex === questions.length - 1;

  const handleSubmitAnswer = () => {
    if (currentQuestion && currentAnswer.trim()) {
      answerQuestion(currentQuestion.id, currentAnswer);
      setCurrentAnswer("");

      if (isLastQuestion) {
        nextStep();
      } else {
        nextQuestion();
      }
    }
  };

  const handleSkip = () => {
    setCurrentAnswer("");
    if (isLastQuestion) {
      nextStep();
    } else {
      skipQuestion();
    }
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            Analyzing...
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900">
            AI is Analyzing Your Profile
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Comparing your resume with the job requirements to identify matches
            and opportunities for improvement.
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>This usually takes 5-10 seconds...</span>
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          Step 3 of 5
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900">
          Let&apos;s Enhance Your Resume
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Answer a few questions to help us highlight achievements you might
          have overlooked.
        </p>
      </div>

      {/* Analysis Summary */}
      {analysis.data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">
                {analysis.data.matchPercentage}%
              </div>
              <div className="text-xs text-slate-500">Match Score</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">
                {analysis.data.skillMatches.length}
              </div>
              <div className="text-xs text-slate-500">Skills Matched</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">
                {analysis.data.skillGaps.length}
              </div>
              <div className="text-xs text-slate-500">Areas to Improve</div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Question {analysis.currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-slate-500">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion?.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-relaxed">
                    {currentQuestion?.question}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-xs">
                      {currentQuestion?.skillArea}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your answer here..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="min-h-[150px] text-base"
              />

              {currentQuestion?.exampleAnswer && (
                <div className="p-3 rounded-lg bg-slate-50 text-sm">
                  <span className="font-medium text-slate-600">
                    Example answer:{" "}
                  </span>
                  <span className="text-slate-500 italic">
                    {currentQuestion.exampleAnswer}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleSkip} className="gap-2">
            <SkipForward className="w-4 h-4" />
            Skip
          </Button>
          <Button
            variant="gradient"
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim()}
            className="gap-2"
          >
            {isLastQuestion ? "Generate Resume" : "Next Question"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
