# AI Resume Optimization Agent - Complete Implementation Plan

> **Recovered from session:** 38f313d4-3ab1-4a34-b4ad-74c4bde6259f
> **Date:** January 29, 2026

---

## Executive Summary

This document outlines a comprehensive implementation plan for building an AI-powered Resume Optimization Agent that helps users tailor their resumes to specific job descriptions. The application follows the WAT framework (Workflows, Agents, Tools) with a beautiful Next.js frontend, n8n backend workflows, and Supabase for database and file storage.

---

## 1. User Flow / UX Design

### 1.1 Multi-Step Wizard Interface

The application will use a 5-step wizard flow with smooth animations between steps:

**Step 1: Job Description Input**
- Two input methods: URL or paste text
- URL input with automatic scraping via n8n workflow
- Rich text area for pasting job descriptions
- AI-powered extraction of key requirements (shown as preview chips)
- Progress indicator showing 1/5

**Step 2: Resume Upload**
- Drag-and-drop zone with Uppy integration for PDF uploads
- Alternative: paste resume text directly
- File preview with thumbnail generation
- Support for PDF, DOCX (converted server-side)
- Progress indicator showing 2/5

**Step 3: AI Analysis & Questions**
- Loading skeleton while AI analyzes both documents
- Display of identified skill gaps and matches
- Interactive Q&A session with 3-5 intelligent questions:
  - Missing experience clarification
  - Project details for relevant skills
  - Quantifiable achievements
  - Role-specific questions
- Real-time streaming responses
- Progress indicator showing 3/5

**Step 4: Review & Customize**
- Side-by-side comparison: Original vs Optimized
- Highlighted changes with diff view
- Toggle sections on/off
- Edit specific sections inline
- ATS compatibility score
- Progress indicator showing 4/5

**Step 5: Export & Download**
- Multiple export formats: PDF, DOCX, plain text
- Copy to clipboard option
- Email delivery option
- Save to account (if authenticated)
- Share link generation
- Progress indicator showing 5/5

### 1.2 Q&A Interaction Design

The Q&A step uses a chat-like interface:
```
[AI Avatar] Based on your resume and the job description, I have a few questions:

Q1: The job requires "3+ years of React experience." Your resume
    mentions React projects but doesn't specify duration. How many
    years have you been working with React?

    [Text input] [Skip] [Next]

Q2: The role emphasizes "cross-functional collaboration." Can you
    describe a specific project where you worked with multiple teams?

    [Text input] [Skip] [Next]
```

### 1.3 Visual Design Principles

- **Color Scheme**: Professional blues and grays with accent colors for CTAs
- **Typography**: Inter for UI, system fonts for resume preview
- **Animations**: Framer Motion for step transitions (slide + fade)
- **Micro-interactions**: Button hover states, input focus effects, loading skeletons
- **Responsive**: Mobile-first design with tablet and desktop breakpoints

---

## 2. Frontend Architecture

