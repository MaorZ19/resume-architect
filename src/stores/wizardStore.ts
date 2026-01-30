import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ParsedJobDescription, Analysis, AIQuestion } from "@/types/job";
import type { ParsedResume, OptimizedResume } from "@/types/resume";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

interface JobDescriptionInput {
  source: "url" | "text";
  url?: string;
  rawText: string;
  parsed?: ParsedJobDescription;
  isLoading: boolean;
  error?: string;
}

interface ResumeInput {
  source: "file" | "text";
  file?: File;
  fileName?: string;
  rawText: string;
  parsed?: ParsedResume;
  isLoading: boolean;
  error?: string;
}

interface AnalysisState {
  isLoading: boolean;
  data?: Analysis;
  questions: AIQuestion[];
  answers: Record<string, string>;
  currentQuestionIndex: number;
  error?: string;
}

interface WizardState {
  // Current step
  currentStep: WizardStep;

  // Step 1: Job Description
  jobDescription: JobDescriptionInput;

  // Step 2: Resume
  resume: ResumeInput;

  // Step 3: Analysis & Questions
  analysis: AnalysisState;

  // Step 4 & 5: Optimized Resume
  optimizedResume: OptimizedResume | null;
  isOptimizing: boolean;

  // Actions
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Job Description Actions
  setJobDescriptionSource: (source: "url" | "text") => void;
  setJobDescriptionUrl: (url: string) => void;
  setJobDescriptionText: (text: string) => void;
  setJobDescriptionParsed: (parsed: ParsedJobDescription) => void;
  setJobDescriptionLoading: (loading: boolean) => void;
  setJobDescriptionError: (error: string | undefined) => void;

  // Resume Actions
  setResumeSource: (source: "file" | "text") => void;
  setResumeFile: (file: File) => void;
  setResumeText: (text: string) => void;
  setResumeParsed: (parsed: ParsedResume) => void;
  setResumeLoading: (loading: boolean) => void;
  setResumeError: (error: string | undefined) => void;

  // Analysis Actions
  setAnalysisLoading: (loading: boolean) => void;
  setAnalysisData: (data: Analysis) => void;
  setAnalysisError: (error: string | undefined) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  skipQuestion: () => void;
  nextQuestion: () => void;

  // Optimization Actions
  setOptimizedResume: (resume: OptimizedResume) => void;
  setIsOptimizing: (optimizing: boolean) => void;

  // Utility Actions
  reset: () => void;
  canProceedToStep: (step: WizardStep) => boolean;
}

const initialJobDescription: JobDescriptionInput = {
  source: "text",
  rawText: "",
  isLoading: false,
};

const initialResume: ResumeInput = {
  source: "file",
  rawText: "",
  isLoading: false,
};

