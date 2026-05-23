export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  avatar?: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
}

export type TemplateId = "classic" | "modern" | "editorial" | "technical";
export type AccentColor = "indigo" | "emerald" | "slate" | "amber" | "rose" | "violet" | "sky";
export type FontFamily = "font-sans" | "font-serif" | "font-mono";
export type SpacingSize = "compact" | "normal" | "relaxed";

export interface TemplateSettings {
  templateId: TemplateId;
  accentColor: AccentColor;
  fontFamily: FontFamily;
  spacing: SpacingSize;
  showAvatar: boolean;
}
