"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { useAuthStore } from "@/store/auth.store";
import UpgradeModal from "@/components/ui/UpgradeModal";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser()
      .catch((err) => console.error("Failed to load user profile in settings:", err))
      .finally(() => setLoading(false));
  }, [fetchUser]);

  const features = [
    {
      name: "Resume Creation Limit",
      basic: "Up to 10 Resumes",
      pro: "Unlimited Resumes",
      highlight: true,
    },
    {
      name: "Standard & Premium Templates",
      basic: "Included",
      pro: "Included",
      highlight: false,
    },
    {
      name: "Live Sandbox Builder Workspace",
      basic: "Included",
      pro: "Included",
      highlight: false,
    },
    {
      name: "PDF Downloads & Exports",
      basic: "Included",
      pro: "Included",
      highlight: false,
    },
    {
      name: "ATS Score Analysis",
      basic: "Included",
      pro: "Included",
      highlight: false,
    },
    {
      name: "Future Resume Versioning",
      basic: "Coming Soon",
      pro: "Priority Access",
      highlight: false,
    },
    {
      name: "Future AI Suggestions & Enhancements",
      basic: "Coming Soon",
      pro: "Priority Access",
      highlight: false,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#111415] text-[#e1e2e4] flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:pl-60">
          <Header />

          <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
            {/* Page Header */}
            <div>
              <h2 className="font-['Geist'] text-3xl font-bold text-white mb-1">
                Account Settings
              </h2>
              <p className="text-[#bfc7d4] text-sm font-['Inter']">
                Manage your subscription plans, billing settings, and feature accesses.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12 text-[#bfc7d4]">
                <span className="animate-spin inline-block h-6 w-6 border-2 border-[#a0caff] border-t-transparent rounded-full mr-2"></span>
                <span>Loading subscription settings...</span>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Subscription Summary Card */}
                <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-[#2294f4]/5 blur-[80px] rounded-full pointer-events-none"></div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-['Geist'] text-xs font-bold text-[#bfc7d4]/60 uppercase tracking-widest">
                          Billing Status
                        </span>
                        <span className="px-2 py-0.5 bg-[#10b981]/25 text-[#10b981] text-[9px] font-bold uppercase tracking-wider rounded border border-[#10b981]/30">
                          Active
                        </span>
                      </div>
                      <h3 className="font-['Geist'] text-xl font-bold text-white flex items-center gap-2">
                        Current Plan:{" "}
                        <span className={`text-base px-2.5 py-0.5 rounded font-bold uppercase tracking-wide ${user?.plan === "pro" ? "bg-[#2294f4]/25 text-[#a0caff] border border-[#2294f4]/35" : "bg-[#bfc7d4]/10 text-[#bfc7d4]"}`}>
                          {user?.plan === "pro" ? "Pro Plan" : "Basic (Free) Plan"}
                        </span>
                      </h3>
                      <p className="font-['Inter'] text-xs text-[#bfc7d4] opacity-75">
                        {user?.plan === "pro"
                          ? "You have unlimited access to create and manage professional resumes."
                          : `You are currently using ${user?.resumeCount ?? 0} of 10 free resumes.`}
                      </p>
                    </div>

                    {user?.plan === "basic" ? (
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="bg-[#2294f4] hover:bg-[#a0caff] text-[#002b4e] font-['Geist'] text-xs font-bold px-6 py-3 rounded-lg transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        Upgrade to Pro
                      </button>
                    ) : (
                      <div className="text-right">
                        <span className="text-[#a0caff] text-xs font-bold font-['Geist'] flex items-center gap-1.5 justify-end">
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                          Pro Member Status
                        </span>
                        <span className="text-[10px] text-[#bfc7d4]/50 block mt-1">
                          Simulated billing enabled
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Plan Comparison Table */}
                <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-[#ffffff14]">
                    <h4 className="font-['Geist'] text-base font-bold text-white">
                      Compare Plan Benefits
                    </h4>
                    <p className="text-[#bfc7d4]/60 text-xs font-['Inter'] mt-0.5">
                      Explore what is included in each plan tier.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-['Inter'] border-collapse">
                      <thead>
                        <tr className="bg-[#191c1e] text-[10px] uppercase font-bold text-[#bfc7d4]/70 tracking-widest border-b border-[#ffffff14]">
                          <th className="py-4 px-6">Feature</th>
                          <th className="py-4 px-6 text-center">Basic Plan</th>
                          <th className="py-4 px-6 text-center">Pro Plan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ffffff0a] text-xs text-[#e1e2e4]">
                        {features.map((feature, idx) => (
                          <tr
                            key={idx}
                            className={`hover:bg-[#111415]/20 transition-colors ${
                              feature.highlight ? "bg-[#2294f4]/5" : ""
                            }`}
                          >
                            <td className="py-4 px-6 font-medium text-white">{feature.name}</td>
                            <td className="py-4 px-6 text-center text-[#bfc7d4]/80">
                              {feature.basic === "Included" ? (
                                <span className="material-symbols-outlined text-[#10b981] text-[18px] inline-block align-middle">
                                  check_circle
                                </span>
                              ) : (
                                <span>{feature.basic}</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-center font-bold text-[#a0caff]">
                              {feature.pro === "Included" ? (
                                <span className="material-symbols-outlined text-[#a0caff] text-[18px] inline-block align-middle">
                                  check_circle
                                </span>
                              ) : (
                                <span>{feature.pro}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {user?.plan === "basic" && (
                    <div className="p-6 bg-[#191c1e] border-t border-[#ffffff14] flex justify-end">
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="bg-[#2294f4] hover:bg-[#a0caff] text-[#002b4e] font-['Geist'] text-xs font-bold px-6 py-2.5 rounded-lg transition-all cursor-pointer"
                      >
                        Get Unlimited Resumes Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </ProtectedRoute>
  );
}
