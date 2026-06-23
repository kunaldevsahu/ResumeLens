"use client";

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

interface MinimalTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export default function MinimalTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
}: MinimalTemplateProps) {
  
  const renderDescription = (desc: string) => {
    if (!desc) return null;
    const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
    const isBulletList = lines.some(l => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
    
    if (isBulletList) {
      return (
        <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-[10.5px] text-slate-500 leading-relaxed font-normal">
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*\s]+/, "");
            return <li key={idx}>{cleanLine}</li>;
          })}
        </ul>
      );
    }
    
    return <p className="text-[10.5px] leading-relaxed text-slate-500 whitespace-pre-wrap mt-1.5 font-normal">{desc}</p>;
  };

  return (
    <div className="font-['Inter'] flex flex-col gap-6 w-full text-left bg-white text-slate-800 px-4 py-2">
      {/* Header (Flex justify-between) */}
      <header className="flex justify-between items-baseline border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-medium text-slate-900 tracking-tight">
            {personalInfo.name || "Untitled Name"}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {personalInfo.jobTitle || "Job Title"}
          </p>
        </div>

        {/* Contact list in compact block */}
        <div className="text-[9.5px] text-slate-500 space-y-0.5 text-right font-medium">
          {personalInfo.location && <div>{personalInfo.location}</div>}
          <div className="flex gap-2 justify-end">
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          </div>
          {personalInfo.website && (
            <div>
              <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-400">{personalInfo.website}</a>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="space-y-1">
          <h2 className="text-xs font-semibold text-slate-900">
            About
          </h2>
          <p className="text-[10.5px] leading-relaxed text-slate-500 font-normal">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-900">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-[10.5px] text-slate-950">
                    {exp.role} at <span className="text-slate-600">{exp.company}</span>
                  </h3>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {exp.dates}
                  </span>
                </div>
                {renderDescription(exp.description)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-900">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-[10.5px] text-slate-950">
                    {proj.name}
                  </h3>
                  <span className="text-[9px] text-slate-400 font-medium font-mono">
                    {proj.tech}
                  </span>
                </div>
                {renderDescription(proj.description)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section className="space-y-1">
          <h2 className="text-xs font-semibold text-slate-900">
            Skills
          </h2>
          <p className="text-[10.5px] leading-relaxed text-slate-500">
            {skills.split(",").map(s => s.trim()).join(", ")}
          </p>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold text-slate-900">
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium text-[10.5px] text-slate-950">{edu.school}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{edu.degree}</p>
                </div>
                <div className="text-right text-[9px] text-slate-400 font-medium">
                  <div>{edu.dates}</div>
                  {edu.gpa && <div>GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
