"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { getResumes, type Resume } from "@/services/resume.service";

export default function AtsAnalysisPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getResumes();
        setResumes(data);
        if (data.length > 0) {
          setSelectedResume(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load resumes on ATS page", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const selectedResumeObj = resumes.find((r) => r.id === selectedResume);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#111415] text-[#e1e2e4] flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:pl-60">
          <Header />

          <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="font-['Geist'] text-3xl font-bold text-white mb-1">
                  ATS Score Analysis
                </h2>
                <p className="text-[#bfc7d4] text-sm font-['Inter'] max-w-xl">
                  Optimize your resume for searchability and ranking. Our AI simulates leading Applicant Tracking Systems to identify friction points in your profile.
                </p>
              </div>

              {/* Selector */}
              <div className="relative inline-block text-left shrink-0">
                <label className="text-xs font-bold text-[#bfc7d4] uppercase tracking-wider opacity-60 mb-2 block">
                  Analyzing Resume
                </label>
                <div className="relative">
                  <select
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    className="appearance-none bg-[#1d2022] border border-[#ffffff14] text-white text-sm rounded-lg focus:ring-[#a0caff] focus:border-[#a0caff] block w-64 p-3 pr-10 cursor-pointer hover:bg-[#282a2c] transition-colors"
                  >
                    {loading ? (
                      <option>Loading resumes...</option>
                    ) : resumes.length === 0 ? (
                      <option>No resumes found</option>
                    ) : (
                      resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)
                    )}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#bfc7d4]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Score card (4 cols) */}
              <div className="lg:col-span-4 bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#2294f4]/10 blur-3xl rounded-full"></div>
                <div className="relative mb-6">
                  {/* Radial progress ring */}
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      className="text-[#323537]"
                      cx="96"
                      cy="96"
                      fill="transparent"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                    ></circle>
                    <circle
                      className="text-[#2294f4] transition-all duration-1000 ease-out"
                      cx="96"
                      cy="96"
                      fill="transparent"
                      r="80"
                      stroke="currentColor"
                      strokeDasharray="502.6"
                      strokeDashoffset={selectedResumeObj ? "110" : "502.6"}
                      strokeLinecap="round"
                      strokeWidth="12"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-['Geist'] text-4xl font-extrabold text-white">
                      {selectedResumeObj ? "78%" : "0%"}
                    </span>
                    <span className="text-xs text-[#10b981] font-bold uppercase tracking-widest mt-1">
                      {selectedResumeObj ? "Good" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#bfc7d4] mb-6">
                    {selectedResumeObj
                      ? "You are in the top 15% of candidates for this job category."
                      : "Add more details to generate your score."}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <div className="h-1 w-8 rounded-full bg-[#2294f4]"></div>
                    <div className="h-1 w-8 rounded-full bg-[#2294f4]"></div>
                    <div className="h-1 w-8 rounded-full bg-[#2294f4]"></div>
                    <div className="h-1 w-8 rounded-full bg-[#323537]"></div>
                  </div>
                </div>
              </div>

              {/* Critical issues list (8 cols) */}
              <div className="lg:col-span-8 bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-['Geist'] text-xl font-bold flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined text-[#ef4444]">warning</span>
                    Critical Issues
                  </h3>
                  <span className="bg-[#ef4444]/10 text-[#ef4444] px-3 py-1 rounded-full text-xs font-bold font-['Geist']">
                    {selectedResumeObj ? "3 High Priority" : "0 Issues"}
                  </span>
                </div>

                <div className="space-y-4">
                  {selectedResumeObj ? (
                    <>
                      {/* Issue 1 */}
                      <div className="group flex items-start gap-4 p-4 rounded-lg bg-[#191c1e] border border-transparent hover:border-[#ffffff14] transition-all">
                        <div className="w-10 h-10 rounded bg-[#ef4444]/10 flex-shrink-0 flex items-center justify-center text-[#ef4444]">
                          <span className="material-symbols-outlined">error</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">Missing contact info: Phone Number</p>
                          <p className="text-xs text-[#bfc7d4] mt-0.5">
                            ATS systems prioritize candidates with complete reachable profiles. Add phone details to resume header.
                          </p>
                        </div>
                        <button className="text-[#a0caff] text-xs font-bold hover:underline">Fix now</button>
                      </div>

                      {/* Issue 2 */}
                      <div className="group flex items-start gap-4 p-4 rounded-lg bg-[#191c1e] border border-transparent hover:border-[#ffffff14] transition-all">
                        <div className="w-10 h-10 rounded bg-[#ef4444]/10 flex-shrink-0 flex items-center justify-center text-[#ef4444]">
                          <span className="material-symbols-outlined">draft_orders</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">Generic file name: "v2_final.pdf"</p>
                          <p className="text-xs text-[#bfc7d4] mt-0.5">
                            Recommended pattern: "Firstname_Lastname_Title.pdf". Improves visibility & storage organization.
                          </p>
                        </div>
                        <button className="text-[#a0caff] text-xs font-bold hover:underline">Rename</button>
                      </div>

                      {/* Issue 3 */}
                      <div className="group flex items-start gap-4 p-4 rounded-lg bg-[#191c1e] border border-transparent hover:border-[#ffffff14] transition-all">
                        <div className="w-10 h-10 rounded bg-[#f59e0b]/10 flex-shrink-0 flex items-center justify-center text-[#f59e0b]">
                          <span className="material-symbols-outlined">data_object</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">Possible table detection in Work History</p>
                          <p className="text-xs text-[#bfc7d4] mt-0.5">
                            Some legacy ATS parsers fail to parse multi-column grid formatting. Ensure formatting is standard A4 layout.
                          </p>
                        </div>
                        <button className="text-[#a0caff] text-xs font-bold hover:underline">View</button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#bfc7d4] py-8 text-center">
                      Select or create a resume above to analyze performance.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Breakdown cards */}
            <div className="space-y-6">
              <h3 className="font-['Geist'] text-xl font-bold text-white">Detailed Category Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Keywords */}
                <div className="p-5 rounded-lg bg-[#1d2022] border border-[#ffffff14] flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="material-symbols-outlined text-[#a0caff]">key</span>
                    <span className="text-xs font-bold text-[#bfc7d4]">65%</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-['Geist']">Keywords & Skills</h4>
                    <p className="text-[11px] text-[#bfc7d4] mt-1 leading-relaxed">
                      Missing: "Agile", "User-Centric Design", "Stakeholder Management"
                    </p>
                  </div>
                </div>

                {/* Formatting */}
                <div className="p-5 rounded-lg bg-[#1d2022] border border-[#ffffff14] flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="material-symbols-outlined text-[#10b981]">grid_view</span>
                    <span className="text-xs font-bold text-[#10b981]">92%</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-['Geist']">Formatting & Layout</h4>
                    <p className="text-[11px] text-[#bfc7d4] mt-1 leading-relaxed">
                      Safe margins, structure, font weight and text scaling comply with parsing rules.
                    </p>
                  </div>
                </div>

                {/* Content Quality */}
                <div className="p-5 rounded-lg bg-[#1d2022] border border-[#ffffff14] flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="material-symbols-outlined text-[#f59e0b]">edit_note</span>
                    <span className="text-xs font-bold text-[#bfc7d4]">81%</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-['Geist']">Content Quality</h4>
                    <p className="text-[11px] text-[#bfc7d4] mt-1 leading-relaxed">
                      Excellent usage of action verbs. Consider adding specific business metrics.
                    </p>
                  </div>
                </div>

                {/* Hierarchy */}
                <div className="p-5 rounded-lg bg-[#1d2022] border border-[#ffffff14] flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="material-symbols-outlined text-[#1a91f0]">account_tree</span>
                    <span className="text-xs font-bold text-[#10b981]">100%</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-['Geist']">Section Hierarchy</h4>
                    <p className="text-[11px] text-[#bfc7d4] mt-1 leading-relaxed">
                      Perfect header hierarchy. Contact, Work History, Education, and Skills tags map cleanly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Banner */}
            <div className="bg-[#2294f4]/5 border border-[#2294f4]/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#2294f4]/20 flex-shrink-0 flex items-center justify-center text-[#2294f4]">
                <span className="material-symbols-outlined text-[32px] fill-icon" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_fix_high
                </span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-['Geist'] text-lg font-bold text-white mb-1">Lens AI Optimization</h4>
                <p className="text-xs text-[#bfc7d4] leading-relaxed">
                  We've identified 12 minor improvements that can boost your score from 78% to 94%. Let our AI automatically rewrite your bullet points for maximum impact.
                </p>
              </div>
              <button className="bg-[#2294f4] text-[#002b4e] font-['Geist'] text-xs font-bold px-6 py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all whitespace-nowrap">
                Optimize Now
              </button>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
