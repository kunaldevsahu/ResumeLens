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
}

interface TemplateEngineProps {
  template: string;
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export default function TemplateEngine({
  template,
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
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
        />
      );
  }
}
