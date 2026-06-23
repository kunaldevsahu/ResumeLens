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

interface StartupTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export default function StartupTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
}: StartupTemplateProps) {
  
  const renderDescription = (desc: string) => {
    if (!desc) return null;
    const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
    const isBulletList = lines.some(l => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
    
    if (isBulletList) {
      return (
        <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-[10.5px] text-slate-600 leading-relaxed font-normal">
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*\s]+/, "");
            return <li key={idx}>{cleanLine}</li>;
          })}
        </ul>
      );
    }
    
    return <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap mt-1.5 font-normal">{desc}</p>;
  };

  return (
    <div className="font-['Geist'] flex flex-col gap-5 w-full text-left bg-white text-slate-800 px-4 py-2">
      {/* Header */}
      <header className="flex flex-col gap-2 border-b-2 border-slate-100 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {personalInfo.name || "Untitled Name"}
            </h1>
            <p className="text-xs font-bold text-[#4f46e5] tracking-wider uppercase mt-0.5">
              {personalInfo.jobTitle || "Job Title"}
            </p>
          </div>
          
          {/* Accent-colored Contact details block */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 mt-2 sm:mt-0 font-medium">
            {personalInfo.location && (
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {personalInfo.location}
              </span>
            )}
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1 hover:text-[#4f46e5] hover:underline bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {personalInfo.email}
              </a>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.website && (
              <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#4f46e5] hover:underline bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {personalInfo.website}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            About
          </h2>
          <p className="text-[10.5px] leading-relaxed text-slate-700 font-normal">{summary}</p>
        </section>
      )}

      {/* Work History */}
      {experience.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[10.5px] text-slate-900">
                    {exp.role} <span className="text-[#4f46e5]">@ {exp.company}</span>
                  </h3>
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((proj) => (
              <div key={proj.id} className="border border-slate-100 hover:border-slate-200 p-3 rounded-lg transition-colors bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[10.5px] text-slate-900 leading-tight">{proj.name}</h3>
                  </div>
                  {renderDescription(proj.description)}
                </div>
                {proj.tech && (
                  <div className="mt-2 text-[8px] font-bold text-[#4f46e5] uppercase tracking-wider font-mono">
                    {proj.tech}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
        {skills && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.split(",").map((s, idx) => (
                <span key={idx} className="bg-indigo-50 border border-indigo-100/50 text-[#4f46e5] text-[8.5px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                  {s.trim()}
                </span>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[10px] text-slate-900">{edu.school}</h3>
                    <span className="text-[8px] font-bold text-slate-400">{edu.dates}</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span className="italic">{edu.degree}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
