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

interface TwoColumnTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export default function TwoColumnTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
}: TwoColumnTemplateProps) {
  
  const renderDescription = (desc: string) => {
    if (!desc) return null;
    const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
    const isBulletList = lines.some(l => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
    
    if (isBulletList) {
      return (
        <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[10px] text-slate-600 leading-relaxed font-normal">
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*\s]+/, "");
            return <li key={idx}>{cleanLine}</li>;
          })}
        </ul>
      );
    }
    
    return <p className="text-[10px] leading-relaxed text-slate-600 whitespace-pre-wrap mt-1 font-normal">{desc}</p>;
  };

  return (
    <div className="font-['Inter'] grid grid-cols-12 w-full text-left bg-white text-slate-800 border border-slate-100 rounded shadow-sm overflow-hidden min-h-[842px]">
      
      {/* Left Sidebar (33% width / 4 cols of 12) */}
      <aside className="col-span-4 bg-slate-50/70 p-4 border-r border-slate-200 flex flex-col gap-4">
        {/* Name and Job Title */}
        <div>
          <h1 className="font-['Geist'] text-lg font-bold text-slate-900 leading-tight">
            {personalInfo.name || "Untitled Name"}
          </h1>
          <p className="font-['Geist'] text-[10px] font-semibold text-blue-600 tracking-wider uppercase mt-1">
            {personalInfo.jobTitle || "Job Title"}
          </p>
        </div>

        {/* Contact Links */}
        <div className="space-y-2 text-[10px] text-slate-600 border-t border-slate-200/60 pt-3">
          <h3 className="font-['Geist'] text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Contact
          </h3>
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {personalInfo.location}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.104-6.928-6.928l1.293-.97.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-600 hover:underline truncate">{personalInfo.phone}</a>
            </span>
          )}
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 hover:underline truncate">{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
              <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline truncate">{personalInfo.website}</a>
            </span>
          )}
        </div>

        {/* Profile Summary in Sidebar */}
        {summary && (
          <div className="border-t border-slate-200/60 pt-3">
            <h3 className="font-['Geist'] text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Profile
            </h3>
            <p className="text-[10px] leading-relaxed text-slate-600 font-normal">
              {summary}
            </p>
          </div>
        )}

        {/* Skills in Sidebar */}
        {skills && (
          <div className="border-t border-slate-200/60 pt-3">
            <h3 className="font-['Geist'] text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Expertise
            </h3>
            <div className="flex flex-wrap gap-1">
              {skills.split(",").map((s, idx) => (
                <span key={idx} className="bg-slate-200/50 border border-slate-200 text-slate-700 text-[8.5px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide">
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education in Sidebar */}
        {education.length > 0 && (
          <div className="border-t border-slate-200/60 pt-3">
            <h3 className="font-['Geist'] text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Education
            </h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <h4 className="font-bold text-[9.5px] text-slate-900 leading-tight">
                    {edu.degree}
                  </h4>
                  <p className="text-[9px] text-slate-600 italic">
                    {edu.school}
                  </p>
                  <div className="flex justify-between text-[8px] text-slate-400 font-semibold uppercase mt-0.5">
                    <span>{edu.dates}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right Column - Work Experience & Projects (67% width / 8 cols of 12) */}
      <main className="col-span-8 p-5 flex flex-col gap-5">
        
        {/* Work Experience */}
        {experience.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-['Geist'] text-[11px] font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[10.5px] text-slate-900">
                      {exp.role}
                    </h3>
                    <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider">
                      {exp.dates}
                    </span>
                  </div>
                  {exp.company && (
                    <p className="text-[9.5px] font-semibold text-blue-600">
                      {exp.company}
                    </p>
                  )}
                  {renderDescription(exp.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-['Geist'] text-[11px] font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">
              Featured Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[10.5px] text-slate-900">
                      {proj.name}
                    </h3>
                    {proj.tech && (
                      <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider">
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
      </main>
    </div>
  );
}
