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

interface DeveloperTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  settings?: ResumeSettings;
}

export default function DeveloperTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  settings,
}: DeveloperTemplateProps) {
  const fontSize = settings?.fontSize || "md";
  const spacing = settings?.spacing || "normal";
  const sectionOrder = settings?.sectionOrder || ["summary", "education", "experience", "projects", "certifications", "skills"];

  const sizeClasses = {
    sm: {
      name: "text-2xl",
      title: "text-[10px]",
      contactText: "text-[8.5px]",
      sectionTitle: "text-[8.5px]",
      body: "text-[9.5px]",
      sub: "text-[8.5px]",
    },
    md: {
      name: "text-3xl",
      title: "text-xs",
      contactText: "text-[9.5px]",
      sectionTitle: "text-[9px]",
      body: "text-[10.5px]",
      sub: "text-[9px]",
    },
    lg: {
      name: "text-4xl",
      title: "text-sm",
      contactText: "text-[11px]",
      sectionTitle: "text-[10.5px]",
      body: "text-[11.5px]",
      sub: "text-[10px]",
    },
  }[fontSize];

  const spacingClasses = {
    compact: {
      containerGap: "gap-3",
      sectionPadding: "pt-3",
      itemGap: "space-y-2",
      subGap: "space-y-0.5",
    },
    normal: {
      containerGap: "gap-4",
      sectionPadding: "pt-4",
      itemGap: "space-y-4",
      subGap: "space-y-1",
    },
    spacious: {
      containerGap: "gap-6",
      sectionPadding: "pt-6",
      itemGap: "space-y-6",
      subGap: "space-y-2",
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
        <ol className="mt-1 space-y-0.5 leading-relaxed font-sans list-decimal pl-4 text-slate-600" style={{ fontSize: sizeClasses.body }}>
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*\s]+/, "");
            return (
              <li 
                key={idx} 
                dangerouslySetInnerHTML={{ __html: parseMarkdown(cleanLine) }}
              />
            );
          })}
        </ol>
      );
    }
    
    return (
      <p 
        className="leading-relaxed text-slate-600 whitespace-pre-wrap mt-1 font-sans font-normal" 
        style={{ fontSize: sizeClasses.body }}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(desc).replace(/\n/g, "<br />") }}
      />
    );
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        return summary && (
          <div key="summary" className={`grid grid-cols-12 gap-4 border-t border-slate-200 ${spacingClasses.sectionPadding} w-full`}>
            <div className={`col-span-3 text-right pr-4 text-slate-400 font-bold uppercase tracking-wider ${sizeClasses.sectionTitle} pt-0.5`}>
              Profile
            </div>
            <div className="col-span-9">
              <p 
                className={`${sizeClasses.body} leading-relaxed text-slate-600 font-normal`}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(summary).replace(/\n/g, "<br />") }}
              />
            </div>
          </div>
        );
      case "experience":
        return experience.length > 0 && (
          <div key="experience" className={`grid grid-cols-12 gap-4 border-t border-slate-200 ${spacingClasses.sectionPadding} w-full`}>
            <div className={`col-span-3 text-right pr-4 text-slate-400 font-bold uppercase tracking-wider ${sizeClasses.sectionTitle} pt-0.5`}>
              Experience
            </div>
            <div className={`col-span-9 ${spacingClasses.itemGap}`}>
              {experience.map((exp) => (
                <div key={exp.id} className={spacingClasses.subGap}>
                  <h3 className={`font-bold ${sizeClasses.body} text-slate-900`}>
                    {exp.role} {exp.company && <span className="font-semibold text-[#854d0e]">at {exp.company}</span>}
                  </h3>
                  <div className={`flex gap-4 ${sizeClasses.sub} text-slate-400 font-medium`}>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                      {exp.dates}
                    </span>
                  </div>
                  {renderDescription(exp.description)}
                </div>
              ))}
            </div>
          </div>
        );
      case "projects":
        return projects.length > 0 && (
          <div key="projects" className={`grid grid-cols-12 gap-4 border-t border-slate-200 ${spacingClasses.sectionPadding} w-full`}>
            <div className={`col-span-3 text-right pr-4 text-slate-400 font-bold uppercase tracking-wider ${sizeClasses.sectionTitle} pt-0.5`}>
              Projects
            </div>
            <div className={`col-span-9 ${spacingClasses.itemGap}`}>
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
                  <div key={proj.id} className={spacingClasses.subGap}>
                    <h3 className={`font-bold ${sizeClasses.body} text-slate-900 flex items-center gap-1.5 flex-wrap`}>
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
                      {proj.tech && <span className={`${sizeClasses.sub} text-slate-400 font-mono`}>[{proj.tech}]</span>}
                    </h3>
                    {proj.dates && (
                      <div className={`${sizeClasses.sub} text-slate-400 font-medium`}>
                        {proj.dates}
                      </div>
                    )}
                    {renderDescription(proj.description)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "skills":
        return skills && (
          <div key="skills" className={`grid grid-cols-12 gap-4 border-t border-slate-200 ${spacingClasses.sectionPadding} w-full`}>
            <div className={`col-span-3 text-right pr-4 text-slate-400 font-bold uppercase tracking-wider ${sizeClasses.sectionTitle} pt-0.5`}>
              Skills
            </div>
            <div className="col-span-9">
              <div className={`${sizeClasses.body} leading-relaxed text-slate-600 font-medium`}>
                {skills.split(",").map(s => s.trim()).join("   •   ")}
              </div>
            </div>
          </div>
        );
      case "education":
        return education.length > 0 && (
          <div key="education" className={`grid grid-cols-12 gap-4 border-t border-slate-200 ${spacingClasses.sectionPadding} w-full`}>
            <div className={`col-span-3 text-right pr-4 text-slate-400 font-bold uppercase tracking-wider ${sizeClasses.sectionTitle} pt-0.5`}>
              Education
            </div>
            <div className={`col-span-9 ${spacingClasses.itemGap}`}>
              {education.map((edu) => (
                <div key={edu.id} className={`${sizeClasses.body} ${spacingClasses.subGap}`}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900">{edu.school}</h3>
                    <span className="text-slate-400 font-semibold" style={{ fontSize: sizeClasses.sub }}>{edu.dates}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <p className="text-slate-600 italic" style={{ fontSize: sizeClasses.sub }}>{edu.degree}</p>
                    {edu.gpa && <span className="text-slate-400 font-medium" style={{ fontSize: sizeClasses.sub }}>Grade: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "certifications":
        return certifications && certifications.length > 0 && (
          <div key="certifications" className={`grid grid-cols-12 gap-4 border-t border-slate-200 ${spacingClasses.sectionPadding} w-full`}>
            <div className={`col-span-3 text-right pr-4 text-slate-400 font-bold uppercase tracking-wider ${sizeClasses.sectionTitle} pt-0.5`}>
              Certifications
            </div>
            <div className={`col-span-9 ${spacingClasses.itemGap}`}>
              {certifications.map((cert) => (
                <div key={cert.id} className={`${sizeClasses.body} ${spacingClasses.subGap}`}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900">
                      {cert.name}
                      {cert.link && (
                        <span className="font-normal text-slate-400 text-[9px] ml-1.5">
                          ( <a href={cert.link.startsWith("http") ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">Link</a> )
                        </span>
                      )}
                    </h3>
                    <span className="text-slate-400 font-semibold" style={{ fontSize: sizeClasses.sub }}>{cert.dates}</span>
                  </div>
                  {cert.issuer && (
                    <p className="text-slate-600 italic mt-0.5" style={{ fontSize: sizeClasses.sub }}>{cert.issuer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Compile contact details
  const contactDetails = [];
  if (personalInfo.location) contactDetails.push(personalInfo.location);
  if (personalInfo.phone) contactDetails.push(personalInfo.phone);
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
    <div className={`font-sans flex flex-col ${spacingClasses.containerGap} w-full text-left bg-[#fdfbf7] text-slate-800 px-6 py-6 min-h-[842px]`}>
      {/* Left-aligned Header */}
      <header className="pb-2 w-full">
        <h1 className={`${sizeClasses.name} font-bold text-[#854d0e] tracking-tight mb-0.5`}>
          {personalInfo.name}
        </h1>
        <p className={`${sizeClasses.title} font-semibold text-slate-600 tracking-wider uppercase mb-3`}>
          {personalInfo.jobTitle}
        </p>
        
        {/* Contact details */}
        <div className={`flex flex-wrap gap-x-3 gap-y-1 ${sizeClasses.contactText} text-slate-500 font-medium`}>
          {contactDetails.map((detail, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-slate-300">•</span>}
              {detail}
            </span>
          ))}
        </div>
      </header>

      {/* Render sections in custom order */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
}
