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

interface DeveloperTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export default function DeveloperTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
}: DeveloperTemplateProps) {
  
  const renderDescription = (desc: string) => {
    if (!desc) return null;
    const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
    const isBulletList = lines.some(l => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
    
    if (isBulletList) {
      return (
        <ul className="mt-1.5 space-y-0.5 text-[10px] text-slate-500 leading-relaxed font-mono">
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*\s]+/, "");
            return (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-teal-600 shrink-0 select-none">-</span>
                <span>{cleanLine}</span>
              </li>
            );
          })}
        </ul>
      );
    }
    
    return <p className="text-[10px] leading-relaxed text-slate-500 whitespace-pre-wrap mt-1.5 font-mono">{desc}</p>;
  };

  return (
    <div className="font-mono flex flex-col gap-5 w-full text-left bg-white text-slate-900 px-4 py-2">
      {/* Console Header */}
      <header className="border-b-2 border-slate-900 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          <span className="text-teal-600 font-extrabold select-none">&gt;</span> {personalInfo.name || "Untitled Name"}
        </h1>
        <p className="text-xs font-bold text-blue-600 mt-1 tracking-wider">
          <span className="text-slate-400 select-none">$</span> export ROLE=&quot;{personalInfo.jobTitle || "Job Title"}&quot;
        </p>
        
        {/* Contact detail rows resembling terminal configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-[9.5px] text-slate-500 border-t border-slate-100 pt-3">
          <div><span className="text-teal-600 font-bold select-none">[email]</span> {personalInfo.email}</div>
          <div><span className="text-teal-600 font-bold select-none">[phone]</span> {personalInfo.phone}</div>
          <div><span className="text-teal-600 font-bold select-none">[location]</span> {personalInfo.location}</div>
          {personalInfo.website && (
            <div><span className="text-teal-600 font-bold select-none">[website]</span> <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.website}</a></div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider select-none">
            <span className="text-teal-600">//</span> Summary
          </h2>
          <p className="text-[10.5px] leading-relaxed text-slate-600 font-normal">{summary}</p>
        </section>
      )}

      {/* Technical Stack / Skills */}
      {skills && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider select-none">
            <span className="text-teal-600">//</span> Technical Stack
          </h2>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {skills.split(",").map((s, idx) => (
              <span
                key={idx}
                className="bg-slate-50 border border-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-700"
              >
                [{s.trim()}]
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider select-none">
            <span className="text-teal-600">//</span> Work History
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l border-slate-200 pl-3">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[10.5px] text-slate-900">
                    {exp.role} <span className="text-blue-600 font-normal">@ {exp.company}</span>
                  </h3>
                  <span className="text-[9px] text-slate-400 font-semibold">{exp.dates}</span>
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
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider select-none">
            <span className="text-teal-600">//</span> Repositories &amp; Initiatives
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="border border-dashed border-slate-200 hover:border-slate-300 p-3 rounded bg-slate-50/50">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[10.5px] text-slate-900">
                    url: {proj.name}
                  </h3>
                  {proj.tech && (
                    <span className="text-[8.5px] bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {proj.tech}
                    </span>
                  )}
                </div>
                {renderDescription(proj.description)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider select-none">
            <span className="text-teal-600">//</span> Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-[10.5px] text-slate-900">{edu.school}</h3>
                  <p className="text-[10px] text-slate-500 italic mt-0.5">{edu.degree}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-600 font-semibold">{edu.dates}</p>
                  {edu.gpa && <p className="text-[8.5px] text-slate-400 mt-0.5">GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