### 2.1 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── optimize/
│   │   ├── page.tsx                # Main wizard container
│   │   └── layout.tsx              # Wizard layout with progress
│   ├── dashboard/                   # User dashboard (future)
│   │   └── page.tsx
│   ├── api/
│   │   ├── upload/route.ts         # File upload handler
│   │   ├── scrape/route.ts         # Job URL scraping trigger
│   │   ├── analyze/route.ts        # AI analysis trigger
│   │   └── export/route.ts         # Resume export handler
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── confirm/route.ts
│   └── layout.tsx                  # Root layout
├── components/
│   ├── ui/                         # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── progress.tsx
│   │   ├── skeleton.tsx
│   │   ├── tabs.tsx
│   │   └── dialog.tsx
│   ├── wizard/
│   │   ├── WizardContainer.tsx     # Main wizard state machine
│   │   ├── WizardProgress.tsx      # Step indicator
│   │   ├── StepJobInput.tsx        # Step 1
│   │   ├── StepResumeUpload.tsx    # Step 2
│   │   ├── StepAIQuestions.tsx     # Step 3
│   │   ├── StepReview.tsx          # Step 4
│   │   └── StepExport.tsx          # Step 5
│   ├── resume/
│   │   ├── ResumePreview.tsx       # Resume display component
│   │   ├── ResumeDiff.tsx          # Side-by-side comparison
│   │   ├── ResumeSection.tsx       # Editable section
│   │   └── ATSScore.tsx            # ATS compatibility meter
│   ├── upload/
│   │   ├── FileDropzone.tsx        # Drag-drop upload
│   │   ├── UploadProgress.tsx      # Upload progress bar
│   │   └── FilePreview.tsx         # Uploaded file preview
│   ├── chat/
│   │   ├── ChatMessage.tsx         # Q&A message bubble
│   │   ├── ChatInput.tsx           # User input field
│   │   └── ChatContainer.tsx       # Q&A session container
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Container.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   └── middleware.ts           # Auth middleware
│   ├── n8n/
│   │   └── client.ts               # n8n workflow triggers
│   ├── utils.ts                    # Utility functions (cn, etc.)
│   ├── validations.ts              # Zod schemas
│   └── constants.ts                # App constants
├── hooks/
│   ├── useWizard.ts                # Wizard state management
│   ├── useFileUpload.ts            # Upload handling
│   ├── useStreamingResponse.ts     # AI streaming
│   └── useResume.ts                # Resume state
├── stores/
│   └── wizardStore.ts              # Zustand store for wizard
├── types/
│   ├── resume.ts                   # Resume types
│   ├── job.ts                      # Job description types
│   └── api.ts                      # API response types
└── styles/
    └── globals.css                 # Global styles + Tailwind
```

### 2.2 State Management Strategy

**Zustand Store for Wizard State:**
```typescript
// stores/wizardStore.ts
interface WizardState {
  currentStep: number;
  jobDescription: {
    source: 'url' | 'text';
    url?: string;
    rawText: string;
    parsed?: ParsedJobDescription;
  };
  resume: {
    source: 'file' | 'text';
    file?: File;
    rawText: string;
    parsed?: ParsedResume;
  };
  analysis: {
    skillMatches: SkillMatch[];
    skillGaps: SkillGap[];
    questions: AIQuestion[];
    answers: Record<string, string>;
  };
  optimizedResume: OptimizedResume | null;

