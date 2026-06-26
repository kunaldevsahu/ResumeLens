"use client";

interface MissingKeywordsProps {
  keywords: string[];
}

export default function MissingKeywords({ keywords }: MissingKeywordsProps) {
  return (
    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="font-['Geist'] text-lg font-bold text-white mb-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#ffb781]">key</span>
          Missing Keywords
        </h3>
        <p className="text-xs text-[#bfc7d4] opacity-75">
          These essential skills and technology stacks were missing or poorly positioned in your resume.
        </p>
      </div>

      {keywords.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-[#10b981] font-bold font-['Geist'] bg-[#10b981]/10 p-3 rounded-lg border border-[#10b981]/20">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Zero missing keywords detected! You have perfectly aligned your stack.</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {keywords.map((kw) => (
            <div
              key={kw}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111415] border border-[#ffffff0a] text-xs font-semibold text-white font-['Geist'] hover:border-[#ffffff20] transition-colors"
            >
              <span>{kw}</span>
              <button
                type="button"
                disabled
                className="opacity-40 hover:opacity-100 hover:text-[#a0caff] text-[10px] font-bold font-['Inter'] flex items-center justify-center cursor-not-allowed"
                title="Add to Resume (Coming Soon)"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
