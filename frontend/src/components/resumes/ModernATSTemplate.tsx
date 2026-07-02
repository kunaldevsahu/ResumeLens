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

interface ModernATSTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  settings?: ResumeSettings;
}

export default function ModernATSTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  settings,
}: ModernATSTemplateProps) {
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
      contactText: "text-[10px]",
      sectionTitle: "text-xs",
      body: "text-[11px]",
      sub: "text-[10px]",
    },
    lg: {
      name: "text-3xl",
      title: "text-sm",
      contactText: "text-[11.5px]",
      sectionTitle: "text-sm",
      body: "text-[12.5px]",
      sub: "text-[11.5px]",
    },
  }[fontSize];

  const spacingClasses = {
    compact: {
      containerGap: "gap-2.5",
      sectionGap: "space-y-1.5",
      itemGap: "space-y-0.5",
      paddingTop: "pt-1.5",
    },
    normal: {
      containerGap: "gap-4",
      sectionGap: "space-y-2.5",
      itemGap: "space-y-1",
      paddingTop: "pt-3",
    },
    spacious: {
      containerGap: "gap-6",
      sectionGap: "space-y-4",
      itemGap: "space-y-2",
      paddingTop: "pt-5",
    },
  }[spacing];

  const parseMarkdown = (text: string) => {
    if (!text) return "";
    let parsed = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    parsed = parsed.replace(/\*\*(.*?)\*\"/g, "<strong>$1</strong>");
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
        <ul className="list-disc pl-4 mt-1 space-y-0.5 leading-relaxed font-normal text-slate-600" style={{ fontSize: sizeClasses.body }}>
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
        className="leading-relaxed text-slate-600 mt-1 font-normal" 
        style={{ fontSize: sizeClasses.body }}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(desc).replace(/\n/g, "<br />") }}
      />
    );
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        return summary && (
          <section key="summary" className={`${spacingClasses.sectionGap} border-t border-slate-200 ${spacingClasses.paddingTop}`}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 tracking-wide uppercase`}>
              Professional Summary
            </h2>
            <p 
              className={`${sizeClasses.body} leading-relaxed text-slate-600 font-normal`}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(summary).replace(/\n/g, "<br />") }}
            />
          </section>
        );
      case "experience":
        return experience.length > 0 && (
          <section key="experience" className={`${spacingClasses.sectionGap} border-t border-slate-200 ${spacingClasses.paddingTop}`}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 tracking-wide uppercase`}>
              Work Experience
            </h2>
            <div className={spacingClasses.containerGap === "gap-2.5" ? "space-y-2" : spacingClasses.containerGap === "gap-4" ? "space-y-3" : "space-y-4"}>
              {experience.map((exp) => (
                <div key={exp.id} className={spacingClasses.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-bold ${sizeClasses.body} text-slate-900`}>
                      {exp.role || "Software Engineer"}
                    </h3>
                    <span className={`${sizeClasses.sub} font-bold text-slate-500 uppercase tracking-wider`}>
                      {exp.dates}
                    </span>
                  </div>
                  {exp.company && (
                    <p className={`${sizeClasses.sub} font-semibold text-slate-700`}>
                      {exp.company}
                    </p>
                  )}
                  {renderDescription(exp.description)}
                </div>
              ))}
            </div>
          </section>
        );
      case "projects":
        return projects.length > 0 && (
          <section key="projects" className={`${spacingClasses.sectionGap} border-t border-slate-200 ${spacingClasses.paddingTop}`}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 tracking-wide uppercase`}>
              Projects
            </h2>
            <div className={spacingClasses.containerGap === "gap-2.5" ? "space-y-2" : spacingClasses.containerGap === "gap-4" ? "space-y-3" : "space-y-4"}>
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
                      <h3 className={`font-bold ${sizeClasses.body} text-slate-900 flex items-center gap-1.5`}>
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
                          <span className={`${sizeClasses.sub} text-slate-500 font-mono`}>
                            {proj.tech}
                          </span>
                        )}
                        {proj.dates && (
                          <span className={`${sizeClasses.sub} font-bold text-slate-500 uppercase tracking-wider`}>
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
          <section key="skills" className={`${spacingClasses.sectionGap} border-t border-slate-200 ${spacingClasses.paddingTop}`}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 tracking-wide uppercase`}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.split(",").map((s, idx) => (
                <span key={idx} className={`bg-slate-800 text-white ${sizeClasses.sub} font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
                  {s.trim()}
                </span>
              ))}
            </div>
          </section>
        );
      case "education":
        return education.length > 0 && (
          <section key="education" className={`${spacingClasses.sectionGap} border-t border-slate-200 ${spacingClasses.paddingTop}`}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 tracking-wide uppercase`}>
              Education
            </h2>
            <div className={spacingClasses.containerGap === "gap-2.5" ? "space-y-2" : spacingClasses.containerGap === "gap-4" ? "space-y-3" : "space-y-4"}>
              {education.map((edu) => (
                <div key={edu.id} className={spacingClasses.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-bold ${sizeClasses.body} text-slate-900`}>{edu.school}</h3>
                    <span className={`${sizeClasses.sub} font-bold text-slate-500 uppercase tracking-wider`}>
                      {edu.dates}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <p className={`${sizeClasses.sub} text-slate-600 italic`}>{edu.degree}</p>
                    {edu.gpa && (
                      <p className={`${sizeClasses.sub} text-slate-400 font-medium`}>Grade: {edu.gpa}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return certifications && certifications.length > 0 && (
          <section key="certifications" className={`${spacingClasses.sectionGap} border-t border-slate-200 ${spacingClasses.paddingTop}`}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 tracking-wide uppercase`}>
              Certifications
            </h2>
            <div className={spacingClasses.containerGap === "gap-2.5" ? "space-y-2" : spacingClasses.containerGap === "gap-4" ? "space-y-3" : "space-y-4"}>
              {certifications.map((cert) => (
                <div key={cert.id} className={spacingClasses.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-bold ${sizeClasses.body} text-slate-900`}>
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
                    <p className={`${sizeClasses.sub} text-slate-600 italic`}>{cert.issuer}</p>
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

  // Compile contact details
  const contactDetails = [];
  if (personalInfo.location) {
    contactDetails.push(
      <span key="loc" className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 shrink-0">
          <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </span>
        {personalInfo.location}
      </span>
    );
  }
  if (personalInfo.phone) {
    contactDetails.push(
      <span key="ph" className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 shrink-0">
          <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.104-6.928-6.928l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
        </span>
        <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-500 hover:underline">{personalInfo.phone}</a>
      </span>
    );
  }
  if (personalInfo.email) {
    contactDetails.push(
      <span key="em" className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 shrink-0">
          <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </span>
        <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-500 hover:underline">{personalInfo.email}</a>
      </span>
    );
  }
  if (personalInfo.website) {
    contactDetails.push(
      <span key="web" className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 shrink-0">
          <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
        </span>
        <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">{personalInfo.website}</a>
      </span>
    );
  }
  if (personalInfo.linkedin) {
    contactDetails.push(
      <span key="li" className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 shrink-0">
          <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </span>
        <a href={personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">
          {personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "")}
        </a>
      </span>
    );
  }
  if (personalInfo.github) {
    contactDetails.push(
      <span key="gh" className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 shrink-0">
          <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </span>
        <a href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">
          {personalInfo.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").replace(/\/$/, "")}
        </a>
      </span>
    );
  }
  if (personalInfo.leetcode) {
    contactDetails.push(
      <span key="lc" className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 shrink-0 font-bold text-[8px] font-sans">
          LC
        </span>
        <a href={personalInfo.leetcode.startsWith("http") ? personalInfo.leetcode : `https://${personalInfo.leetcode}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">
          {personalInfo.leetcode.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\/u\//, "").replace(/\/$/, "")}
        </a>
      </span>
    );
  }
  if (personalInfo.codeforces) {
    contactDetails.push(
      <span key="cf" className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 shrink-0 font-bold text-[8px] font-sans">
          CF
        </span>
        <a href={personalInfo.codeforces.startsWith("http") ? personalInfo.codeforces : `https://${personalInfo.codeforces}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">
          {personalInfo.codeforces.replace(/^(https?:\/\/)?(www\.)?codeforces\.com\/profile\//, "").replace(/\/$/, "")}
        </a>
      </span>
    );
  }

  return (
    <div className={`font-serif flex flex-col ${spacingClasses.containerGap} w-full text-left bg-white text-slate-800 px-4 py-2`}>
      {/* Centered Header Section */}
      <header className="flex flex-col items-center text-center pb-2">
        <h1 className={`${sizeClasses.name} font-bold text-slate-900 tracking-tight mb-1`}>
          {personalInfo.name || "Untitled Name"}
        </h1>
        <p className={`${sizeClasses.title} font-semibold text-slate-700 tracking-wider uppercase mb-3`}>
          {personalInfo.jobTitle || "Job Title"}
        </p>
        
        {/* Contact info items with custom monochrome inline SVG icons in circular borders */}
        <div className={`flex justify-center flex-wrap gap-x-4 gap-y-2 ${sizeClasses.contactText} text-slate-600 font-medium`}>
          {contactDetails}
        </div>
      </header>

      {/* Render sections in custom order */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
}
