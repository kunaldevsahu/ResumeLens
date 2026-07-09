"use client";

interface Suggestion {
  priority: string;
  message: string;
}

interface SuggestionsProps {
  suggestions: Suggestion[];
}

export default function Suggestions({ suggestions }: SuggestionsProps) {
  const highPriority = suggestions.filter((s) => s.priority.toLowerCase() === "high");
  const mediumPriority = suggestions.filter((s) => s.priority.toLowerCase() === "medium");
  const lowPriority = suggestions.filter(
    (s) =>
      s.priority.toLowerCase() === "low" ||
      s.priority.toLowerCase() === "info" ||
      !["high", "medium"].includes(s.priority.toLowerCase())
  );

  return (
    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 space-y-5">
      <div>
        <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider">
          Improvement Suggestions
        </h4>
        <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
          Actionable recommendations based on AI analysis to improve your resume score.
        </p>
      </div>

      <div className="space-y-5">
        {/* High Priority */}
        {highPriority.length > 0 && (
          <div className="space-y-2.5">
            <span className="text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#93000a]/20 border border-[#ffb4ab]/20 text-[#ffb4ab] inline-block font-['Geist']">
              High Priority
            </span>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-[#e1e2e4] font-['Inter'] leading-relaxed">
              {highPriority.map((s, idx) => (
                <li key={idx} className="hover:text-white transition-colors">
                  {s.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Medium Priority */}
        {mediumPriority.length > 0 && (
          <div className="space-y-2.5">
            <span className="text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#dc7506]/10 border border-[#dc7506]/20 text-[#ffb781] inline-block font-['Geist']">
              Medium Priority
            </span>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-[#e1e2e4] font-['Inter'] leading-relaxed">
              {mediumPriority.map((s, idx) => (
                <li key={idx} className="hover:text-white transition-colors">
                  {s.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Low Priority */}
        {lowPriority.length > 0 && (
          <div className="space-y-2.5">
            <span className="text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#2294f4]/15 border border-[#2294f4]/20 text-[#a0caff] inline-block font-['Geist']">
              Low Priority
            </span>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-[#e1e2e4] font-['Inter'] leading-relaxed">
              {lowPriority.map((s, idx) => (
                <li key={idx} className="hover:text-white transition-colors">
                  {s.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestions.length === 0 && (
          <div className="text-center py-6 text-[#bfc7d4]/40 font-['Inter'] text-xs">
            <span className="material-symbols-outlined text-xl mb-1 block">thumb_up</span>
            No improvements needed. Your resume is optimized!
          </div>
        )}
      </div>
    </div>
  );
}
