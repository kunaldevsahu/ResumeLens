"use client";

interface ATSScoreCardProps {
  score: number;
}

export default function ATSScoreCard({ score }: ATSScoreCardProps) {
  // Determine color and label based on score value
  const getScoreDetails = (val: number) => {
    if (val >= 85) {
      return {
        label: "Excellent",
        color: "text-[#10b981]",
        bgColor: "bg-[#10b981]/10",
        borderColor: "border-[#10b981]/20",
        strokeColor: "#10b981",
        desc: "Outstanding compatibility. Your resume matches the job requirements perfectly.",
      };
    } else if (val >= 70) {
      return {
        label: "Good",
        color: "text-[#2294f4]",
        bgColor: "bg-[#2294f4]/10",
        borderColor: "border-[#2294f4]/20",
        strokeColor: "#2294f4",
        desc: "Strong match. Minor adjustments can increase your ranking visibility.",
      };
    } else {
      return {
        label: "Needs Improvement",
        color: "text-[#ef4444]",
        bgColor: "bg-[#ef4444]/10",
        borderColor: "border-[#ef4444]/20",
        strokeColor: "#ef4444",
        desc: "Low compatibility. Key terms and metrics are missing from your profile.",
      };
    }
  };

  const details = getScoreDetails(score);

  // SVG calculations for radial circle progress
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
      {/* Background decoration */}
      <div className={`absolute -right-12 -bottom-12 w-36 h-36 rounded-full blur-[80px] opacity-20 pointer-events-none transition-all duration-500`}
           style={{ backgroundColor: details.strokeColor }}></div>

      <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          {/* Static track circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#ffffff08"
            strokeWidth={strokeWidth}
          />
          {/* Active progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={details.strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-['Geist'] text-3xl font-black text-white">
            {score}%
          </span>
          <span className={`text-[9px] font-extrabold uppercase tracking-widest mt-0.5 px-2 py-0.5 rounded-full ${details.color} ${details.bgColor} border ${details.borderColor}`}>
            {details.label}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-center md:text-left relative z-10">
        <div>
          <h4 className="font-['Geist'] text-lg font-bold text-white mb-1">
            Overall Compatibility Score
          </h4>
          <p className="text-xs text-[#bfc7d4] leading-relaxed max-w-sm">
            {details.desc}
          </p>
        </div>
        <div className="flex gap-1.5 justify-center md:justify-start">
          <div className={`h-1 w-6 rounded-full ${score >= 30 ? details.bgColor : "bg-[#ffffff08]"}`} style={{ backgroundColor: score >= 30 ? details.strokeColor : undefined }}></div>
          <div className={`h-1 w-6 rounded-full ${score >= 70 ? details.bgColor : "bg-[#ffffff08]"}`} style={{ backgroundColor: score >= 70 ? details.strokeColor : undefined }}></div>
          <div className={`h-1 w-6 rounded-full ${score >= 85 ? details.bgColor : "bg-[#ffffff08]"}`} style={{ backgroundColor: score >= 85 ? details.strokeColor : undefined }}></div>
        </div>
      </div>
    </div>
  );
}
