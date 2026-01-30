import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ParsedJobDescription, Analysis, AIQuestion } from "@/types/job";
import type { ParsedResume, OptimizedResume } from "@/types/resume";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

// API Helper functions
async function createSession(): Promise<string> {
  const response = await fetch("/api/session", { method: "POST" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data.session.id;
}

async function updateSession(sessionId: string, updates: Record<string, unknown>) {
  const response = await fetch("/api/session", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, ...updates }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
}

async function scrapeJobUrl(url: string, sessionId: string) {
  const response = await fetch("/api/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, sessionId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data.data;
}

async function uploadResumeFile(file: File, sessionId: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sessionId", sessionId);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}

async function analyzeResume(sessionId: string) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data.analysis;
}

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
  // Session ID for backend
  sessionId: string | null;

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

  // Session Actions
  initSession: () => Promise<string>;

  // Job Description Actions
  setJobDescriptionSource: (source: "url" | "text") => void;
  setJobDescriptionUrl: (url: string) => void;
  setJobDescriptionText: (text: string) => void;
  setJobDescriptionParsed: (parsed: ParsedJobDescription) => void;
  setJobDescriptionLoading: (loading: boolean) => void;
  setJobDescriptionError: (error: string | undefined) => void;
  submitJobUrl: (url: string) => Promise<void>;
  submitJobText: (text: string) => Promise<void>;

  // Resume Actions
  setResumeSource: (source: "file" | "text") => void;
  setResumeFile: (file: File) => void;
  setResumeText: (text: string) => void;
  setResumeParsed: (parsed: ParsedResume) => void;
  setResumeLoading: (loading: boolean) => void;
  setResumeError: (error: string | undefined) => void;
  submitResumeFile: (file: File) => Promise<void>;
  submitResumeText: (text: string) => Promise<void>;

  // Analysis Actions
  setAnalysisLoading: (loading: boolean) => void;
  setAnalysisData: (data: Analysis) => void;
  setAnalysisError: (error: string | undefined) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  skipQuestion: () => void;
  nextQuestion: () => void;
  startAnalysis: () => Promise<void>;

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
      sessionId: null,
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

      // Session Actions
      initSession: async () => {
        let { sessionId } = get();
        if (!sessionId) {
          sessionId = await createSession();
          set({ sessionId });
        }
        return sessionId;
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

      submitJobUrl: async (url: string) => {
        const sessionId = await get().initSession();
        set((state) => ({
          jobDescription: { ...state.jobDescription, isLoading: true, error: undefined, url },
        }));
        try {
          const parsed = await scrapeJobUrl(url, sessionId);
          set((state) => ({
            jobDescription: { ...state.jobDescription, isLoading: false, parsed, rawText: parsed.raw_text || parsed.description || "" },
          }));
        } catch (error) {
          set((state) => ({
            jobDescription: { ...state.jobDescription, isLoading: false, error: (error as Error).message },
          }));
          throw error;
        }
      },

      submitJobText: async (text: string) => {
        const sessionId = await get().initSession();
        set((state) => ({
          jobDescription: { ...state.jobDescription, rawText: text },
        }));
        await updateSession(sessionId, { job_description: { raw_text: text } });
      },

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

      submitResumeFile: async (file: File) => {
        const sessionId = await get().initSession();
        set((state) => ({
          resume: { ...state.resume, isLoading: true, error: undefined, file, fileName: file.name },
        }));
        try {
          await uploadResumeFile(file, sessionId);
          set((state) => ({
            resume: { ...state.resume, isLoading: false },
          }));
        } catch (error) {
          set((state) => ({
            resume: { ...state.resume, isLoading: false, error: (error as Error).message },
          }));
          throw error;
        }
      },

      submitResumeText: async (text: string) => {
        const sessionId = await get().initSession();
        set((state) => ({
          resume: { ...state.resume, rawText: text },
        }));
        await updateSession(sessionId, { resume_data: { raw_text: text } });
      },

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

      startAnalysis: async () => {
        const sessionId = await get().initSession();
        set((state) => ({
          analysis: { ...state.analysis, isLoading: true, error: undefined },
        }));
        try {
          const analysisData = await analyzeResume(sessionId);
          set((state) => ({
            analysis: {
              ...state.analysis,
              isLoading: false,
              data: analysisData,
              questions: analysisData.questions || [],
            },
          }));
        } catch (error) {
          set((state) => ({
            analysis: { ...state.analysis, isLoading: false, error: (error as Error).message },
          }));
          throw error;
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
        sessionId: state.sessionId,
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
