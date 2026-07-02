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

interface MinimalTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  settings?: ResumeSettings;
}

export default function MinimalTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  settings,
}: MinimalTemplateProps) {
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
      containerGap: "gap-2.5",
      sectionGap: "space-y-1.5",
      itemGap: "space-y-0.5",
      paddingBottom: "pb-1",
      marginTop: "mt-1",
    },
    normal: {
      containerGap: "gap-4",
      sectionGap: "space-y-2.5",
      itemGap: "space-y-1",
      paddingBottom: "pb-1.5",
      marginTop: "mt-2",
    },
    spacious: {
      containerGap: "gap-6",
      sectionGap: "space-y-4",
      itemGap: "space-y-2",
      paddingBottom: "pb-2",
      marginTop: "mt-3",
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
        <ul className="list-disc pl-4 mt-1.5 space-y-0.5 leading-relaxed font-normal text-slate-500" style={{ fontSize: sizeClasses.body }}>
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
        className="leading-relaxed text-slate-500 whitespace-pre-wrap mt-1.5 font-normal" 
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
              About
            </h2>
            <p 
              className={`${sizeClasses.body} leading-relaxed text-slate-600 font-normal ${spacingClasses.marginTop}`}
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
            <div className={`${spacingClasses.containerGap === "gap-2.5" ? "space-y-2.5" : "space-y-4"} ${spacingClasses.marginTop}`}>
              {experience.map((exp) => (
                <div key={exp.id} className={spacingClasses.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <span className={`font-bold ${sizeClasses.body} text-slate-900`}>{exp.company}</span>
                    <span className={`${sizeClasses.sub} text-slate-500 font-medium`}>{exp.dates}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <span className={`italic ${sizeClasses.sub} text-slate-600`}>{exp.role}</span>
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
              Projects
            </h2>
            <div className={`${spacingClasses.containerGap === "gap-2.5" ? "space-y-2.5" : "space-y-3"} ${spacingClasses.marginTop}`}>
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
                          <span className={`${sizeClasses.sub} text-slate-500 font-bold uppercase tracking-wider`}>
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
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-900 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wider`}>
              Skills
            </h2>
            <p className={`${sizeClasses.body} leading-relaxed text-slate-600 ${spacingClasses.marginTop}`}>
              <span className="font-bold text-slate-800">Technical Skills:</span> {skills.split(",").map(s => s.trim()).join(", ")}
            </p>
          </section>
        );
      case "education":
        return education.length > 0 && (
          <section key="education" className={spacingClasses.sectionGap}>
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-900 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wider`}>
              Education
            </h2>
            <div className={`${spacingClasses.containerGap === "gap-2.5" ? "space-y-2.5" : "space-y-3"} ${spacingClasses.marginTop}`}>
              {education.map((edu) => (
                <div key={edu.id} className={spacingClasses.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <span className={`font-bold ${sizeClasses.body} text-slate-900`}>{edu.school}</span>
                    <span className={`${sizeClasses.sub} text-slate-500 font-medium`}>{edu.dates}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <span className={`italic ${sizeClasses.sub} text-slate-600`}>{edu.degree}</span>
                    {edu.gpa && <span className={`${sizeClasses.sub} text-slate-400 font-medium`}>GPA: {edu.gpa}</span>}
                  </div>
                </div>
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
            <div className={`${spacingClasses.containerGap === "gap-2.5" ? "space-y-2.5" : "space-y-3"} ${spacingClasses.marginTop}`}>
              {certifications.map((cert) => (
                <div key={cert.id} className={spacingClasses.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <span className={`font-bold ${sizeClasses.body} text-slate-900`}>
                      {cert.name}
                      {cert.link && (
                        <span className="font-normal text-slate-400 text-[9px] ml-1.5">
                          ( <a href={cert.link.startsWith("http") ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">Link</a> )
                        </span>
                      )}
                    </span>
                    <span className={`${sizeClasses.sub} text-slate-500 font-medium`}>{cert.dates}</span>
                  </div>
                  {cert.issuer && (
                    <div className="mt-0.5">
                      <span className={`italic ${sizeClasses.sub} text-slate-600`}>{cert.issuer}</span>
                    </div>
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
      <span key="loc" className="flex items-center gap-1">
        <span className="material-symbols-outlined text-xs text-slate-400 font-light">location_on</span>
        <span>{personalInfo.location}</span>
      </span>
    );
  }
  if (personalInfo.phone) {
    contactDetails.push(
      <span key="ph" className="flex items-center gap-1">
        <span className="material-symbols-outlined text-xs text-slate-400 font-light">call</span>
        <a href={`tel:${personalInfo.phone}`} className="hover:underline">{personalInfo.phone}</a>
      </span>
    );
  }
  if (personalInfo.email) {
    contactDetails.push(
      <span key="em" className="flex items-center gap-1">
        <span className="material-symbols-outlined text-xs text-slate-400 font-light">mail</span>
        <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
      </span>
    );
  }
  if (personalInfo.website) {
    contactDetails.push(
      <span key="web" className="flex items-center gap-1">
        <span className="material-symbols-outlined text-xs text-slate-400 font-light">link</span>
        <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.website}</a>
      </span>
    );
  }
  if (personalInfo.linkedin) {
    const cleanLinkedin = personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "");
    contactDetails.push(
      <span key="li" className="flex items-center gap-1">
        <svg className="w-3 h-3 text-slate-400 shrink-0 fill-currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
        <a href={personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{cleanLinkedin}</a>
      </span>
    );
  }
  if (personalInfo.github) {
    const cleanGithub = personalInfo.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").replace(/\/$/, "");
    contactDetails.push(
      <span key="gh" className="flex items-center gap-1">
        <svg className="w-3 h-3 text-slate-400 shrink-0 fill-currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <a href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{cleanGithub}</a>
      </span>
    );
  }
  if (personalInfo.leetcode) {
    const cleanLeetcode = personalInfo.leetcode.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\/u\//, "").replace(/\/$/, "");
    contactDetails.push(
      <span key="lc" className="flex items-center gap-1 font-bold text-[8.5px] font-sans text-slate-500">
        LC
        <a href={personalInfo.leetcode.startsWith("http") ? personalInfo.leetcode : `https://${personalInfo.leetcode}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">{cleanLeetcode}</a>
      </span>
    );
  }
  if (personalInfo.codeforces) {
    const cleanCodeforces = personalInfo.codeforces.replace(/^(https?:\/\/)?(www\.)?codeforces\.com\/profile\//, "").replace(/\/$/, "");
    contactDetails.push(
      <span key="cf" className="flex items-center gap-1 font-bold text-[8.5px] font-sans text-slate-500">
        CF
        <a href={personalInfo.codeforces.startsWith("http") ? personalInfo.codeforces : `https://${personalInfo.codeforces}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">{cleanCodeforces}</a>
      </span>
    );
  }

  return (
    <div className={`font-sans flex flex-col ${spacingClasses.containerGap} w-full text-left bg-white text-slate-800 px-4 py-2`}>
      {/* Header (Flex justify-between centered) */}
      <header className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
        <h1 className={`${sizeClasses.name} font-bold text-slate-900 tracking-tight mb-0.5`}>
          {personalInfo.name || "Untitled Name"}
        </h1>
        <p className={`${sizeClasses.title} font-semibold text-slate-500 uppercase tracking-wider mb-2.5`}>
          {personalInfo.jobTitle || "Job Title"}
        </p>

        {/* Contact details separated by vertical lines, with icons */}
        <div className={`flex justify-center flex-wrap gap-x-2 gap-y-1 ${sizeClasses.contactText} text-slate-500 font-medium`}>
          {contactDetails.map((detail, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {detail}
              {idx < contactDetails.length - 1 && <span className="text-slate-300">|</span>}
            </span>
          ))}
        </div>
      </header>

      {/* Render sections in custom order */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
}
