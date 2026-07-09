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
  // Compute projects impact based on experience and skills
  const projectsScore = Math.min(100, Math.max(30, Math.round(experienceScore * 0.9 + skillsScore * 0.1)));

  const categories = [
    { name: "Keyword Match", score: keywordScore },
    { name: "Skills Alignment", score: skillsScore },
    { name: "Experience Quality", score: experienceScore },
    { name: "Formatting & Style", score: formattingScore },
    { name: "Education Match", score: educationScore },
    { name: "Projects Impact", score: projectsScore },
  ];

  const getBarColor = (val: number) => {
    if (val >= 85) return "bg-[#10b981]"; // Green
    if (val >= 70) return "bg-[#2294f4]"; // Blue
    if (val >= 40) return "bg-[#dc7506]"; // Orange
    return "bg-[#ef4444]"; // Red
  };

  return (
    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 space-y-5">
      <div>
        <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider">
          Score Breakdown
        </h4>
        <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
          Detailed compatibility index across core resume components.
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between gap-4">
            {/* Label */}
            <span className="w-28 text-xs font-semibold text-[#bfc7d4] font-['Geist'] shrink-0">
              {cat.name}
            </span>

            {/* Progress Track & Bar */}
            <div className="flex-1 bg-[#111415] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getBarColor(cat.score)}`}
                style={{ width: `${cat.score}%` }}
              ></div>
            </div>

            {/* Value */}
            <span className="w-10 text-right text-xs font-bold text-white font-['Geist'] shrink-0">
              {cat.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
