"use client";

interface ResumeUsageCardProps {
  resumesCount: number;
  plan: "basic" | "pro";
  onUpgradeClick: () => void;
}

export default function ResumeUsageCard({
  resumesCount,
  plan,
  onUpgradeClick,
}: ResumeUsageCardProps) {
  const limit = 10;
  const remaining = Math.max(0, limit - resumesCount);
  const isPro = plan === "pro";

  return (
    <div className="bg-[#191c1e] border border-[#ffffff14] rounded-2xl p-5 space-y-4 font-['Inter']">
      <div>
        <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-[#a0caff] text-[18px]">bar_chart</span>
          Resume Usage
        </h4>
        <p className="text-[10px] text-[#bfc7d4]/60 mt-1">
          Tracking your active resume count limit.
        </p>
      </div>

      {isPro ? (
        <div className="bg-[#111415] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#bfc7d4]/60">Usage Status</span>
            <span className="text-[#a0caff] font-bold">Unlimited</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#2294f4] to-[#a0caff] h-full rounded-full w-full" />
          </div>
          <p className="text-[10px] text-[#bfc7d4]/40 leading-relaxed pt-1">
            Thank you for supporting ResumeLens Pro!
          </p>
        </div>
      ) : (
        <div className="bg-[#111415] border border-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#bfc7d4]/60">Active Resumes</span>
            <span className="text-white font-bold">{resumesCount} / {limit}</span>
          </div>
          
          {/* Custom Block Segment Bar */}
          <div className="flex gap-1 h-3">
            {Array.from({ length: limit }).map((_, index) => {
              const isActive = index < resumesCount;
              return (
                <div
                  key={index}
                  className={`flex-1 rounded-sm transition-all duration-300 ${
                    isActive 
                      ? "bg-[#2294f4]" 
                      : "bg-white/5 border border-white/[0.02]"
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] pt-1">
            <span className="text-[#bfc7d4]/60">{remaining} Remaining</span>
            <button
              onClick={onUpgradeClick}
              className="text-[#a0caff] font-bold hover:underline"
            >
              Get Unlimited
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
