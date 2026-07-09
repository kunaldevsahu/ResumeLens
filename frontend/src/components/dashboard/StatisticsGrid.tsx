"use client";

interface StatisticsGridProps {
  resumesCount: number;
  analysesCount: number;
  plan: "basic" | "pro";
}

export default function StatisticsGrid({
  resumesCount,
  analysesCount,
  plan,
}: StatisticsGridProps) {
  const limit = 10;
  const remaining = Math.max(0, limit - resumesCount);
  const isPro = plan === "pro";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-['Geist']">
      
      {/* Card 1: My Resumes */}
      <div className="bg-[#191c1e] border border-[#ffffff14] p-5 rounded-2xl flex flex-col justify-between hover:border-white/[0.08] hover:bg-white/[0.01] transition-all group duration-300">
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-[#a0caff] bg-[#2294f4]/10 p-3 rounded-xl shrink-0">
            description
          </span>
          <span className="text-green-400 text-[10px] font-bold uppercase tracking-wider bg-green-500/10 px-2.5 py-0.5 rounded-full">
            Active
          </span>
        </div>
        <div>
          <p className="text-[10px] text-[#bfc7d4]/40 uppercase tracking-widest font-bold font-sans">
            My Resumes
          </p>
          <h3 className="text-3xl font-bold text-white mt-1.5 leading-none">
            {resumesCount}
          </h3>
          <p className="text-[10px] text-[#bfc7d4]/60 font-sans mt-1.5">
            Total resumes created
          </p>
        </div>
      </div>

      {/* Card 2: Resume Usage */}
      <div className="bg-[#191c1e] border border-[#ffffff14] p-5 rounded-2xl flex flex-col justify-between hover:border-white/[0.08] hover:bg-white/[0.01] transition-all group duration-300">
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-[#ffb781] bg-[#dc7506]/10 p-3 rounded-xl shrink-0">
            bar_chart
          </span>
          <span className="text-[#ffb781] text-[10px] font-bold uppercase tracking-wider bg-[#dc7506]/10 px-2.5 py-0.5 rounded-full">
            Usage
          </span>
        </div>
        <div>
          <p className="text-[10px] text-[#bfc7d4]/40 uppercase tracking-widest font-bold font-sans">
            Resume Usage
          </p>
          {isPro ? (
            <div className="mt-1.5">
              <h3 className="text-xl font-bold text-white">Unlimited</h3>
              <div className="w-full bg-[#111415] h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#2294f4] to-[#a0caff] h-full rounded-full w-full" />
              </div>
            </div>
          ) : (
            <div className="mt-1.5">
              <h3 className="text-xl font-bold text-white">
                {resumesCount} / {limit}
              </h3>
              <div className="w-full bg-[#111415] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#2294f4] to-[#a0caff] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((resumesCount / limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Current Plan */}
      <div className="bg-[#191c1e] border border-[#ffffff14] p-5 rounded-2xl flex flex-col justify-between hover:border-white/[0.08] hover:bg-white/[0.01] transition-all group duration-300">
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-[#2294f4] bg-[#2294f4]/10 p-3 rounded-xl shrink-0">
            workspace_premium
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${isPro ? "bg-[#2294f4]/25 text-[#a0caff]" : "bg-white/10 text-[#bfc7d4]"}`}>
            {isPro ? "Pro Tier" : "Basic"}
          </span>
        </div>
        <div>
          <p className="text-[10px] text-[#bfc7d4]/40 uppercase tracking-widest font-bold font-sans">
            Current Plan
          </p>
          <h3 className="text-xl font-bold text-white mt-1.5 leading-none">
            {isPro ? "Pro Account" : "Basic Account"}
          </h3>
          <p className="text-[10px] text-[#bfc7d4]/60 font-sans mt-2.5">
            {isPro ? "Unlimited resumes" : `${remaining} resumes remaining`}
          </p>
        </div>
      </div>

      {/* Card 4: Resume Analyses */}
      <div className="bg-[#191c1e] border border-[#ffffff14] p-5 rounded-2xl flex flex-col justify-between hover:border-white/[0.08] hover:bg-white/[0.01] transition-all group duration-300">
        <div className="flex justify-between items-start mb-4">
          <span className="material-symbols-outlined text-purple-400 bg-purple-500/10 p-3 rounded-xl shrink-0">
            analytics
          </span>
          <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 px-2.5 py-0.5 rounded-full">
            Insights
          </span>
        </div>
        <div>
          <p className="text-[10px] text-[#bfc7d4]/40 uppercase tracking-widest font-bold font-sans">
            Resume Analyses
          </p>
          <h3 className="text-3xl font-bold text-white mt-1.5 leading-none">
            {analysesCount}
          </h3>
          <p className="text-[10px] text-[#bfc7d4]/60 font-sans mt-1.5">
            Analyses completed
          </p>
        </div>
      </div>

    </div>
  );
}
