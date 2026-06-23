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

interface ProfessionalTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export default function ProfessionalTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
}: ProfessionalTemplateProps) {
  return (
    <div className="font-serif flex flex-col gap-7 w-full text-left">
      <header className="text-center border-b-2 border-slate-900 pb-6">
        <h1 className="font-['Playfair_Display'] text-4xl font-bold tracking-tight text-slate-900 uppercase">
          {personalInfo.name || "Untitled Name"}
        </h1>
        <p className="font-sans text-xs font-bold tracking-widest text-[#2294f4] mt-2 uppercase">
          {personalInfo.jobTitle || "Job Title"}
        </p>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 mt-4 font-sans">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">mail</span> {personalInfo.email}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">call</span> {personalInfo.phone}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">location_on</span> {personalInfo.location}
          </span>
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">link</span> {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      {summary && (
        <section>
          <h2 className="font-['Playfair_Display'] text-base font-bold border-b border-slate-200 pb-1.5 mb-3 uppercase tracking-widest">
            Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 font-sans">{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <h2 className="font-['Playfair_Display'] text-base font-bold border-b border-slate-200 pb-1.5 mb-3 uppercase tracking-widest">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm text-slate-900 font-sans">
                    {exp.role} <span className="font-light text-slate-400">|</span> {exp.company}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-sans font-semibold">{exp.dates}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap font-sans">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills && (
        <section>
          <h2 className="font-['Playfair_Display'] text-base font-bold border-b border-slate-200 pb-1.5 mb-3 uppercase tracking-widest">
            Expertise
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2 font-sans">
            {skills.split(",").map((s, idx) => (
              <span key={idx} className="text-xs font-semibold text-slate-700 uppercase">
                • {s.trim()}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8 font-sans">
        {education.length > 0 && (
          <section>
            <h2 className="font-['Playfair_Display'] text-base font-bold border-b border-slate-200 pb-1.5 mb-3 uppercase tracking-widest">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-xs text-slate-900">{edu.degree}</h3>
                  <p className="text-xs text-slate-600 italic mt-0.5">{edu.school}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {edu.dates} (GPA: {edu.gpa})
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="font-['Playfair_Display'] text-base font-bold border-b border-slate-200 pb-1.5 mb-3 uppercase tracking-widest">
              Key Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-xs text-slate-900">{proj.name}</h3>
                  <p className="text-[10px] font-bold text-[#2294f4] uppercase tracking-wider mt-0.5">
                    {proj.tech}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
