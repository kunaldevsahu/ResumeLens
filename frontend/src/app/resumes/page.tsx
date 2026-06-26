"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { getResumes, deleteResume, type Resume } from "@/services/resume.service";
import { useAuthStore } from "@/store/auth.store";
import UpgradeModal from "@/components/ui/UpgradeModal";

export default function ResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const user = useAuthStore((state) => state.user);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getResumes();
      setResumes(data);
    } catch (currentError) {
      setError(
        currentError instanceof Error
          ? currentError.message
          : "Failed to load resumes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = window.confirm("Delete this resume? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      // Refresh user profile store (resumeCount changed)
      useAuthStore.getState().fetchUser().catch(console.error);
    } catch (currentError) {
      alert(currentError instanceof Error ? currentError.message : "Failed to delete resume");
    }
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user && user.plan === "basic" && resumes.length >= 10) {
      setShowUpgradeModal(true);
    } else {
      router.push("/resumes/new");
    }
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-['Geist'] text-3xl font-bold text-white mb-1">
                  My Resumes
                </h2>
                <p className="text-[#bfc7d4] text-sm font-['Inter']">
                  Manage and iterate on your professional identities.
                </p>
              </div>

              <button
                onClick={handleCreateClick}
                className="bg-[#2294f4] text-[#002b4e] py-2.5 px-6 rounded-lg flex items-center gap-2 font-[#Geist] text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Create New
              </button>
            </div>

            {/* Toolbar search */}
            <div className="flex items-center gap-4 flex-1 max-w-md bg-[#191c1e] border border-[#ffffff14] rounded-lg px-3 py-1 focus-within:border-[#a0caff] transition-all">
              <span className="material-symbols-outlined text-[#bfc7d4] text-sm">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/50 focus:outline-none py-1.5"
                placeholder="Search resumes by title..."
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Loading Indicator */}
            {loading ? (
              <div className="text-center py-12 text-[#bfc7d4]">
                <span className="animate-spin inline-block h-6 w-6 border-2 border-[#a0caff] border-t-transparent rounded-full mr-2"></span>
                <span>Loading resumes...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResumes.length === 0 ? (
                  <div className="col-span-full border border-dashed border-[#ffffff14] rounded-xl p-12 text-center text-[#bfc7d4] bg-[#1d2022]/20">
                    <span className="material-symbols-outlined text-4xl mb-3">folder_open</span>
                    <p className="text-sm">No resumes found. Create your first resume to get started.</p>
                  </div>
                ) : (
                  filteredResumes.map((resume) => (
                    <div
                      key={resume.id}
                      onClick={() => router.push(`/resumes/${resume.id}/edit`)}
                      className="group relative flex flex-col bg-[#0b1c33] border border-[#ffffff14] rounded-xl p-6 transition-all duration-300 hover:bg-[#161B22] hover:border-[#ffffff33] hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded bg-[#2294f4]/10 text-[#a0caff]">
                          <span className="material-symbols-outlined">design_services</span>
                        </div>
                        <span className="text-xs text-[#bfc7d4] opacity-60 font-['Geist']">
                          Updated recently
                        </span>
                      </div>

                      <h3 className="font-['Geist'] text-lg font-bold text-white mb-2 group-hover:text-[#a0caff] transition-colors">
                        {resume.title}
                      </h3>

                      <p className="text-xs text-[#bfc7d4] font-['Inter'] mb-6 line-clamp-3 leading-relaxed">
                        {resume.summary || "No summary provided. Add a professional summary in the builder."}
                      </p>

                      <div className="mt-auto pt-4 border-t border-[#ffffff14] flex items-center justify-between">
                        <div className="flex gap-1">
                          <Link
                            href={`/resumes/${resume.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded hover:bg-[#323537] text-[#bfc7d4] hover:text-[#e1e2e4] transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </Link>
                          <Link
                            href={`/resumes/${resume.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded hover:bg-[#323537] text-[#bfc7d4] hover:text-[#e1e2e4] transition-colors"
                            title="Preview & Export"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </Link>
                          <button
                            onClick={(e) => handleDelete(resume.id, e)}
                            className="p-2 rounded hover:bg-[#323537] text-[#ef4444]/80 hover:text-[#ef4444] transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>

                        <span className="text-[#a0caff] font-['Geist'] text-xs font-bold flex items-center gap-1 group-hover:underline">
                          Open
                          <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                            arrow_forward
                          </span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
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