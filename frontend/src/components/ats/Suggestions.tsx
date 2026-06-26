"use client";

interface Suggestion {
  priority: string;
  message: string;
}

interface SuggestionsProps {
  suggestions: Suggestion[];
}

export default function Suggestions({ suggestions }: SuggestionsProps) {
  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return {
          textColor: "text-[#ffb4ab]",
          bgColor: "bg-[#93000a]/20",
          borderColor: "border-[#ffb4ab]/20",
          icon: "error",
          iconColor: "text-[#ffb4ab]",
        };
      case "medium":
        return {
          textColor: "text-[#ffb781]",
          bgColor: "bg-[#dc7506]/10",
          borderColor: "border-[#dc7506]/20",
          icon: "warning",
          iconColor: "text-[#ffb781]",
        };
      default:
        return {
          textColor: "text-[#a0caff]",
          bgColor: "bg-[#2294f4]/10",
          borderColor: "border-[#2294f4]/20",
          icon: "info",
          iconColor: "text-[#a0caff]",
        };
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-['Geist'] text-lg font-bold text-white mb-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#ef4444]">lightbulb</span>
          Improvement Suggestions
        </h3>
        <p className="text-xs text-[#bfc7d4] opacity-75">
          Actionable recommendations based on semantic analysis to improve your resume ranking.
        </p>
      </div>

      <div className="space-y-3">
        {suggestions.map((sug, idx) => {
          const style = getPriorityStyle(sug.priority);
          return (
            <div
              key={idx}
              className={`flex items-start gap-4 p-4 rounded-xl border bg-[#1d2022] border-[#ffffff14] hover:border-[#ffffff20] transition-colors duration-200`}
            >
              <div className={`w-8 h-8 rounded-lg ${style.bgColor} flex-shrink-0 flex items-center justify-center ${style.iconColor}`}>
                <span className="material-symbols-outlined text-[18px]">
                  {style.icon}
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${style.textColor} ${style.bgColor} ${style.borderColor}`}>
                    {sug.priority} Priority
                  </span>
                </div>
                <p className="text-xs font-medium text-[#e1e2e4] leading-relaxed font-['Inter']">
                  {sug.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
