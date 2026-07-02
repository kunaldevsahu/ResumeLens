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

interface ExecutiveTemplateProps {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  settings?: ResumeSettings;
}

export default function ExecutiveTemplate({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  settings,
}: ExecutiveTemplateProps) {
  const fontSize = settings?.fontSize || "md";
  const spacing = settings?.spacing || "normal";
  const sectionOrder = settings?.sectionOrder || ["summary", "education", "experience", "projects", "certifications", "skills"];

  const sizeClasses = {
    sm: {
      name: "text-2xl",
      title: "text-[11px]",
      contactText: "text-[8.5px]",
      sectionTitle: "text-[10px]",
      body: "text-[9.5px]",
      sub: "text-[8.5px]",
    },
    md: {
      name: "text-3xl",
      title: "text-sm",
      contactText: "text-[10px]",
      sectionTitle: "text-xs",
      body: "text-[10.5px]",
      sub: "text-[9px]",
    },
    lg: {
      name: "text-4xl",
      title: "text-base",
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
      paddingBottom: "pb-1.5",
      marginTop: "mt-1.5",
    },
    normal: {
      containerGap: "gap-4.5",
      sectionGap: "space-y-2.5",
      itemGap: "space-y-1",
      paddingBottom: "pb-2",
      marginTop: "mt-2.5",
    },
    spacious: {
      containerGap: "gap-6.5",
      sectionGap: "space-y-4",
      itemGap: "space-y-2",
      paddingBottom: "pb-3",
      marginTop: "mt-4",
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
        <ul className="list-disc pl-4 mt-1.5 space-y-0.5 leading-relaxed font-sans text-slate-700" style={{ fontSize: sizeClasses.body }}>
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
        className="leading-relaxed text-slate-700 whitespace-pre-wrap mt-1.5 font-sans" 
        style={{ fontSize: sizeClasses.body }}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(desc).replace(/\n/g, "<br />") }}
      />
    );
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        return summary && (
          <section key="summary" className="text-left">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 uppercase tracking-[0.15em] mb-1.5`}>
              Executive Summary
            </h2>
            <p 
              className={`${sizeClasses.body} leading-relaxed text-slate-700`}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(summary).replace(/\n/g, "<br />") }}
            />
          </section>
        );
      case "experience":
        return experience.length > 0 && (
          <section key="experience" className="text-left">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 uppercase tracking-[0.15em] mb-2`}>
              Professional Experience
            </h2>
            <div className={spacingClasses.containerGap === "gap-2.5" ? "space-y-2.5" : spacingClasses.containerGap === "gap-4.5" ? "space-y-4" : "space-y-5"}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`font-bold ${sizeClasses.body} text-slate-900`}>
                      {exp.role} <span className="font-light text-slate-300 mx-1">|</span> <span className="font-semibold text-slate-600">{exp.company}</span>
                    </h3>
                    <span className={`${sizeClasses.sub} text-slate-500 font-bold uppercase tracking-wider`}>{exp.dates}</span>
                  </div>
                  {renderDescription(exp.description)}
                </div>
              ))}
            </div>
          </section>
        );
      case "projects":
        return projects.length > 0 && (
          <section key="projects" className="text-left">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 uppercase tracking-[0.15em] mb-2`}>
              Key Initiatives & Projects
            </h2>
            <div className={spacingClasses.containerGap === "gap-2.5" ? "space-y-2" : spacingClasses.containerGap === "gap-4.5" ? "space-y-3" : "space-y-4"}>
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
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-0.5">
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
                          <span className={`${sizeClasses.sub} font-bold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded`}>
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
      case "education":
        return education.length > 0 && (
          <section key="education">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 uppercase tracking-[0.15em] mb-2`}>
              Education
            </h2>
            <div className="space-y-2.5 pt-1">
              {education.map((edu) => (
                <div key={edu.id} className={sizeClasses.body}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900">{edu.school}</h4>
                    <span className={`${sizeClasses.sub} font-bold text-slate-500`}>{edu.dates}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <p className="text-slate-600 italic">{edu.degree}</p>
                    {edu.gpa && <span className={`${sizeClasses.sub} text-slate-400 font-medium`}>Grade: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case "skills":
        return skills && (
          <section key="skills">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 uppercase tracking-[0.15em] mb-2`}>
              Skills & Expertise
            </h2>
            <ul className={`grid grid-cols-2 gap-y-1.5 gap-x-4 pt-1 list-disc pl-4`} style={{ fontSize: sizeClasses.body }}>
              {skills.split(",").map((s, idx) => (
                <li key={idx} className="font-medium text-slate-600">
                  {s.trim()}
                </li>
              ))}
            </ul>
          </section>
        );
      case "certifications":
        return certifications && certifications.length > 0 && (
          <section key="certifications">
            <h2 className={`${sizeClasses.sectionTitle} font-bold text-slate-800 uppercase tracking-[0.15em] mb-2`}>
              Certifications
            </h2>
            <div className="space-y-2.5 pt-1">
              {certifications.map((cert) => (
                <div key={cert.id} className={sizeClasses.body}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900">
                      {cert.name}
                      {cert.link && (
                        <span className="font-normal text-slate-400 text-[9px] ml-1.5">
                          ( <a href={cert.link.startsWith("http") ? cert.link : `https://${cert.link}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">Link</a> )
                        </span>
                      )}
                    </h4>
                    <span className={`${sizeClasses.sub} font-bold text-slate-500`}>{cert.dates}</span>
                  </div>
                  {cert.issuer && (
                    <p className="text-slate-600 italic mt-0.5">{cert.issuer}</p>
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
        linkedin: {cleanLinkedin}
      </a>
    );
  }
  if (personalInfo.github) {
    const cleanGithub = personalInfo.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").replace(/\/$/, "");
    contactDetails.push(
      <a key="gh" href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
        github: {cleanGithub}
      </a>
    );
  }
  if (personalInfo.leetcode) {
    const cleanLeetcode = personalInfo.leetcode.replace(/^(https?:\/\/)?(www\.)?leetcode\.com\/u\//, "").replace(/\/$/, "");
    contactDetails.push(
      <a key="lc" href={personalInfo.leetcode.startsWith("http") ? personalInfo.leetcode : `https://${personalInfo.leetcode}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
        leetcode: {cleanLeetcode}
      </a>
    );
  }
  if (personalInfo.codeforces) {
    const cleanCodeforces = personalInfo.codeforces.replace(/^(https?:\/\/)?(www\.)?codeforces\.com\/profile\//, "").replace(/\/$/, "");
    contactDetails.push(
      <a key="cf" href={personalInfo.codeforces.startsWith("http") ? personalInfo.codeforces : `https://${personalInfo.codeforces}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
        codeforces: {cleanCodeforces}
      </a>
    );
  }

  // Check if adjacent sections belong to parallel-compatible set (education, skills, certifications)
  const renderedSections: React.ReactNode[] = [];
  const processed = new Set<string>();
  const parallelSet = new Set(["education", "skills", "certifications"]);

  for (let i = 0; i < sectionOrder.length; i++) {
    const sectionId = sectionOrder[i];
    if (processed.has(sectionId)) continue;

    const nextSectionId = sectionOrder[i + 1];
    const isParallelPair = 
      nextSectionId && 
      parallelSet.has(sectionId) && 
      parallelSet.has(nextSectionId);

    if (isParallelPair) {
      renderedSections.push(
        <div key="parallel-cols" className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pt-2">
          {renderSection(sectionId)}
          {renderSection(nextSectionId)}
        </div>
      );
      processed.add(sectionId);
      processed.add(nextSectionId);
    } else {
      renderedSections.push(renderSection(sectionId));
      processed.add(sectionId);
    }
  }

  return (
    <div className={`font-sans flex flex-col ${spacingClasses.containerGap} w-full text-left bg-white text-[#1e293b] px-4 py-2`}>
      {/* Asymmetric Header with border-b and right-aligned contact links */}
      <header className="flex flex-col gap-2 pb-2">
        <div className={`flex justify-between items-baseline border-b border-slate-300 ${spacingClasses.paddingBottom}`}>
          <h1 className={`${sizeClasses.name} font-extrabold tracking-tight text-slate-900 uppercase`}>
            {personalInfo.name || "Untitled Name"}
          </h1>
          <p className={`${sizeClasses.title} font-bold text-slate-700 uppercase`}>
            {personalInfo.jobTitle || "Job Title"}
          </p>
        </div>
        {/* Right-aligned contact info below the separator line */}
        <div className={`flex justify-end flex-wrap gap-x-3 gap-y-1 ${sizeClasses.contactText} text-slate-500 font-medium`}>
          {contactDetails.map((detail, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {detail}
              {idx < contactDetails.length - 1 && <span className="text-slate-300">|</span>}
            </span>
          ))}
        </div>
      </header>

      {/* Render sections */}
      {renderedSections}
    </div>
  );
}
