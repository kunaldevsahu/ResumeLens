"use client";

interface ScoreBreakdownProps {
  keywordScore: number;
  formattingScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
}

export default function ScoreBreakdown({
  keywordScore,
  formattingScore,
  skillsScore,
  experienceScore,
  educationScore,
}: ScoreBreakdownProps) {
  const categories = [
    {
      name: "Keyword Match",
      score: keywordScore,
      icon: "key",
      desc: "Presence of essential keywords from job role.",
    },
    {
      name: "Formatting & Style",
      score: formattingScore,
      icon: "grid_view",
      desc: "ATS safe structure, fonts, margins, layouts.",
    },
    {
      name: "Skills Alignment",
      score: skillsScore,
      icon: "task_alt",
      desc: "Core technology stack overlap index.",
    },
    {
      name: "Experience Quality",
      score: experienceScore,
      icon: "work_history",
      desc: "Impact metrics and active results verbs.",
    },
    {
      name: "Education Match",
      score: educationScore,
      icon: "school",
      desc: "Compliance in degrees and qualifications.",
    },
  ];

  const getColor = (val: number) => {
    if (val >= 85) return "bg-[#10b981]";
    if (val >= 70) return "bg-[#2294f4]";
    return "bg-[#ef4444]";
  };

  return (
    <div className="space-y-4">
      <h3 className="font-['Geist'] text-lg font-bold text-white mb-4">
        Category Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="p-5 rounded-2xl bg-[#1d2022] border border-[#ffffff14] space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#a0caff]/70 text-[20px]">
                    {cat.icon}
                  </span>
                  <span className="font-['Geist'] font-bold text-white text-sm">
                    {cat.name}
                  </span>
                </div>
                <span className="font-['Geist'] text-sm font-bold text-white">
                  {cat.score}%
                </span>
              </div>
              <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] leading-relaxed">
                {cat.desc}
              </p>
            </div>

            <div className="w-full bg-[#111415] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getColor(cat.score)}`}
                style={{ width: `${cat.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
