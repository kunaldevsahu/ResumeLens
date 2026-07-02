"use client";

import ModernATSTemplate from "./ModernATSTemplate";
import CorporateTemplate from "./CorporateTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import TwoColumnTemplate from "./TwoColumnTemplate";
import DeveloperTemplate from "./DeveloperTemplate";
import MinimalTemplate from "./MinimalTemplate";
import StartupTemplate from "./StartupTemplate";
import CreativeTemplate from "./CreativeTemplate";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  location: string;
  website: string;
  linkedin?: string;
  github?: string;
  codeforces?: string;
  leetcode?: string;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  dates: string;
  description: string;
}

interface EducationItem {
  id: string;
  degree: string;
  school: string;
  dates: string;
  gpa: string;
}

interface ProjectItem {
  id: string;
  name: string;
  tech: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  dates?: string;
  link?: string;
}

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  dates: string;
  link?: string;
}

interface ResumeSettings {
  fontSize?: "sm" | "md" | "lg";
  spacing?: "compact" | "normal" | "spacious";
  sectionOrder?: string[];
}

interface TemplateEngineProps {
  template: string;
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  settings?: ResumeSettings;
}

export default function TemplateEngine({
  template,
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  settings,
}: TemplateEngineProps) {
  // Normalize template names to match the supported set
  const templateId = template?.toLowerCase() || "modern-ats";

  switch (templateId) {
    case "corporate":
      return (
        <CorporateTemplate
          personalInfo={personalInfo}
          summary={summary}
          skills={skills}
          experience={experience}
          education={education}
          projects={projects}
          certifications={certifications}
          settings={settings}
        />
      );
    case "executive":
    case "professional":
    case "professional-classic":
      return (
        <ExecutiveTemplate
          personalInfo={personalInfo}
          summary={summary}
          skills={skills}
          experience={experience}
          education={education}
          projects={projects}
          certifications={certifications}
          settings={settings}
        />
      );
    case "two-column":
    case "bronzor":
    case "onyx":
      return (
        <TwoColumnTemplate
          personalInfo={personalInfo}
          summary={summary}
          skills={skills}
          experience={experience}
          education={education}
          projects={projects}
          certifications={certifications}
          settings={settings}
        />
      );
    case "developer":
    case "dev-focus":
      return (
        <DeveloperTemplate
          personalInfo={personalInfo}
          summary={summary}
          skills={skills}
          experience={experience}
          education={education}
          projects={projects}
          certifications={certifications}
          settings={settings}
        />
      );
    case "minimal":
      return (
        <MinimalTemplate
          personalInfo={personalInfo}
          summary={summary}
          skills={skills}
          experience={experience}
          education={education}
          projects={projects}
          certifications={certifications}
          settings={settings}
        />
      );
    case "startup":
      return (
        <StartupTemplate
          personalInfo={personalInfo}
          summary={summary}
          skills={skills}
          experience={experience}
          education={education}
          projects={projects}
          certifications={certifications}
          settings={settings}
        />
      );
    case "creative":
      return (
        <CreativeTemplate
          personalInfo={personalInfo}
          summary={summary}
          skills={skills}
          experience={experience}
          education={education}
          projects={projects}
          certifications={certifications}
          settings={settings}
        />
      );
    case "modern-ats":
    default:
      return (
        <ModernATSTemplate
          personalInfo={personalInfo}
          summary={summary}
          skills={skills}
          experience={experience}
          education={education}
          projects={projects}
          certifications={certifications}
          settings={settings}
        />
      );
  }
}
