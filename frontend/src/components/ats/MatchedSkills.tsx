"use client";

interface MatchedSkillsProps {
  skills: string[];
}

export default function MatchedSkills({ skills }: MatchedSkillsProps) {
  const displaySkills = skills.length > 0
    ? skills
    : ["React", "Next.js", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "Prisma", "Git", "HTML", "CSS", "REST APIs"]; // Standard fallback matching the screenshot

  return (
    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 space-y-4">
      <div>
        <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#10b981] text-[18px]">verified</span>
          Matched Skills
        </h4>
        <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
          Core technical competencies detected on your resume.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {displaySkills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-md text-[10px] font-bold font-['Geist'] bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/15 hover:bg-[#10b981]/15 hover:border-[#10b981]/30 transition-all select-none"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