  // Actions
  setStep: (step: number) => void;
  setJobDescription: (data: Partial<WizardState['jobDescription']>) => void;
  setResume: (data: Partial<WizardState['resume']>) => void;
  setAnalysis: (data: Partial<WizardState['analysis']>) => void;
  setOptimizedResume: (resume: OptimizedResume) => void;
  reset: () => void;
}
```

**React Query for Server State:**
- Job scraping mutations
- File upload mutations
- AI analysis queries
- Export mutations

### 2.3 Key Component Implementations

**WizardContainer.tsx - Main Orchestrator:**
```typescript
// Manages step transitions with Framer Motion
// Validates step completion before advancing
// Handles keyboard navigation (Enter to continue)
// Auto-saves progress to localStorage
```

**StepResumeUpload.tsx - File Upload:**
```typescript
// Uses @uppy/react with @uppy/tus for resumable uploads
// Uploads directly to Supabase Storage
// Shows upload progress with percentage
// Triggers PDF text extraction via n8n after upload
```

**StepAIQuestions.tsx - Q&A Interface:**
```typescript
// Receives questions from analysis step
// Streaming display of AI-generated questions
// Collects user answers
// Allows skipping questions
// Shows progress through questions
```

---

## 3. Backend Architecture

### 3.1 n8n Workflow Definitions

**Workflow 1: Job Description Scraper (`scrape_job_url`)**
```
Trigger: Webhook (POST /webhook/scrape-job)
├── HTTP Request Node: Fetch URL content
├── HTML Extract Node: Extract job details
├── Code Node: Parse and structure data
│   - Title, Company, Location
│   - Requirements (skills, experience)
│   - Responsibilities
│   - Benefits
└── Respond to Webhook: Return parsed job
```

**Workflow 2: Resume Parser (`parse_resume`)**
```
Trigger: Webhook (POST /webhook/parse-resume)
├── Supabase Node: Download file from storage
├── Code Node: Extract text from PDF
│   - Use pdf-parse library
│   - Handle DOCX with mammoth
├── Claude AI Node: Structure resume data
│   - Contact info
│   - Summary
│   - Experience (with dates)
│   - Education
│   - Skills
│   - Certifications
└── Respond to Webhook: Return parsed resume
```

**Workflow 3: Resume Analyzer (`analyze_resume`)**
```
Trigger: Webhook (POST /webhook/analyze)
├── Receive: parsed job + parsed resume
├── Claude AI Node: Deep analysis
│   - Skill matching (percentage match)
│   - Experience gap analysis
│   - Keyword optimization opportunities
│   - Generate 3-5 clarifying questions
├── Code Node: Structure analysis results
└── Respond to Webhook: Return analysis
```

**Workflow 4: Resume Optimizer (`optimize_resume`)**
```
Trigger: Webhook (POST /webhook/optimize)
├── Receive: resume + job + analysis + answers
├── Claude AI Node: Generate optimized resume
│   - Rewrite summary for job alignment
│   - Enhance experience descriptions
│   - Add relevant keywords
│   - Improve quantifiable achievements
│   - Maintain authenticity
├── Code Node: Calculate ATS score
├── Supabase Node: Store optimized version
└── Respond to Webhook: Return optimized resume
```

**Workflow 5: Resume Exporter (`export_resume`)**
```
Trigger: Webhook (POST /webhook/export)
├── Receive: optimized resume + format
├── Switch Node: By format
│   ├── PDF: Use puppeteer/pdf-lib
│   ├── DOCX: Use docx library
│   └── TXT: Plain text formatting
├── Supabase Storage: Upload generated file
└── Respond to Webhook: Return download URL
```

### 3.2 Database Schema (Prisma + Supabase PostgreSQL)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions      Session[]
  resumes       Resume[]
  optimizations Optimization[]
}

model Session {
  id              String   @id @default(uuid())
  sessionToken    String   @unique
  userId          String?
  user            User?    @relation(fields: [userId], references: [id])

  // Wizard state (for guests and authenticated users)
  currentStep     Int      @default(1)
  jobDescription  Json?    // Stored job description data
  resumeData      Json?    // Parsed resume data
  analysisData    Json?    // Analysis results
  answers         Json?    // User Q&A answers

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  expiresAt       DateTime

  optimizations   Optimization[]
}

model Resume {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])

  title           String   @default("My Resume")
  originalFileUrl String?  // Supabase Storage path
  parsedContent   Json     // Structured resume data

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  optimizations   Optimization[]
}

model Optimization {
  id              String   @id @default(uuid())
  sessionId       String?
  session         Session? @relation(fields: [sessionId], references: [id])
  userId          String?
  user            User?    @relation(fields: [userId], references: [id])
  resumeId        String?
  resume          Resume?  @relation(fields: [resumeId], references: [id])

  jobUrl          String?
  jobTitle        String?
  companyName     String?
  jobDescription  Json     // Full parsed job data

  originalResume  Json     // Original resume content
  optimizedResume Json     // Optimized resume content
  analysis        Json     // Skill matches, gaps, etc.
  atsScore        Int?     // 0-100 ATS compatibility score

  exportedFiles   Json?    // Array of exported file URLs

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model JobCache {
  id              String   @id @default(uuid())
  url             String   @unique
  parsedContent   Json
  createdAt       DateTime @default(now())
  expiresAt       DateTime // Cache for 7 days
}
```

### 3.3 Supabase Storage Buckets

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('resumes', 'resumes', false),      -- Original uploaded resumes
  ('exports', 'exports', false);       -- Generated export files

-- RLS Policies for resumes bucket
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Similar policies for exports bucket
```

### 3.4 API Route Handlers

**`/api/upload/route.ts`:**
```typescript
// Handles Supabase Storage upload initiation
// Returns signed upload URL for TUS resumable upload
// Triggers parse workflow after successful upload
```

**`/api/analyze/route.ts`:**
```typescript
// Triggers n8n analyze workflow
// Streams response back to client
// Stores results in session
```

---

## 4. AI Agent Logic

### 4.1 Job Description Analysis

**Extraction Prompt Template:**
```
Analyze this job description and extract structured information:

