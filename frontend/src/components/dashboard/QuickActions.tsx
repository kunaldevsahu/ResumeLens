"use client";

interface QuickActionsProps {
  onCreateResumeClick: () => void;
  onAnalyzerClick: () => void;
  onTemplatesClick: () => void;
  onProfileClick: () => void;
}

export default function QuickActions({
  onCreateResumeClick,
  onAnalyzerClick,
  onTemplatesClick,
  onProfileClick,
}: QuickActionsProps) {
  const actions = [
    {
      title: "Create Resume",
      description: "Start from scratch or upload a resume to build a new one.",
      icon: "note_add",
      color: "text-[#a0caff] bg-[#2294f4]/10 border-[#2294f4]/20",
      hoverColor: "hover:border-[#2294f4]/40 hover:bg-[#2294f4]/5",
      onClick: onCreateResumeClick,
    },
    {
      title: "Resume Analyzer",
      description: "Compare your resume against job postings to maximize matching.",
      icon: "analytics",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      hoverColor: "hover:border-purple-500/40 hover:bg-purple-500/5",
      onClick: onAnalyzerClick,
    },
    {
      title: "Browse Templates",
      description: "Explore our library of premium, ATS-optimized layout templates.",
      icon: "grid_view",
      color: "text-[#ffb781] bg-[#dc7506]/10 border-[#dc7506]/20",
      hoverColor: "hover:border-[#dc7506]/40 hover:bg-[#dc7506]/5",
      onClick: onTemplatesClick,
    },
    {
      title: "Manage Profile",
      description: "Update details, social links, and check your billing status.",
      icon: "person",
      color: "text-[#bfc7d4] bg-white/5 border-white/10",
      hoverColor: "hover:border-white/20 hover:bg-white/[0.02]",
      onClick: onProfileClick,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-['Geist'] text-lg font-bold text-white tracking-tight">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-['Inter']">
        {actions.map((act) => (
          <button
            key={act.title}
            onClick={act.onClick}
            className={`flex flex-col text-left p-5 bg-[#191c1e] border border-[#ffffff14] rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none group active:scale-[0.98] ${act.hoverColor}`}
          >
            {/* Icon Block */}
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mb-4 ${act.color}`}>
              <span className="material-symbols-outlined text-[20px]">{act.icon}</span>
            </div>

            {/* Labels */}
            <div className="flex-1">
              <h4 className="font-['Geist'] text-sm font-bold text-white flex items-center justify-between">
                <span>{act.title}</span>
                <span className="material-symbols-outlined text-white/30 text-[16px] group-hover:translate-x-1 transition-transform group-hover:text-white/60">
                  arrow_forward
                </span>
              </h4>
              <p className="text-xs text-[#bfc7d4]/60 leading-relaxed mt-1.5">
                {act.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
