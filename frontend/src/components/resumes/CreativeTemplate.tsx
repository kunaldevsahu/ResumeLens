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

interface CreativeTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export default function CreativeTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
}: CreativeTemplateProps) {
  
  const renderDescription = (desc: string) => {
    if (!desc) return null;
    const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
    const isBulletList = lines.some(l => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
    
    if (isBulletList) {
      return (
        <ul className="list-disc pl-4 mt-1.5 space-y-0.5 text-[10.5px] text-[#44403c] leading-relaxed font-sans font-normal">
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*\s]+/, "");
            return <li key={idx}>{cleanLine}</li>;
          })}
        </ul>
      );
    }
    
    return <p className="text-[10.5px] leading-relaxed text-[#44403c] whitespace-pre-wrap mt-1.5 font-sans font-normal">{desc}</p>;
  };

  return (
    <div className="font-sans flex flex-col gap-6 w-full text-left bg-[#fafaf7] text-[#1c1917] p-5 rounded min-h-[842px]">
      {/* Asymmetric Elegant Header */}
      <header className="border-b border-[#e7e5e4] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1c1917] tracking-tight leading-tight">
            {personalInfo.name || "Untitled Name"}
          </h1>
          <p className="font-sans text-[10.5px] font-bold text-[#c2410c] tracking-widest uppercase mt-1">
            {personalInfo.jobTitle || "Job Title"}
          </p>
        </div>

        {/* Contact links block */}
        <div className="flex flex-wrap sm:flex-col gap-x-4 gap-y-1 text-[9.5px] text-[#78716c] font-medium text-left sm:text-right">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:text-[#c2410c] hover:underline">{personalInfo.email}</a>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.website && <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#c2410c] hover:underline font-mono">{personalInfo.website}</a>}
        </div>
      </header>

      {/* Two Asymmetrical Columns (40% Left, 60% Right) */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Left Column (col-span-5 / 40%) */}
        <div className="col-span-5 flex flex-col gap-5">
          {/* Summary / Profile statement */}
          {summary && (
            <section className="space-y-1.5">
              <h2 className="font-['Playfair_Display'] text-xs font-bold text-[#c2410c] uppercase tracking-wider">
                Profile
              </h2>
              <p className="text-[10.5px] leading-relaxed text-[#44403c] font-normal">
                {summary}
              </p>
            </section>
          )}

          {/* Skills / Tech */}
          {skills && (
            <section className="space-y-2">
              <h2 className="font-['Playfair_Display'] text-xs font-bold text-[#c2410c] uppercase tracking-wider">
                Capabilities
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.split(",").map((s, idx) => (
                  <span key={idx} className="bg-[#f5f5f0] border border-[#e7e5e4] text-[#44403c] text-[8.5px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="space-y-2.5">
              <h2 className="font-['Playfair_Display'] text-xs font-bold text-[#c2410c] uppercase tracking-wider">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <h4 className="font-bold text-[10px] text-[#1c1917] leading-tight">
                      {edu.degree}
                    </h4>
                    <p className="text-[9.5px] text-[#78716c] italic">
                      {edu.school}
                    </p>
                    <div className="flex justify-between text-[8.5px] text-[#a8a29e] mt-0.5">
                      <span>{edu.dates}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (col-span-7 / 60%) */}
        <div className="col-span-7 flex flex-col gap-5 border-l border-[#e7e5e4] pl-5">
          {/* Work Experience */}
          {experience.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-['Playfair_Display'] text-xs font-bold text-[#c2410c] uppercase tracking-wider">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[10.5px] text-[#1c1917]">
                        {exp.role}
                      </h3>
                      <span className="text-[8.5px] font-bold text-[#78716c] uppercase tracking-wider">
                        {exp.dates}
                      </span>
                    </div>
                    {exp.company && (
                      <p className="text-[9.5px] font-semibold text-[#c2410c] italic">
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
              <h2 className="font-['Playfair_Display'] text-xs font-bold text-[#c2410c] uppercase tracking-wider">
                Featured Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[10.5px] text-[#1c1917]">
                        {proj.name}
                      </h3>
                      {proj.tech && (
                        <span className="text-[8.5px] font-bold text-[#78716c] uppercase tracking-wider font-mono">
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
        </div>

      </div>
    </div>
  );
}
