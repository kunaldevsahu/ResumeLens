"use client";

import { Resume } from "@/services/resume.service";

interface SelectResumeProps {
  resumes: Resume[];
  selectedResumeId: string;
  onSelect: (id: string) => void;
  onNext: () => void;
}

export default function SelectResume({
  resumes,
  selectedResumeId,
  onSelect,
  onNext,
}: SelectResumeProps) {
  const getPreviewImage = (template?: string) => {
    const temp = template || "modern-ats";
    // Returns mapped local public images matching project landing page
    return `/templates/${temp}-preview.png`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-['Geist'] text-lg font-bold text-white mb-1">
          Select Existing Resume
        </h3>
        <p className="text-xs text-[#bfc7d4] opacity-75">
          Select one of your saved Resumes from ResumeLens to run the ATS analyzer.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-[#191c1e] border border-[#ffffff0a] rounded-xl p-8 text-center text-sm text-[#bfc7d4] opacity-60">
          <span className="material-symbols-outlined text-[48px] mb-2 text-[#bfc7d4]/40">
            description
          </span>
          <p>No resumes created yet. Go back to your Dashboard to build your first resume!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[360px] overflow-y-auto pr-1">
          {resumes.map((resume) => {
            const isSelected = selectedResumeId === resume.id;
            return (
              <button
                key={resume.id}
                onClick={() => onSelect(resume.id)}
                className={`text-left rounded-xl border p-4 bg-[#111415] hover:bg-[#1d2022] hover:border-[#ffffff20] transition-all flex flex-col justify-between h-[160px] cursor-pointer group relative overflow-hidden ${
                  isSelected
                    ? "border-[#2294f4] ring-1 ring-[#2294f4] shadow-[0_0_20px_rgba(34,148,244,0.1)]"
                    : "border-[#ffffff14]"
                }`}
              >
                {/* Visual Glow Accent */}
                <div className="absolute right-0 top-0 w-24 h-24 bg-[#2294f4]/5 blur-lg rounded-full pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>

                <div className="space-y-2 relative z-10 w-full">
                  <div className="flex justify-between items-start">
                    <span className="font-['Geist'] font-bold text-white text-sm line-clamp-2 pr-4">
                      {resume.title}
                    </span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[#2294f4] text-[18px]">
                        check_circle
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#bfc7d4]/60 uppercase tracking-widest font-bold font-['Geist']">
                    {resume.template || "modern-ats"}
                  </div>
                </div>

                <div className="text-[10px] text-[#bfc7d4]/40 font-['Inter'] relative z-10">
                  Updated: {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : "Recently"}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {resumes.length > 0 && (
        <div className="flex justify-end pt-4 border-t border-[#ffffff0a]">
          <button
            onClick={onNext}
            disabled={!selectedResumeId}
            className="bg-[#2294f4] text-[#002b4e] hover:opacity-90 active:scale-95 px-6 py-2.5 rounded-lg text-xs font-bold font-['Geist'] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
