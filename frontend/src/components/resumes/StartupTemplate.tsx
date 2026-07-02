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

interface StartupTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  settings?: ResumeSettings;
}

export default function StartupTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  settings,
}: StartupTemplateProps) {
  const fontSize = settings?.fontSize || "md";
  const spacing = settings?.spacing || "normal";
  const sectionOrder = settings?.sectionOrder || ["summary", "education", "experience", "projects", "certifications", "skills"];

  const sizeClasses = {
    sm: {
      name: "text-2xl",
      title: "text-[10px]",
      contactText: "text-[8.5px]",
      sectionTitle: "text-[10px]",
      body: "text-[9.5px]",
      sub: "text-[8.5px]",
    },
    md: {
      name: "text-3xl",
      title: "text-xs",
      contactText: "text-[10px]",
      sectionTitle: "text-xs",
      body: "text-[10.5px]",
      sub: "text-[9.5px]",
    },
    lg: {
      name: "text-4xl",
      title: "text-sm",
      contactText: "text-[11.5px]",
      sectionTitle: "text-sm",
      body: "text-[11.5px]",
      sub: "text-[10px]",
    },
  }[fontSize];

  const spacingClasses = {
    compact: {
      containerGap: "gap-2.5",
      sectionGap: "space-y-1.5",
      itemGap: "space-y-0.5",
      paddingBottom: "pb-1",
    },
    normal: {
      containerGap: "gap-5",
      sectionGap: "space-y-3",
      itemGap: "space-y-1",
      paddingBottom: "pb-1.5",
    },
    spacious: {
      containerGap: "gap-7",
      sectionGap: "space-y-4",
      itemGap: "space-y-2",
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
        <ul className="list-disc pl-4 mt-1.5 space-y-0.5 leading-relaxed font-normal text-slate-600" style={{ fontSize: sizeClasses.body }}>
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
        className="leading-relaxed text-slate-600 whitespace-pre-wrap mt-1.5 font-normal" 
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
            <h2 className={`${sizeClasses.sectionTitle} font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 ${spacingClasses.paddingBottom} flex items-center gap-1.5`}>
              <span className="material-symbols-outlined text-sm text-slate-700 leading-none">person</span>
              About
            </h2>
            <p 
              className={`${sizeClasses.body} leading-relaxed text-slate-700 font-normal`}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(summary).replace(/\n/g, "<br />") }}
            />
          </section>
        );
      case "experience":
        return experience.length > 0 && (
          <section key="experience" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 ${spacingClasses.paddingBottom} flex items-center gap-1.5`}>
              <span className="material-symbols-outlined text-sm text-slate-700 leading-none">work</span>
              Experience
            </h2>
            <div className={spacingClasses.containerGap === "gap-2.5" ? "space-y-3" : "space-y-4"}>
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-12 gap-4">
                  <div className={`${sizeClasses.sub} col-span-3 font-bold text-slate-500 uppercase tracking-wider pt-0.5`}>
                    {exp.dates}
                  </div>
                  <div className={`col-span-9 ${spacingClasses.itemGap}`}>
                    <h3 className={`font-bold text-slate-900`} style={{ fontSize: sizeClasses.body }}>
                      {exp.role} {exp.company && <span className="font-normal text-slate-500">at {exp.company}</span>}
                    </h3>
                    {renderDescription(exp.description)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case "projects":
        return projects.length > 0 && (
          <section key="projects" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 ${spacingClasses.paddingBottom} flex items-center gap-1.5`}>
              <span className="material-symbols-outlined text-sm text-slate-700 leading-none">folder_open</span>
              Projects
            </h2>
            <div className={spacingClasses.containerGap === "gap-2.5" ? "space-y-2.5" : "space-y-3"}>
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
      case "skills":
        return skills && (
          <section key="skills" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 ${spacingClasses.paddingBottom} flex items-center gap-1.5`}>
              <span className="material-symbols-outlined text-sm text-slate-700 leading-none">integration_instructions</span>
              Skills & Technologies
            </h2>
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider font-sans mb-2" style={{ fontSize: sizeClasses.sub }}>Core Tech Stack</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-medium font-sans" style={{ fontSize: sizeClasses.body }}>
                {skills.split(",").map((s, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 px-2 py-1 rounded text-center">
                    {s.trim()}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case "education":
        return education.length > 0 && (
          <section key="education" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 ${spacingClasses.paddingBottom} flex items-center gap-1.5`}>
              <span className="material-symbols-outlined text-sm text-slate-700 leading-none">school</span>
              Education
            </h2>
            <div className={spacingClasses.containerGap === "gap-2.5" ? "space-y-2.5" : "space-y-3"}>
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-12 gap-4" style={{ fontSize: sizeClasses.body }}>
                  <div className={`col-span-3 font-semibold text-slate-500 uppercase tracking-wider pt-0.5`} style={{ fontSize: sizeClasses.sub }}>
                    {edu.dates}
                  </div>
                  <div className={`col-span-9 ${spacingClasses.itemGap}`}>
                    <h3 className="font-bold text-slate-900">{edu.school}</h3>
                    <div className="flex justify-between text-slate-600" style={{ fontSize: sizeClasses.sub }}>
                      <span className="italic">{edu.degree}</span>
                      {edu.gpa && <span>Grade: {edu.gpa}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return certifications && certifications.length > 0 && (
          <section key="certifications" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 ${spacingClasses.paddingBottom} flex items-center gap-1.5`}>
              <span className="material-symbols-outlined text-sm text-slate-700 leading-none">workspace_premium</span>
              Certifications
            </h2>
            <div className={spacingClasses.containerGap === "gap-2.5" ? "space-y-2.5" : "space-y-3"}>
              {certifications.map((cert) => (
                <div key={cert.id} className="grid grid-cols-12 gap-4" style={{ fontSize: sizeClasses.body }}>
                  <div className={`col-span-3 font-semibold text-slate-500 uppercase tracking-wider pt-0.5`} style={{ fontSize: sizeClasses.sub }}>
                    {cert.dates}
                  </div>
                  <div className={`col-span-9 ${spacingClasses.itemGap}`}>
                    <h3 className="font-bold text-slate-900">
                      {cert.name}
                      {cert.link && (
                        <span className="font-normal text-slate-400 text-[9px] ml-1.5">
                          ( <a href={cert.link.startsWith("http") ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">Link</a> )
                        </span>
                      )}
                    </h3>
                    {cert.issuer && (
                      <div className="text-slate-600" style={{ fontSize: sizeClasses.sub }}>
                        <span className="italic">{cert.issuer}</span>
                      </div>
                    )}
                  </div>
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
    <div className={`font-serif flex flex-col ${spacingClasses.containerGap} w-full text-left bg-white text-slate-800 px-6 py-6 min-h-[842px]`}>
      {/* Header (Asymmetric Split) */}
      <header className="grid grid-cols-12 gap-4 border-b-2 border-slate-800 pb-4">
        {/* Left Side: Name and Table of Details */}
        <div className="col-span-8 flex flex-col justify-between">
          <div>
            <h1 className={`${sizeClasses.name} font-extrabold text-slate-900 tracking-tight mb-0.5`}>
              {personalInfo.name || "Untitled Name"}
            </h1>
            <p className={`${sizeClasses.title} font-bold text-slate-500 uppercase tracking-wider`}>
              {personalInfo.jobTitle || "Job Title"}
            </p>
          </div>

          <table className="mt-3 text-slate-600 font-sans border-collapse" style={{ fontSize: sizeClasses.contactText }}>
            <tbody>
              {personalInfo.email && (
                <tr>
                  <td className="font-bold pr-2 py-0.5 text-slate-800 uppercase tracking-wider text-[8.5px]" style={{ fontSize: sizeClasses.sub }}>Email:</td>
                  <td className="py-0.5"><a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a></td>
                </tr>
              )}
              {personalInfo.phone && (
                <tr>
                  <td className="font-bold pr-2 py-0.5 text-slate-800 uppercase tracking-wider text-[8.5px]" style={{ fontSize: sizeClasses.sub }}>Phone:</td>
                  <td className="py-0.5">{personalInfo.phone}</td>
                </tr>
              )}
              {personalInfo.location && (
                <tr>
                  <td className="font-bold pr-2 py-0.5 text-slate-800 uppercase tracking-wider text-[8.5px]" style={{ fontSize: sizeClasses.sub }}>Location:</td>
                  <td className="py-0.5">{personalInfo.location}</td>
                </tr>
              )}
              {personalInfo.website && (
                <tr>
                  <td className="font-bold pr-2 py-0.5 text-slate-800 uppercase tracking-wider text-[8.5px]" style={{ fontSize: sizeClasses.sub }}>Website:</td>
                  <td className="py-0.5"><a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.website}</a></td>
                </tr>
              )}
              {personalInfo.linkedin && (
                <tr>
                  <td className="font-bold pr-2 py-0.5 text-slate-800 uppercase tracking-wider text-[8.5px]" style={{ fontSize: sizeClasses.sub }}>LinkedIn:</td>
                  <td className="py-0.5">
                    <a href={personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                      {personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "")}
                    </a>
                  </td>
                </tr>
              )}
              {personalInfo.github && (
                <tr>
                  <td className="font-bold pr-2 py-0.5 text-slate-800 uppercase tracking-wider text-[8.5px]" style={{ fontSize: sizeClasses.sub }}>GitHub:</td>
                  <td className="py-0.5">
                    <a href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                      {personalInfo.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").replace(/\/$/, "")}
                    </a>
                  </td>
                </tr>
              )}
              {personalInfo.leetcode && (
                <tr>
                  <td className="font-bold pr-2 py-0.5 text-slate-800 uppercase tracking-wider text-[8.5px]" style={{ fontSize: sizeClasses.sub }}>LeetCode:</td>
                  <td className="py-0.5">
                    <a href={personalInfo.leetcode.startsWith("http") ? personalInfo.leetcode : `https://${personalInfo.leetcode}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium font-sans">
                      {personalInfo.leetcode.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\/u\//, "").replace(/\/$/, "")}
                    </a>
                  </td>
                </tr>
              )}
              {personalInfo.codeforces && (
                <tr>
                  <td className="font-bold pr-2 py-0.5 text-slate-800 uppercase tracking-wider text-[8.5px]" style={{ fontSize: sizeClasses.sub }}>Codeforces:</td>
                  <td className="py-0.5">
                    <a href={personalInfo.codeforces.startsWith("http") ? personalInfo.codeforces : `https://${personalInfo.codeforces}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium font-sans">
                      {personalInfo.codeforces.replace(/^(https?:\/\/)?(www\.)?codeforces\.com\/profile\//, "").replace(/\/$/, "")}
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Side: Profile Photo Placeholder */}
        <div className="col-span-4 flex justify-end items-start">
          <div className="w-20 h-24 border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center p-1 rounded shrink-0">
            <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-[7.5px] text-slate-400 font-sans mt-1">Photo</span>
          </div>
        </div>
      </header>

      {/* Render sections in custom order */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
}
