export interface RequiredSkill {
  skill: string;
  importance: "required" | "preferred" | "nice-to-have";
  years?: string;
}

export interface ParsedJobDescription {
  title: string;
  company?: string;
  location?: string;
  experienceLevel?: "entry" | "mid" | "senior" | "lead" | "executive";
  requiredSkills: RequiredSkill[];
  responsibilities: string[];
  qualifications: string[];
  keywords: string[];
  cultureHints?: string[];
  salaryRange?: string;
  rawText: string;
}

export interface SkillMatch {
  skill: string;
  strength: "strong" | "moderate" | "weak";
  evidence: string;
}

export interface SkillGap {
  skill: string;
  importance: "critical" | "important" | "nice-to-have";
  suggestion: string;
}

export interface AIQuestion {
  id: string;
  question: string;
  purpose: string;
  skillArea: string;
  exampleAnswer?: string;
}

export interface Analysis {
  matchPercentage: number;
  skillMatches: SkillMatch[];
  skillGaps: SkillGap[];
  questions: AIQuestion[];
  recommendations: string[];
  atsScore: number;
}
