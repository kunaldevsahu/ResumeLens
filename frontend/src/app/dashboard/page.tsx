"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { getResumes, type Resume } from "@/services/resume.service";
import { useAuthStore } from "@/store/auth.store";
import UpgradeModal from "@/components/ui/UpgradeModal";

export default function Dashboard() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getResumes();
        setResumes(data);
        await fetchUser();
      } catch (err) {
        console.error("Failed to load resumes on dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [fetchUser]);

  const uniqueTemplates = resumes.length > 0
    ? new Set(resumes.map((r) => r.template || "modern-ats")).size
    : 0;

  const profileCompletion = (() => {
    if (!user) return 30;
    let score = 0;
    if (user.name) score += 20;
    if (user.email) score += 20;
    if (user.phone) score += 20;
    if (user.linkedin) score += 15;
    if (user.github) score += 15;
    if (user.profilePicture) score += 10;
    return score;
  })();

  const handleCreateResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user && user.plan === "basic" && resumes.length >= 10) {
      setShowUpgradeModal(true);
    } else {
      router.push("/resumes/new");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#111415] text-[#e1e2e4] flex">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:pl-60">
          <Header />

          <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
            {/* Welcome Section */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Geist'] text-3xl font-bold tracking-tight text-white mb-1">
                  Good morning, {user?.name || "Alex"}.
                </h2>
                <p className="font-['Inter'] text-sm text-[#bfc7d4] opacity-75">
                  Your career progression is looking sharp. You have {resumes.length} active resume{resumes.length === 1 ? "" : "s"} in your dashboard.
                </p>
              </div>

              {user?.plan === "basic" && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-[#2294f4]/10 hover:bg-[#2294f4]/25 text-[#a0caff] border border-[#2294f4]/35 px-4 py-2 rounded-lg text-xs font-bold font-[#Geist] flex items-center gap-1.5 self-start md:self-auto transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  Upgrade to Pro
                </button>
              )}
            </section>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Resumes */}
              <div className="bg-[#0b1c33] border border-[#ffffff14] p-5 rounded-xl flex flex-col justify-between hover:border-[#404752] transition-colors duration-200 group">
                <div className="flex justify-between items-start mb-4">
                  <span className="material-symbols-outlined text-[#a0caff] bg-[#2294f4]/10 p-3 rounded-lg">
                    description
                  </span>
                  <span className="text-[#10b981] text-[10px] font-bold font-['Geist'] uppercase tracking-wider">
                    Synced
                  </span>
                </div>
                <div>
                  <p className="font-['Geist'] text-[10px] text-[#bfc7d4]/60 uppercase tracking-widest font-bold">
                    Total Resumes
                  </p>
                  <h3 className="font-['Geist'] text-3xl font-bold text-white mt-1">
                    {loading ? "..." : resumes.length}
                  </h3>
                </div>
              </div>

              {/* Plan Type & Usage */}
              <div className="bg-[#0b1c33] border border-[#ffffff14] p-5 rounded-xl flex flex-col justify-between hover:border-[#404752] transition-colors duration-200 group">
                <div className="flex justify-between items-start mb-4">
                  <span className="material-symbols-outlined text-[#ffb781] bg-[#dc7506]/10 p-3 rounded-lg">
                    workspace_premium
                  </span>
                  <span className={`text-[10px] font-bold font-['Geist'] uppercase tracking-wider px-2 py-0.5 rounded ${user?.plan === "pro" ? "bg-[#2294f4]/20 text-[#a0caff]" : "bg-[#bfc7d4]/15 text-[#bfc7d4]"}`}>
                    {user?.plan === "pro" ? "Pro" : "Basic"}
                  </span>
                </div>
                <div>
                  <p className="font-['Geist'] text-[10px] text-[#bfc7d4]/60 uppercase tracking-widest font-bold">
                    Subscription Usage
                  </p>
                  {user?.plan === "pro" ? (
                    <div className="mt-1">
                      <h3 className="font-['Geist'] text-lg font-bold text-white">Unlimited Usage</h3>
                      <div className="w-full bg-[#191c1e] h-1.5 rounded-full mt-2">
                        <div className="bg-[#a0caff] h-full rounded-full w-full"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <h3 className="font-['Geist'] text-lg font-bold text-white">
                        {resumes.length} of 10 used
                      </h3>
                      <div className="w-full bg-[#191c1e] h-1.5 rounded-full mt-2">
                        <div
                          className="bg-[#a0caff] h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((resumes.length / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="mt-3 w-full bg-[#2294f4]/15 hover:bg-[#2294f4]/25 text-[#a0caff] border border-[#2294f4]/35 py-1 px-2 rounded-lg text-[10px] font-bold font-['Geist'] flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px]">bolt</span>
                        Upgrade to Pro
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Templates Used */}
              <div className="bg-[#0b1c33] border border-[#ffffff14] p-5 rounded-xl flex flex-col justify-between hover:border-[#404752] transition-colors duration-200 group">
                <div className="flex justify-between items-start mb-4">
                  <span className="material-symbols-outlined text-[#a0caff] bg-[#2294f4]/10 p-3 rounded-lg">
                    style
                  </span>
                  <span className="text-[#bfc7d4]/50 text-[10px] font-bold font-['Geist'] uppercase">
                    Templates
                  </span>
                </div>
                <div>
                  <p className="font-['Geist'] text-[10px] text-[#bfc7d4]/60 uppercase tracking-widest font-bold">
                    Templates Used
                  </p>
                  <h3 className="font-['Geist'] text-3xl font-bold text-white mt-1">
                    {loading ? "..." : `${uniqueTemplates} / 8`}
                  </h3>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="bg-[#0b1c33] border border-[#ffffff14] p-5 rounded-xl flex flex-col justify-between hover:border-[#404752] transition-colors duration-200 group">
                <div className="flex justify-between items-start mb-4">
                  <span className="material-symbols-outlined text-[#2294f4] bg-[#2294f4]/10 p-3 rounded-lg">
                    analytics
                  </span>
                  <span className="text-[#a0caff] text-[10px] font-bold font-['Geist'] uppercase tracking-wider">
                    Progress
                  </span>
                </div>
                <div>
                  <p className="font-['Geist'] text-[10px] text-[#bfc7d4]/60 uppercase tracking-widest font-bold">
                    Profile Completion
                  </p>
                  <div className="flex items-end gap-3 mt-1">
                    <h3 className="font-['Geist'] text-2xl font-bold text-white">{profileCompletion}%</h3>
                    <div className="w-full bg-[#191c1e] h-1.5 rounded-full mb-2">
                      <div className="bg-[#a0caff] h-full rounded-full" style={{ width: `${profileCompletion}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Bottom Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <section className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-['Geist'] text-xl font-semibold text-white">Recent Activity</h4>
                  <button className="text-[#a0caff] font-['Geist'] text-xs font-bold hover:underline transition-all">
                    View all history
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="mb-1">
                    <p className="font-['Geist'] text-xs text-[#a0caff] uppercase tracking-widest font-bold">
                      Today
                    </p>
                  </div>

                  {/* Activity Item 1 */}
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-[#ffffff14] bg-[#0c0f10]/40 hover:bg-[#0c0f10]/80 transition-all duration-200">
                    <div className="w-10 h-10 rounded-full bg-[#a0caff]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#a0caff]">post_add</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-['Inter'] text-sm text-[#e1e2e4]">
                        You created <span className="font-bold text-white">'Senior Product Designer'</span> resume
                      </p>
                      <p className="font-['Geist'] text-xs text-[#bfc7d4]/60 mt-0.5">
                        Today at 9:42 AM • Professional Template
                      </p>
                    </div>
                    <button className="text-[#bfc7d4] hover:text-[#a0caff] transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>

                  <div className="mt-6 mb-1">
                    <p className="font-['Geist'] text-xs text-[#a0caff] uppercase tracking-widest font-bold">
                      Yesterday
                    </p>
                  </div>

                  {/* Activity Item 2 */}
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-[#ffffff14] bg-[#0c0f10]/40 hover:bg-[#0c0f10]/80 transition-all duration-200">
                    <div className="w-10 h-10 rounded-full bg-[#ffb781]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#ffb781]">edit</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-['Inter'] text-sm text-[#e1e2e4]">
                        Updated <span className="font-bold text-white">'Software Engineer'</span> skills section
                      </p>
                      <p className="font-['Geist'] text-xs text-[#bfc7d4]/60 mt-0.5">
                        Yesterday at 5:15 PM • Added 3 new technologies
                      </p>
                    </div>
                    <button className="text-[#bfc7d4] hover:text-[#a0caff] transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Quick Actions & ATS Score */}
              <section className="space-y-6">
                <div>
                  <h4 className="font-['Geist'] text-xl font-semibold text-white mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={handleCreateResumeClick}
                      className="w-full flex items-center justify-between p-4 bg-[#0b1c33] border border-[#ffffff14] rounded-xl hover:border-[#a0caff] hover:bg-[#1d2022] transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#a0caff]">note_add</span>
                        <span className="font-['Geist'] text-sm font-bold text-white">Create New Resume</span>
                      </div>
                      <span className="material-symbols-outlined text-[#bfc7d4] group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </button>

                    <button
                      onClick={() => router.push("/templates")}
                      className="w-full flex items-center justify-between p-4 bg-[#0b1c33] border border-[#ffffff14] rounded-xl hover:border-[#a0caff] hover:bg-[#1d2022] transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#b7c7e6]">grid_view</span>
                        <span className="font-['Geist'] text-sm font-bold text-white">View Templates</span>
                      </div>
                      <span className="material-symbols-outlined text-[#bfc7d4] group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </button>

                    <button
                      onClick={() => router.push("/ats-analysis")}
                      className="w-full flex items-center justify-between p-4 bg-[#0b1c33] border border-[#ffffff14] rounded-xl hover:border-[#a0caff] hover:bg-[#1d2022] transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#ffb781]">analytics</span>
                        <span className="font-['Geist'] text-sm font-bold text-white">ATS Analysis</span>
                      </div>
                      <span className="material-symbols-outlined text-[#bfc7d4] group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>

                {/* ATS Overview Widget */}
                <div className="relative overflow-hidden bg-[#2294f4]/10 border border-[#2294f4]/20 rounded-xl p-6">
                  <div className="relative z-10">
                    <p className="font-['Geist'] text-xs text-[#2294f4] uppercase font-bold tracking-wider mb-2">
                      ATS SCORE ANALYSIS
                    </p>
                    <div className="flex items-end gap-3 mb-4">
                      <h5 className="font-['Geist'] text-4xl font-extrabold text-white">78%</h5>
                      <div className="flex-1 bg-[#0c0f10] h-2 rounded-full mb-3">
                        <div className="bg-[#a0caff] h-full rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push("/ats-analysis")}
                      className="w-full bg-[#a0caff] text-[#003259] py-2 rounded font-['Geist'] text-xs font-bold hover:opacity-90 active:scale-95 transition-transform"
                    >
                      Optimize Now
                    </button>
                  </div>
                  <div className="absolute -right-12 -bottom-12 opacity-5">
                    <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      analytics
                    </span>
                  </div>
                </div>
              </section>
            </div>
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