JOB DESCRIPTION:
{job_description}

Extract and return as JSON:
{
  "title": "Job title",
  "company": "Company name if mentioned",
  "location": "Location/remote status",
  "experience_level": "Entry/Mid/Senior/Lead",
  "required_skills": [
    {"skill": "skill name", "importance": "required|preferred", "years": "if specified"}
  ],
  "responsibilities": ["list of key responsibilities"],
  "qualifications": ["education, certifications, etc."],
  "keywords": ["important keywords for ATS"],
  "culture_hints": ["company culture indicators"]
}
```

### 4.2 Skill Gap Analysis

**Analysis Prompt Template:**
```
Compare this resume against the job requirements:

JOB REQUIREMENTS:
{parsed_job}

RESUME:
{parsed_resume}

Provide detailed analysis:
1. SKILL MATCHES: Skills the candidate has that match requirements
   - Rate each match: Strong/Moderate/Weak
   - Note specific evidence from resume

2. SKILL GAPS: Required skills not evident in resume
   - Categorize: Critical/Important/Nice-to-have
   - Suggest how candidate might bridge gap

3. EXPERIENCE ALIGNMENT: How experience maps to responsibilities
   - Relevant experience highlights
   - Missing experience areas

4. ATS OPTIMIZATION: Keywords to add
   - Missing keywords from job description
   - Suggested placements

Return structured JSON with match_percentage (0-100).
```

### 4.3 Question Generation

**Question Prompt Template:**
```
Based on this skill gap analysis, generate 3-5 targeted questions
to help improve the resume:

ANALYSIS:
{analysis_results}

For each skill gap or unclear area, create a question that:
1. Is specific and actionable
2. Helps uncover hidden experience
3. Can result in quantifiable achievements
4. Is conversational but professional

Return as JSON array:
[
  {
    "id": "q1",
    "question": "Question text",
    "purpose": "What this helps with",
    "skill_area": "Related skill or gap",
    "example_answer": "What a good answer looks like"
  }
]
```

### 4.4 Resume Optimization

**Optimization Prompt Template:**
```
Optimize this resume for the target job:

ORIGINAL RESUME:
{original_resume}

TARGET JOB:
{job_description}

USER CLARIFICATIONS:
{qa_answers}

OPTIMIZATION GUIDELINES:
1. SUMMARY: Rewrite to align with job requirements
   - Include top 3 relevant skills
   - Mention years of experience in key areas
   - Add industry-specific keywords

2. EXPERIENCE: Enhance each role
   - Start bullets with strong action verbs
   - Add metrics and quantifiable results
   - Incorporate relevant keywords naturally
   - Highlight transferable skills

3. SKILLS: Reorganize for relevance
   - Lead with skills mentioned in job description
   - Group by category (Technical, Soft Skills, Tools)

4. KEYWORDS: Ensure ATS compatibility
   - Include exact phrases from job description
   - Natural integration, no keyword stuffing

CONSTRAINTS:
- Maintain truthfulness - only enhance, don't fabricate
- Keep professional tone
- Preserve original structure
- Highlight relevant experience more prominently

