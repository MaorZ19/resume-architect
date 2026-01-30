export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface ParsedResume {
  contact: ContactInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications?: string[];
  rawText: string;
}

export interface OptimizedResume extends ParsedResume {
  optimizedSummary: string;
  optimizedExperience: Experience[];
  addedKeywords: string[];
  atsScore: number;
  changes: ResumeChange[];
}

export interface ResumeChange {
  section: string;
  original: string;
  optimized: string;
  reason: string;
}
