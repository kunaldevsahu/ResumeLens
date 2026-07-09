"use client";

interface SubscriptionCardProps {
  plan: "basic" | "pro";
  onUpgradeClick: () => void;
}

export default function SubscriptionCard({
  plan,
  onUpgradeClick,
}: SubscriptionCardProps) {
  const isPro = plan === "pro";

  return (
    <div className="bg-[#191c1e] border border-[#ffffff14] rounded-2xl p-5 space-y-4 font-['Inter'] relative overflow-hidden group hover:border-[#2294f4]/30 hover:shadow-xl transition-all duration-300">
      
      {/* Decorative Blur Bubble */}
      <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-[#2294f4]/5 rounded-full blur-2xl group-hover:bg-[#2294f4]/10 transition-colors duration-300 pointer-events-none" />

      <div>
        <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffb781] text-[18px]">workspace_premium</span>
          Subscription Status
        </h4>
        <p className="text-[10px] text-[#bfc7d4]/60 mt-1">
          Review your plan details and billing.
        </p>
      </div>

      {isPro ? (
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-['Geist'] text-white">PRO</span>
            <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
          </div>

          <ul className="space-y-2 text-xs text-[#bfc7d4]/80">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400 text-[16px]">check_circle</span>
              <span>Unlimited Resumes</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400 text-[16px]">check_circle</span>
              <span>AI Resume Scanners & Reviewers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400 text-[16px]">check_circle</span>
              <span>All 8+ premium design templates</span>
            </li>
          </ul>

          <div className="text-[11px] text-[#bfc7d4]/60 italic pt-1 border-t border-white/[0.04] leading-relaxed">
            Thank you for supporting ResumeLens! You have full access to all features.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-['Geist'] text-white">BASIC</span>
            <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Free tier</span>
          </div>

          <ul className="space-y-2 text-xs text-[#bfc7d4]/80">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#bfc7d4]/50 text-[16px]">check_circle</span>
              <span>10 Resume Limit</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#bfc7d4]/50 text-[16px]">check_circle</span>
              <span>Basic ATS Scanner checks</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#bfc7d4]/30 text-[16px]">cancel</span>
              <span className="text-[#bfc7d4]/40 line-through">Pro AI Resume Reviewer</span>
            </li>
          </ul>

          <button
            onClick={onUpgradeClick}
            className="w-full bg-[#2294f4] hover:opacity-95 text-[#002b4e] font-['Geist'] text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-lg hover:shadow-[#2294f4]/10 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            Upgrade to Pro
          </button>
        </div>
      )}

    </div>
  );
}
