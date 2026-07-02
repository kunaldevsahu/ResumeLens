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

interface CorporateTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  settings?: ResumeSettings;
}

export default function CorporateTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  settings,
}: CorporateTemplateProps) {
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
      body: "text-[10.5px]",
      sub: "text-[9px]",
    },
    lg: {
      name: "text-3xl",
      title: "text-sm",
      contactText: "text-[11.5px]",
      sectionTitle: "text-sm",
      body: "text-[12px]",
      sub: "text-[10.5px]",
    },
  }[fontSize];

  const spacingClasses = {
    compact: {
      containerGap: "gap-2.5",
      sectionGap: "space-y-1.5",
      itemGap: "space-y-0.5",
      paddingBottom: "pb-0.5",
      marginTop: "mt-1.5",
    },
    normal: {
      containerGap: "gap-4",
      sectionGap: "space-y-2.5",
      itemGap: "space-y-1",
      paddingBottom: "pb-1",
      marginTop: "mt-2",
    },
    spacious: {
      containerGap: "gap-6",
      sectionGap: "space-y-4",
      itemGap: "space-y-2",
      paddingBottom: "pb-1.5",
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
          <section key="summary" className="px-2">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wide`}>
              Executive Summary
            </h2>
            <p 
              className={`${sizeClasses.body} leading-relaxed text-slate-600 font-normal ${spacingClasses.marginTop}`}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(summary).replace(/\n/g, "<br />") }}
            />
          </section>
        );
      case "experience":
        return experience.length > 0 && (
          <section key="experience" className="px-2">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wide`}>
              Professional Experience
            </h2>
            <div className={`${spacingClasses.marginTop} ${spacingClasses.containerGap === "gap-2.5" ? "space-y-2" : spacingClasses.containerGap === "gap-4" ? "space-y-3" : "space-y-4"}`}>
              {experience.map((exp) => (
                <div key={exp.id} className={spacingClasses.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-bold ${sizeClasses.body} text-slate-900`}>
                      {exp.role}
                    </h3>
                    <span className={`${sizeClasses.sub} font-bold text-slate-500 uppercase tracking-wider`}>
                      {exp.dates}
                    </span>
                  </div>
                  {exp.company && (
                    <p className={`${sizeClasses.sub} font-semibold text-slate-600 italic`}>
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
          <section key="projects" className="px-2">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wide`}>
              Key Projects
            </h2>
            <div className={`${spacingClasses.marginTop} ${spacingClasses.containerGap === "gap-2.5" ? "space-y-2" : spacingClasses.containerGap === "gap-4" ? "space-y-3" : "space-y-4"}`}>
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
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className={`font-bold ${sizeClasses.body} text-slate-900`}>
                          {proj.name}
                        </h3>
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
                        {proj.tech && (
                          <span className={`${sizeClasses.sub} text-slate-500 italic`}>
                            | {proj.tech.split(",").map(t => t.trim()).join(" | ")}
                          </span>
                        )}
                      </div>
                      {proj.dates && (
                        <span className={`${sizeClasses.sub} font-bold text-slate-500 uppercase tracking-wider`}>
                          {proj.dates}
                        </span>
                      )}
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
          <section key="skills" className="px-2">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wide`}>
              Expertise & Skills
            </h2>
            <div className={`${sizeClasses.body} leading-relaxed text-slate-600 ${spacingClasses.marginTop}`}>
              <span className="font-bold text-slate-800">Core Technologies:</span> {skills.split(",").map((s) => s.trim()).join(", ")}
            </div>
          </section>
        );
      case "education":
        return education.length > 0 && (
          <section key="education" className="px-2">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wide`}>
              Education
            </h2>
            <div className={`${spacingClasses.marginTop} ${spacingClasses.containerGap === "gap-2.5" ? "space-y-2" : spacingClasses.containerGap === "gap-4" ? "space-y-3" : "space-y-4"}`}>
              {education.map((edu) => (
                <div key={edu.id} className={spacingClasses.itemGap}>
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-bold ${sizeClasses.body} text-slate-900`}>{edu.school}</h3>
                    <span className={`${sizeClasses.sub} font-bold text-slate-500`}>{edu.dates}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className={`${sizeClasses.sub} text-slate-600 italic`}>{edu.degree}</p>
                    {edu.gpa && <span className={`${sizeClasses.sub} text-slate-400 font-medium`}>Grade: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return certifications && certifications.length > 0 && (
          <section key="certifications" className="px-2">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 border-b border-slate-200 ${spacingClasses.paddingBottom} uppercase tracking-wide`}>
              Certifications
            </h2>
            <div className={`${spacingClasses.marginTop} ${spacingClasses.containerGap === "gap-2.5" ? "space-y-2" : spacingClasses.containerGap === "gap-4" ? "space-y-3" : "space-y-4"}`}>
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

  // Compile contact details into B&W pipes format
  const contactDetails = [];
  if (personalInfo.location) contactDetails.push(personalInfo.location);
  if (personalInfo.phone) {
    contactDetails.push(<a key="phone" href={`tel:${personalInfo.phone}`} className="hover:underline">{personalInfo.phone}</a>);
  }
  if (personalInfo.email) {
    contactDetails.push(<a key="email" href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>);
  }
  if (personalInfo.website) {
    contactDetails.push(<a key="web" href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.website}</a>);
  }
  if (personalInfo.linkedin) {
    const cleanLinkedin = personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "");
    contactDetails.push(
      <a key="li" href={personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
        linkedin.com/in/{cleanLinkedin}
      </a>
    );
  }
  if (personalInfo.github) {
    const cleanGithub = personalInfo.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").replace(/\/$/, "");
    contactDetails.push(
      <a key="gh" href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
        github.com/{cleanGithub}
      </a>
    );
  }
  if (personalInfo.leetcode) {
    const cleanLeetcode = personalInfo.leetcode.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\/u\//, "").replace(/\/$/, "");
    contactDetails.push(
      <a key="lc" href={personalInfo.leetcode.startsWith("http") ? personalInfo.leetcode : `https://${personalInfo.leetcode}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
        leetcode.com/u/{cleanLeetcode}
      </a>
    );
  }
  if (personalInfo.codeforces) {
    const cleanCodeforces = personalInfo.codeforces.replace(/^(https?:\/\/)?(www\.)?codeforces\.com\/profile\//, "").replace(/\/$/, "");
    contactDetails.push(
      <a key="cf" href={personalInfo.codeforces.startsWith("http") ? personalInfo.codeforces : `https://${personalInfo.codeforces}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
        codeforces.com/profile/{cleanCodeforces}
      </a>
    );
  }

  return (
    <div className={`font-serif flex flex-col ${spacingClasses.containerGap} w-full text-left bg-white text-slate-800 px-4 py-2`}>
      {/* Centered Header Section */}
      <header className="py-2 text-center flex flex-col items-center">
        <h1 className={`${sizeClasses.name} font-bold text-slate-900 tracking-tight mb-1`}>
          {personalInfo.name || "Untitled Name"}
        </h1>
        <p className={`${sizeClasses.title} font-semibold text-slate-700 tracking-wider uppercase mb-2`}>
          {personalInfo.jobTitle || "Job Title"}
        </p>
        
        {/* Centered Contact Details (separated by pipes, no icons) */}
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
