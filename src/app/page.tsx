"use client";

import Link from "next/link";
import { ArrowRight, FileText, Sparkles, Target, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Resume Architect
            </span>
          </div>
          <Link
            href="/optimize"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-16 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Resume Optimization
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Stop Sending Generic Resumes.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Start Landing Interviews.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Our AI doesn&apos;t just rewrite your resume — it interviews you to
            uncover hidden achievements and tailors every word to match the job
            you want.
          </p>

          {/* CTA Button */}
          <Link
            href="/optimize"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            Optimize My Resume
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-sm text-slate-500 mt-4">
            No credit card required • Takes 5 minutes
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Target className="w-6 h-6" />}
            title="Job-Targeted Optimization"
            description="Upload any job description and watch your resume transform to match its requirements perfectly."
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Smart Interview Mode"
            description="Our AI asks targeted questions to extract achievements you forgot to mention — like a career coach."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="ATS-Optimized Output"
            description="Get a resume that passes Applicant Tracking Systems and catches recruiters' attention."
          />
        </div>

        {/* How it works */}
        <div className="mt-32 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Step number={1} title="Paste Job URL" description="Or enter the job description text" />
            <Step number={2} title="Upload Resume" description="PDF or paste your current resume" />
            <Step number={3} title="Answer Questions" description="AI asks 3-5 targeted questions" />
            <Step number={4} title="Get Optimized CV" description="Download your tailored resume" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>© 2026 Resume Architect. Built with AI.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-700 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-700 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/60 backdrop-blur border border-white/80 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