Return the optimized resume in structured JSON format.
```

---

## 5. MVP vs Future Features

### 5.1 MVP (Version 1.0) - Essential Features

**Core Functionality:**
- [ ] Job description input (URL scraping + text paste)
- [ ] Resume upload (PDF only for MVP)
- [ ] AI analysis with skill matching
- [ ] 3-5 intelligent clarifying questions
- [ ] Optimized resume generation
- [ ] PDF export

**User Experience:**
- [ ] 5-step wizard flow with progress indicator
- [ ] Mobile-responsive design
- [ ] Loading states and skeletons
- [ ] Basic error handling
- [ ] Session persistence (localStorage)

**Infrastructure:**
- [ ] Next.js 14 frontend with shadcn/ui
- [ ] Supabase for database and storage
- [ ] n8n workflows for backend processing
- [ ] Claude API for AI processing

**Technical:**
- [ ] Guest mode (no auth required for MVP)
- [ ] Session-based state management
- [ ] Basic analytics (page views, conversions)

### 5.2 Version 1.1 - Quick Wins

**Enhanced Features:**
- [ ] DOCX file support
- [ ] Plain text export
- [ ] Copy to clipboard
- [ ] Side-by-side diff view
- [ ] Section-level toggle (include/exclude)
- [ ] Email delivery of optimized resume

**UX Improvements:**
- [ ] Keyboard shortcuts
- [ ] Better mobile upload experience
- [ ] Improved error messages
- [ ] Tutorial/onboarding tooltips

### 5.3 Version 2.0 - Growth Features

**User Accounts:**
- [ ] Email/password authentication
- [ ] OAuth (Google, LinkedIn)
- [ ] Save multiple resumes
- [ ] Optimization history
- [ ] User dashboard

**Advanced AI:**
- [ ] Cover letter generation
- [ ] LinkedIn profile optimization
- [ ] Interview preparation tips
- [ ] Salary insights based on role

**Collaboration:**
- [ ] Share optimization with mentor/friend
- [ ] Comment/feedback system
- [ ] Professional review service integration

### 5.4 Version 3.0 - Monetization Features

**Premium Tiers:**
- [ ] Free tier: 2 optimizations/month
- [ ] Pro tier: Unlimited optimizations
- [ ] Enterprise: Team features, API access

**Premium Features:**
- [ ] Multiple resume versions per job
- [ ] Priority AI processing
- [ ] Advanced ATS analysis
- [ ] Industry-specific templates
- [ ] Resume design customization
- [ ] Job matching recommendations

**Integrations:**
- [ ] LinkedIn Easy Apply integration
- [ ] Job board connections (Indeed, Glassdoor)
- [ ] ATS platform partnerships
- [ ] HR tool integrations

---

## 6. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Setup:**
1. Initialize Next.js 14 project with TypeScript
2. Install and configure shadcn/ui
3. Set up Supabase project (database + storage)
4. Configure n8n instance
5. Set up environment variables

**Core Components:**
1. Build wizard container and step components (shells)
2. Implement Zustand store
3. Create UI components (buttons, cards, inputs)
4. Set up Tailwind configuration

### Phase 2: File Handling (Week 2-3)

**Upload System:**
1. Implement Uppy with TUS for resumable uploads
2. Create Supabase storage buckets with RLS
3. Build n8n workflow for PDF text extraction
4. Test upload → parse → display flow

**Job Input:**
1. Build URL input with validation
2. Create n8n scraping workflow
3. Implement text paste alternative
4. Display extracted requirements

### Phase 3: AI Integration (Week 3-4)

**Analysis:**
1. Build n8n analyze workflow with Claude
2. Implement streaming responses
3. Create skill match visualization
4. Build Q&A interface

**Optimization:**
1. Create optimization workflow
2. Implement resume diff view
3. Build ATS score component
4. Add inline editing

### Phase 4: Export & Polish (Week 4-5)

**Export:**
1. Implement PDF generation
2. Create download handler
3. Build export step UI

**Polish:**
1. Add Framer Motion animations
2. Implement error boundaries
3. Add loading skeletons
4. Mobile optimization
5. Performance optimization

### Phase 5: Testing & Launch (Week 5-6)

**Testing:**
1. Unit tests for critical components
2. Integration tests for workflows
3. E2E tests for main user flow
4. Cross-browser testing
5. Mobile testing

**Launch:**
1. Set up monitoring (Vercel Analytics)
2. Configure error tracking (Sentry)
3. Deploy to Vercel
4. Soft launch and gather feedback

---

## 7. WAT Framework Implementation

### 7.1 Workflows Directory Structure

```
workflows/
├── scrape_job_description.md     # Job URL scraping SOP
├── parse_resume.md               # Resume parsing SOP
├── analyze_resume.md             # AI analysis SOP
├── optimize_resume.md            # Resume optimization SOP
├── export_resume.md              # Export generation SOP
└── error_handling.md             # Error recovery procedures
```

### 7.2 Tools Directory Structure

```
tools/
├── pdf_extractor.py              # PDF text extraction
├── docx_converter.py             # DOCX to text
├── job_scraper.py                # Web scraping for job URLs
├── ats_scorer.py                 # ATS compatibility scoring
├── pdf_generator.py              # Optimized resume PDF creation
├── email_sender.py               # Resume email delivery
└── analytics_tracker.py          # Usage analytics
```

### 7.3 Example Workflow Document

```markdown
# workflows/analyze_resume.md

