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

interface ExecutiveTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export default function ExecutiveTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
}: ExecutiveTemplateProps) {
  
  const renderDescription = (desc: string) => {
    if (!desc) return null;
    const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
    const isBulletList = lines.some(l => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
    
    if (isBulletList) {
      return (
        <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-[10.5px] text-slate-700 leading-relaxed font-sans">
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*\s]+/, "");
            return <li key={idx}>{cleanLine}</li>;
          })}
        </ul>
      );
    }
    
    return <p className="text-[10.5px] leading-relaxed text-slate-700 whitespace-pre-wrap mt-1.5 font-sans">{desc}</p>;
  };

  return (
    <div className="font-serif flex flex-col gap-5 w-full text-center bg-white text-[#1e293b] px-4 py-2">
      {/* Centered Header with Double Borders */}
      <header className="border-t-2 border-b-2 border-double border-slate-700 py-4 flex flex-col items-center">
        <h1 className="font-['Playfair_Display'] text-3xl font-bold tracking-tight text-slate-900 uppercase">
          {personalInfo.name || "Untitled Name"}
        </h1>
        <p className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#854d0e] mt-1.5 uppercase">
          {personalInfo.jobTitle || "Job Title"}
        </p>
        
        {/* Centered contact info row */}
        <div className="flex justify-center flex-wrap gap-x-5 gap-y-1 text-[9.5px] text-slate-500 font-sans mt-3.5 font-medium">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#854d0e] font-light">mail</span> 
              <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 hover:underline">{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#854d0e] font-light">call</span> 
              <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-600 hover:underline">{personalInfo.phone}</a>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#854d0e] font-light">location_on</span> 
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#854d0e] font-light">link</span> 
              <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{personalInfo.website}</a>
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="text-left">
          <h2 className="font-['Playfair_Display'] text-xs font-bold border-b border-slate-200 pb-1 mb-2.5 uppercase tracking-[0.15em] text-slate-800 text-center">
            Executive Summary
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-700 font-sans">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="text-left">
          <h2 className="font-['Playfair_Display'] text-xs font-bold border-b border-slate-200 pb-1 mb-3 uppercase tracking-[0.15em] text-slate-800 text-center">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[11px] text-slate-900 font-sans">
                    {exp.role} <span className="font-light text-slate-300 mx-1">|</span> <span className="font-semibold text-[#854d0e]">{exp.company}</span>
                  </h3>
                  <span className="text-[9px] text-slate-500 font-sans font-bold uppercase tracking-wider">{exp.dates}</span>
                </div>
                {renderDescription(exp.description)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="text-left">
          <h2 className="font-['Playfair_Display'] text-xs font-bold border-b border-slate-200 pb-1 mb-3 uppercase tracking-[0.15em] text-slate-800 text-center">
            Key Initiatives & Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[11px] text-slate-900 font-sans">{proj.name}</h3>
                  {proj.tech && (
                    <span className="text-[8.5px] font-bold text-slate-500 font-sans bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
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

      {/* Skills & Education side-by-side or stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left border-t border-slate-100 pt-3">
        {skills && (
          <section>
            <h2 className="font-['Playfair_Display'] text-xs font-bold border-b border-slate-200 pb-1 mb-2.5 uppercase tracking-[0.15em] text-slate-800">
              Expertise & Skills
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-sans pt-1">
              {skills.split(",").map((s, idx) => (
                <span key={idx} className="text-[10px] font-semibold text-slate-700">
                  • {s.trim()}
                </span>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="font-['Playfair_Display'] text-xs font-bold border-b border-slate-200 pb-1 mb-2.5 uppercase tracking-[0.15em] text-slate-800">
              Education
            </h2>
            <div className="space-y-2.5 pt-1">
              {education.map((edu) => (
                <div key={edu.id} className="font-sans text-[10px]">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900">{edu.school}</h4>
                    <span className="text-[8.5px] font-bold text-slate-500">{edu.dates}</span>
                  </div>
                  <p className="text-slate-600 italic mt-0.5">{edu.degree}</p>
                  {edu.gpa && <p className="text-[8.5px] text-slate-400 mt-0.5">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