const initialAnalysis: AnalysisState = {
  isLoading: false,
  questions: [],
  answers: {},
  currentQuestionIndex: 0,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentStep: 1,
      jobDescription: initialJobDescription,
      resume: initialResume,
      analysis: initialAnalysis,
      optimizedResume: null,
      isOptimizing: false,

      // Step Navigation
      setStep: (step) => {
        if (get().canProceedToStep(step)) {
          set({ currentStep: step });
        }
      },

      nextStep: () => {
        const current = get().currentStep;
        if (current < 5 && get().canProceedToStep((current + 1) as WizardStep)) {
          set({ currentStep: (current + 1) as WizardStep });
        }
      },

      prevStep: () => {
        const current = get().currentStep;
        if (current > 1) {
          set({ currentStep: (current - 1) as WizardStep });
        }
      },

      // Job Description Actions
      setJobDescriptionSource: (source) =>
        set((state) => ({
          jobDescription: { ...state.jobDescription, source },
        })),

      setJobDescriptionUrl: (url) =>
        set((state) => ({
          jobDescription: { ...state.jobDescription, url },
        })),

      setJobDescriptionText: (rawText) =>
        set((state) => ({
          jobDescription: { ...state.jobDescription, rawText },
        })),

      setJobDescriptionParsed: (parsed) =>
        set((state) => ({
          jobDescription: { ...state.jobDescription, parsed },
        })),

      setJobDescriptionLoading: (isLoading) =>
        set((state) => ({
          jobDescription: { ...state.jobDescription, isLoading },
        })),

      setJobDescriptionError: (error) =>
        set((state) => ({
          jobDescription: { ...state.jobDescription, error },
        })),

      // Resume Actions
      setResumeSource: (source) =>
        set((state) => ({
          resume: { ...state.resume, source },
        })),

      setResumeFile: (file) =>
        set((state) => ({
          resume: { ...state.resume, file, fileName: file.name },
        })),

      setResumeText: (rawText) =>
        set((state) => ({
          resume: { ...state.resume, rawText },
        })),

      setResumeParsed: (parsed) =>
        set((state) => ({
          resume: { ...state.resume, parsed },
        })),

      setResumeLoading: (isLoading) =>
        set((state) => ({
          resume: { ...state.resume, isLoading },
        })),

      setResumeError: (error) =>
        set((state) => ({
          resume: { ...state.resume, error },
        })),

      // Analysis Actions
      setAnalysisLoading: (isLoading) =>
        set((state) => ({
          analysis: { ...state.analysis, isLoading },
        })),

      setAnalysisData: (data) =>
        set((state) => ({
          analysis: {
            ...state.analysis,
            data,
            questions: data.questions,
          },
        })),

      setAnalysisError: (error) =>
        set((state) => ({
          analysis: { ...state.analysis, error },
        })),

      answerQuestion: (questionId, answer) =>
        set((state) => ({
          analysis: {
            ...state.analysis,
            answers: { ...state.analysis.answers, [questionId]: answer },
          },
        })),

      skipQuestion: () => {
        const { analysis } = get();
        if (analysis.currentQuestionIndex < analysis.questions.length - 1) {
          set({
            analysis: {
              ...analysis,
              currentQuestionIndex: analysis.currentQuestionIndex + 1,
            },
          });
        }
      },

      nextQuestion: () => {
        const { analysis } = get();
        if (analysis.currentQuestionIndex < analysis.questions.length - 1) {
          set({
            analysis: {
              ...analysis,
              currentQuestionIndex: analysis.currentQuestionIndex + 1,
            },
          });
        }
      },

      // Optimization Actions
      setOptimizedResume: (resume) => set({ optimizedResume: resume }),
      setIsOptimizing: (optimizing) => set({ isOptimizing: optimizing }),

      // Utility Actions
      reset: () =>
        set({
          currentStep: 1,
          jobDescription: initialJobDescription,
          resume: initialResume,
          analysis: initialAnalysis,
          optimizedResume: null,
          isOptimizing: false,
        }),

      canProceedToStep: (step) => {
        const state = get();

        switch (step) {
          case 1:
            return true;
          case 2:
            // Can proceed to step 2 if job description has content
            return state.jobDescription.rawText.length > 50;
          case 3:
            // Can proceed to step 3 if resume has content
            return (
              state.jobDescription.rawText.length > 50 &&
              (state.resume.rawText.length > 50 || !!state.resume.file)
            );
          case 4:
            // Can proceed to step 4 if analysis is complete
            return !!state.analysis.data;
          case 5:
            // Can proceed to step 5 if optimized resume exists
            return !!state.optimizedResume;
          default:
            return false;
        }
      },
    }),
    {
      name: "resume-wizard-storage",
      partialize: (state) => ({
        currentStep: state.currentStep,
        jobDescription: {
          source: state.jobDescription.source,
          url: state.jobDescription.url,
          rawText: state.jobDescription.rawText,
        },
        resume: {
          source: state.resume.source,
          rawText: state.resume.rawText,
          fileName: state.resume.fileName,
        },
        analysis: {
          answers: state.analysis.answers,
        },
      }),
    }
  )
);