## Objective
Analyze a parsed resume against a job description to identify matches, gaps, and generate clarifying questions.

## Required Inputs
- parsed_resume: JSON object with structured resume data
- parsed_job: JSON object with structured job requirements

## Tools Used
- Claude API for analysis
- tools/ats_scorer.py for compatibility calculation

## Process
1. Send resume and job to Claude with analysis prompt
2. Parse Claude response for skill matches
3. Identify skill gaps and categorize by importance
4. Generate 3-5 clarifying questions
5. Calculate initial ATS score
6. Return structured analysis

## Output Format
{
  "match_percentage": 72,
  "skill_matches": [...],
  "skill_gaps": [...],
  "questions": [...],
  "ats_score": 68,
  "recommendations": [...]
}

## Error Handling
- If Claude rate limited: retry with exponential backoff
- If resume parse failed: return specific error with section
- If analysis incomplete: flag sections needing attention

## Notes
- Analysis typically takes 5-10 seconds
- Cache results by session ID
- Log token usage for cost tracking
```

---

## 8. Technical Considerations

### 8.1 Performance Optimization

- **Code Splitting**: Dynamic imports for step components
- **Image Optimization**: Next.js Image for any graphics
- **Caching**: React Query with stale-while-revalidate
- **Streaming**: Stream AI responses for perceived speed
- **Lazy Loading**: Load Uppy only on upload step

### 8.2 Security Considerations

- **File Validation**: Check MIME types, file size limits
- **RLS**: Row-level security on all Supabase tables
- **API Protection**: Rate limiting on n8n webhooks
- **Secrets**: All API keys in environment variables
- **CORS**: Restricted to known domains

### 8.3 Error Handling Strategy

- **User-Friendly Errors**: Clear messages with recovery actions
- **Retry Logic**: Automatic retry for transient failures
- **Fallbacks**: Text input if URL scraping fails
- **Logging**: Comprehensive error logging for debugging
- **Graceful Degradation**: Core features work even if extras fail

---

## 9. Critical Files for Implementation

Based on this comprehensive plan, here are the most critical files to implement:

| File | Purpose |
|------|---------|
| `src/stores/wizardStore.ts` | Central state management for the entire wizard flow |
| `src/components/wizard/WizardContainer.tsx` | Main orchestrator component managing step transitions |
| `src/lib/n8n/client.ts` | API client for triggering n8n workflows |
| `workflows/analyze_resume.md` | Core workflow SOP defining the AI analysis logic |
| `prisma/schema.prisma` | Database schema defining all models |

---

## 10. Business Context (from project_context.json)

### Project Manifesto
- **Name**: AI Resume Architect
- **Mission**: Replace generic 'resume rewriters' with an intelligent 'Career Interviewer Agent' that extracts hidden value from candidates
- **Target**: Job seekers in Israeli and Global tech market

### Business Model
- **Type**: Micro-transaction / Pay-per-use
- **Pricing**: ~$3-5 / 10-20 ILS per optimized resume
- **Advantage**: Low barrier vs subscription fatigue

### Killer Feature: The Proactive Interviewer
Instead of asking "What did you do?", the AI suggests plausible achievements:
> "As a React dev, did you optimize load times? Usually this results in a 20% boost. Is this true for you?"

### Agent Personas
1. **Recruiter Agent**: Analyze JD - identify top 5 critical requirements, find hiring manager's pain point
2. **Interviewer Agent**: Extract info - be suggestive, look for numbers ($ saved, % improved, time reduced)
3. **Writer Agent**: Draft resume - use active verbs, mirror JD terminology, no hallucinations
