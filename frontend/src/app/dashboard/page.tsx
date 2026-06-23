"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { getResumes, type Resume } from "@/services/resume.service";

export default function Dashboard() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getResumes();
        setResumes(data);
      } catch (err) {
        console.error("Failed to load resumes on dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

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
            <section>
              <h2 className="font-['Geist'] text-3xl font-bold tracking-tight text-white mb-1">
                Good morning, Alex.
              </h2>
              <p className="font-['Inter'] text-sm text-[#bfc7d4] opacity-75">
                Your career progression is looking sharp. You have {resumes.length} active resume{resumes.length === 1 ? "" : "s"} in your dashboard.
              </p>
            </section>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Resumes */}
              <div className="bg-[#0b1c33] border border-[#ffffff14] p-6 rounded-xl flex flex-col justify-between hover:border-[#404752] transition-colors duration-200 group">
                <div className="flex justify-between items-start mb-4">
                  <span className="material-symbols-outlined text-[#a0caff] bg-[#2294f4]/10 p-3 rounded-lg">
                    description
                  </span>
                  <span className="text-[#10b981] text-xs font-bold font-['Geist'] uppercase tracking-wider">
                    Active sync
                  </span>
                </div>
                <div>
                  <p className="font-['Geist'] text-xs text-[#bfc7d4]/60 uppercase tracking-widest font-bold">
                    Total Resumes
                  </p>
                  <h3 className="font-['Geist'] text-4xl font-bold text-white mt-1">
                    {loading ? "..." : resumes.length}
                  </h3>
                </div>
              </div>

              {/* Last Updated */}
              <div className="bg-[#0b1c33] border border-[#ffffff14] p-6 rounded-xl flex flex-col justify-between hover:border-[#404752] transition-colors duration-200 group">
                <div className="flex justify-between items-start mb-4">
                  <span className="material-symbols-outlined text-[#ffb781] bg-[#dc7506]/10 p-3 rounded-lg">
                    update
                  </span>
                  <span className="text-[#bfc7d4]/50 text-xs font-bold font-['Geist']">
                    Real-time
                  </span>
                </div>
                <div>
                  <p className="font-['Geist'] text-xs text-[#bfc7d4]/60 uppercase tracking-widest font-bold">
                    Last Updated
                  </p>
                  <h3 className="font-['Geist'] text-xl font-bold text-white mt-3">
                    {resumes.length > 0
                      ? "2 hours ago"
                      : "No resumes yet"}
                  </h3>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="bg-[#0b1c33] border border-[#ffffff14] p-6 rounded-xl flex flex-col justify-between hover:border-[#404752] transition-colors duration-200 group">
                <div className="flex justify-between items-start mb-4">
                  <span className="material-symbols-outlined text-[#2294f4] bg-[#2294f4]/10 p-3 rounded-lg">
                    analytics
                  </span>
                  <span className="text-[#a0caff] text-xs font-bold font-['Geist'] uppercase tracking-wider">
                    Great progress
                  </span>
                </div>
                <div>
                  <p className="font-['Geist'] text-xs text-[#bfc7d4]/60 uppercase tracking-widest font-bold">
                    Profile Completion
                  </p>
                  <div className="flex items-end gap-3 mt-1">
                    <h3 className="font-['Geist'] text-3xl font-bold text-white">85%</h3>
                    <div className="w-full bg-[#191c1e] h-2 rounded-full mb-3">
                      <div className="bg-[#a0caff] h-full rounded-full" style={{ width: "85%" }}></div>
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
                      onClick={() => router.push("/resumes/new")}
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
    </ProtectedRoute>
  );
}