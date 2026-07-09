"use client";

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

interface CreativeTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  settings?: ResumeSettings;
}

export default function CreativeTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  settings,
}: CreativeTemplateProps) {
  const fontSize = settings?.fontSize || "md";
  const spacing = settings?.spacing || "normal";
  const sectionOrder = settings?.sectionOrder || ["summary", "education", "experience", "projects", "certifications", "skills"];

  const sizeClasses = {
    sm: {
      name: "text-xl",
      title: "text-[10px]",
      contactText: "text-[8.5px]",
      sectionTitle: "text-[10px]",
      body: "text-[9.5px]",
      sub: "text-[8.5px]",
    },
    md: {
      name: "text-2xl",
      title: "text-xs",
      contactText: "text-[9.5px]",
      sectionTitle: "text-xs",
      body: "text-[10.5px]",
      sub: "text-[9px]",
    },
    lg: {
      name: "text-3xl",
      title: "text-sm",
      contactText: "text-[11px]",
      sectionTitle: "text-sm",
      body: "text-[11.5px]",
      sub: "text-[10px]",
    },
  }[fontSize];

  const spacingClasses = {
    compact: {
      containerGap: "gap-3",
      sectionGap: "space-y-1.5",
      itemGap: "space-y-0.5",
      bodyPadding: "p-4.5",
      paddingBottom: "pb-1",
    },
    normal: {
      containerGap: "gap-5",
      sectionGap: "space-y-2.5",
      itemGap: "space-y-1",
      bodyPadding: "p-6",
      paddingBottom: "pb-1.5",
    },
    spacious: {
      containerGap: "gap-7",
      sectionGap: "space-y-4",
      itemGap: "space-y-2",
      bodyPadding: "p-8",
      paddingBottom: "pb-2",
    },
  }[spacing];

  const parseMarkdown = (text: string) => {
    if (!text) return "";
    let parsed = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    parsed = parsed.replace(/__(.*?)__/g, "<strong>$1</strong>");
    parsed = parsed.replace(/\*(.*?)\*/g, "<em>$1</em>");
    parsed = parsed.replace(/_(.*?)_/g, "<em>$1</em>");
    parsed = parsed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-semibold inline-flex items-center">$1</a>');
    return parsed;
  };

  const renderDescription = (desc: string) => {
    if (!desc) return null;
    const lines = desc.split("\n").map(l => l.trim()).filter(Boolean);
    const isBulletList = lines.some(l => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
    
    if (isBulletList) {
      return (
        <ul className="list-disc pl-4 mt-1.5 space-y-0.5 leading-relaxed font-sans font-normal text-slate-600" style={{ fontSize: sizeClasses.body }}>
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*\s]+/, "");
            return (
              <li 
                key={idx} 
                dangerouslySetInnerHTML={{ __html: parseMarkdown(cleanLine) }}
              />
            );
          })}
        </ul>
      );
    }
    
    return (
      <p 
        className="leading-relaxed text-slate-600 whitespace-pre-wrap mt-1.5 font-sans font-normal" 
        style={{ fontSize: sizeClasses.body }}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(desc).replace(/\n/g, "<br />") }}
      />
    );
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        return summary && (
          <section key="summary" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-900 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wider`}>
              Profile
            </h2>
            <p 
              className={`${sizeClasses.body} leading-relaxed text-slate-600 font-normal`}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(summary).replace(/\n/g, "<br />") }}
            />
          </section>
        );
      case "experience":
        return experience.length > 0 && (
          <section key="experience" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-900 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wider`}>
              Experience
            </h2>
            <div className={spacingClasses.containerGap === "gap-3" ? "space-y-3" : "space-y-4"}>
              {experience.map((exp) => (
                <div key={exp.id} className={spacingClasses.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-bold text-slate-900 flex items-center gap-1.5`} style={{ fontSize: sizeClasses.body }}>
                      {exp.role} 
                      {exp.company && <span className="font-semibold text-slate-500">at {exp.company}</span>}
                    </h3>
                    <span className={`${sizeClasses.sub} font-bold text-slate-500 uppercase tracking-wider`}>
                      {exp.dates}
                    </span>
                  </div>
                  {renderDescription(exp.description)}
                </div>
              ))}
            </div>
          </section>
        );
      case "projects":
        return projects.length > 0 && (
          <section key="projects" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-900 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wider`}>
              Featured Projects
            </h2>
            <div className={spacingClasses.containerGap === "gap-3" ? "space-y-2.5" : "space-y-3"}>
              {projects.map((proj) => {
                const links = [];
                if (proj.githubUrl) {
                  links.push(
                    <a key="gh" href={proj.githubUrl.startsWith("http") ? proj.githubUrl : `https://${proj.githubUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                      GitHub
                    </a>
                  );
                }
                if (proj.demoUrl) {
                  links.push(
                    <a key="demo" href={proj.demoUrl.startsWith("http") ? proj.demoUrl : `https://${proj.demoUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                      Demo
                    </a>
                  );
                }

                return (
                  <div key={proj.id} className={spacingClasses.itemGap}>
                    <div className="flex justify-between items-baseline">
                      <h3 className={`font-bold text-slate-900 flex items-center gap-1.5`} style={{ fontSize: sizeClasses.body }}>
                        {proj.name}
                        {links.length > 0 && (
                          <span className="font-normal text-slate-400 text-[9px] flex items-center gap-1">
                            ({links.map((link, i) => (
                              <span key={i} className="flex items-center gap-1">
                                {link}
                                {i < links.length - 1 && <span className="text-slate-300">|</span>}
                              </span>
                            ))})
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-3">
                        {proj.tech && (
                          <span className="font-bold text-slate-500 uppercase tracking-wider font-mono" style={{ fontSize: sizeClasses.sub }}>
                            {proj.tech}
                          </span>
                        )}
                        {proj.dates && (
                          <span className="font-bold text-slate-500 uppercase tracking-wider" style={{ fontSize: sizeClasses.sub }}>
                            {proj.dates}
                          </span>
                        )}
                      </div>
                    </div>
                    {renderDescription(proj.description)}
                  </div>
                );
              })}
            </div>
          </section>
        );
      case "education":
        return education.length > 0 && (
          <section key="education" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-900 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wider`}>
              Education
            </h2>
            <div className="overflow-hidden border border-slate-200 rounded-lg mt-2 font-sans">
              <table className="w-full text-left border-collapse" style={{ fontSize: sizeClasses.body }}>
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="px-3 py-2 font-bold uppercase tracking-wider text-[8px]">Course / Degree</th>
                    <th className="px-3 py-2 font-bold uppercase tracking-wider text-[8px]">Institution</th>
                    <th className="px-3 py-2 font-bold uppercase tracking-wider text-[8px] text-center">Year</th>
                    <th className="px-3 py-2 font-bold uppercase tracking-wider text-[8px] text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {education.map((edu) => (
                    <tr key={edu.id} className="border-t border-slate-200 hover:bg-slate-50/50">
                      <td className="px-3 py-2 font-semibold text-slate-800">{edu.degree}</td>
                      <td className="px-3 py-2 text-slate-600">{edu.school}</td>
                      <td className="px-3 py-2 text-slate-600 text-center">{edu.dates}</td>
                      <td className="px-3 py-2 text-slate-600 text-center font-medium">{edu.gpa || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      case "skills":
        return skills && (
          <section key="skills" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-900 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wider`}>
              Capabilities
            </h2>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {skills.split(",").map((s, idx) => (
                <span key={idx} className={`bg-slate-800 text-white ${sizeClasses.sub} px-2.5 py-1 rounded font-semibold uppercase tracking-wide`}>
                  {s.trim()}
                </span>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return certifications && certifications.length > 0 && (
          <section key="certifications" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-900 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wider`}>
              Certifications
            </h2>
            <div className={spacingClasses.containerGap === "gap-3" ? "space-y-3" : "space-y-4"}>
              {certifications.map((cert) => (
                <div key={cert.id} className={spacingClasses.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-bold text-slate-900 flex items-center gap-1.5`} style={{ fontSize: sizeClasses.body }}>
                      {cert.name}
                      {cert.link && (
                        <span className="font-normal text-slate-400 text-[9px] ml-1.5">
                          ( <a href={cert.link.startsWith("http") ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">Link</a> )
                        </span>
                      )}
                    </h3>
                    <span className={`${sizeClasses.sub} font-bold text-slate-500 uppercase tracking-wider`}>
                      {cert.dates}
                    </span>
                  </div>
                  {cert.issuer && (
                    <p className={`italic ${sizeClasses.sub} text-slate-500`}>{cert.issuer}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans flex flex-col w-full text-left bg-white text-slate-800 rounded-xl shadow-sm border border-slate-100 min-h-[842px] overflow-hidden">
      {/* Asymmetric Full-width Elegant Dark Header */}
      <header className="bg-slate-900 text-white p-6 flex justify-between items-center w-full">
        {/* Left Side: Circular Avatar + Name/Title */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-white/20 bg-slate-800 flex items-center justify-center shrink-0">
            <svg className="w-7 h-7 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white" style={{ fontSize: sizeClasses.name }}>
              {personalInfo.name}
            </h1>
            <p className="font-semibold text-slate-300 uppercase tracking-wider mt-0.5" style={{ fontSize: sizeClasses.title }}>
              {personalInfo.jobTitle}
            </p>
          </div>
        </div>

        {/* Right Side: Contact links block */}
        <div className={`flex flex-col gap-1.5 ${sizeClasses.contactText} text-slate-300 font-sans font-medium text-right items-end`}>
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              {personalInfo.location}
              <span className="material-symbols-outlined text-[11px] text-slate-400 font-light">location_on</span>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              {personalInfo.phone}
              <span className="material-symbols-outlined text-[11px] text-slate-400 font-light">call</span>
            </span>
          )}
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
              <span className="material-symbols-outlined text-[11px] text-slate-400 font-light">mail</span>
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.website}</a>
              <span className="material-symbols-outlined text-[11px] text-slate-400 font-light">link</span>
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <a href={personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "")}
              </a>
              <span className="material-symbols-outlined text-[11px] text-slate-400 font-light">link</span>
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1.5">
              <a href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {personalInfo.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").replace(/\/$/, "")}
              </a>
              <span className="material-symbols-outlined text-[11px] text-slate-400 font-light">link</span>
            </span>
          )}
          {personalInfo.leetcode && (
            <span className="flex items-center gap-1.5">
              <a href={personalInfo.leetcode.startsWith("http") ? personalInfo.leetcode : `https://${personalInfo.leetcode}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-sans">
                leetcode: {personalInfo.leetcode.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\/u\//, "").replace(/\/$/, "")}
              </a>
              <span className="material-symbols-outlined text-[11px] text-slate-400 font-light">link</span>
            </span>
          )}
          {personalInfo.codeforces && (
            <span className="flex items-center gap-1.5">
              <a href={personalInfo.codeforces.startsWith("http") ? personalInfo.codeforces : `https://${personalInfo.codeforces}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-sans">
                codeforces: {personalInfo.codeforces.replace(/^(https?:\/\/)?(www\.)?codeforces\.com\/profile\//, "").replace(/\/$/, "")}
              </a>
              <span className="material-symbols-outlined text-[11px] text-slate-400 font-light">link</span>
            </span>
          )}
        </div>
      </header>

      {/* Body container with padding */}
      <div className={`${spacingClasses.bodyPadding} flex flex-col ${spacingClasses.containerGap}`}>
        {/* Render sections in custom order */}
        {sectionOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    </div>
  );
}
