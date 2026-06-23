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

interface ModernATSTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export default function ModernATSTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
}: ModernATSTemplateProps) {
  
  // Helper to parse description text (split by newlines) and render clean HTML bullets
  const renderDescription = (desc: string) => {
    if (!desc) return null;
    const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
    const isBulletList = lines.some(l => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
    
    if (isBulletList) {
      return (
        <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-slate-600 leading-relaxed font-normal">
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*\s]+/, "");
            return <li key={idx}>{cleanLine}</li>;
          })}
        </ul>
      );
    }
    
    return <p className="text-[11px] leading-relaxed text-slate-600 whitespace-pre-wrap mt-1 font-normal">{desc}</p>;
  };

  return (
    <div className="font-['Inter'] flex flex-col gap-5 w-full text-left bg-white text-slate-800 px-2">
      {/* Centered Header Section */}
      <header className="flex flex-col items-center text-center pb-2">
        <h1 className="font-['Geist'] text-2xl font-bold text-slate-900 tracking-tight mb-1">
          {personalInfo.name || "Untitled Name"}
        </h1>
        <p className="font-['Geist'] text-xs font-semibold text-slate-700 tracking-wider uppercase mb-3">
          {personalInfo.jobTitle || "Job Title"}
        </p>
        
        {/* Contact info items with custom monochrome inline SVG icons */}
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-slate-600 font-medium">
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {personalInfo.location}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.104-6.928-6.928l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-500 hover:underline">{personalInfo.phone}</a>
            </span>
          )}
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-500 hover:underline">{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
              <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">{personalInfo.website}</a>
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary Section */}
      {summary && (
        <section className="space-y-1.5">
          <h2 className="font-['Geist'] text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 tracking-wide uppercase">
            Professional Summary
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-600 font-normal">{summary}</p>
        </section>
      )}

      {/* Work Experience Section */}
      {experience.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-['Geist'] text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 tracking-wide uppercase">
            Work Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                {/* Row 1: Role & Date */}
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[11px] text-slate-900">
                    {exp.role || "Software Engineer"}
                  </h3>
                  <span className="text-[9px] font-bold text-slate-500 font-['Geist'] uppercase tracking-wider">
                    {exp.dates}
                  </span>
                </div>
                
                {/* Row 2: Company Name */}
                {exp.company && (
                  <p className="text-[10px] font-semibold text-slate-700">
                    {exp.company}
                  </p>
                )}
                
                {/* Bullet list description */}
                {renderDescription(exp.description)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-['Geist'] text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 tracking-wide uppercase">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[11px] text-slate-900">{proj.name}</h3>
                  {proj.tech && (
                    <span className="text-[9px] font-bold text-slate-500 font-['Geist'] uppercase tracking-wider">
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

      {/* Key Expertise & Skills Section */}
      {skills && (
        <section className="space-y-1.5">
          <h2 className="font-['Geist'] text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 tracking-wide uppercase">
            Skills
          </h2>
          <div className="text-[11px] leading-relaxed text-slate-600 font-medium">
            {skills.split(",").map((s) => s.trim()).join("   •   ")}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-['Geist'] text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 tracking-wide uppercase">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[11px] text-slate-900">{edu.school}</h3>
                  <span className="text-[9px] font-bold text-slate-500 font-['Geist'] uppercase tracking-wider">
                    {edu.dates}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mt-0.5">
                  <p className="text-[10px] text-slate-600 italic">{edu.degree}</p>
                  {edu.gpa && (
                    <p className="text-[9px] text-slate-400">GPA: {edu.gpa}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
