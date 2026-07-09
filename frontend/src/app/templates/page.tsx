"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { createResume } from "@/services/resume.service";
import { useAuthStore } from "@/store/auth.store";
import UpgradeModal from "@/components/ui/UpgradeModal";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  atsCompatible: boolean;
  comingSoon?: boolean;
  badgeText?: string;
}

const templates: Template[] = [
  {
    id: "modern-ats",
    name: "Modern ATS",
    category: "ATS Friendly",
    description: "Highly structured, clean sans-serif layout optimized for Applicant Tracking Systems.",
    image: "/templates/modern-ats.webp",
    atsCompatible: true,
  },
  {
    id: "corporate",
    name: "Corporate",
    category: "Professional",
    description: "Sleek sans-serif layout with top color accent bands and left-bordered headers.",
    image: "/templates/corporate.webp",
    atsCompatible: true,
  },
  {
    id: "executive",
    name: "Executive",
    category: "Professional",
    description: "Classic centered layout with elegant serif typography, perfect for executive roles.",
    image: "/templates/executive.webp",
    atsCompatible: true,
  },
  {
    id: "two-column",
    name: "Professional Two Column",
    category: "Professional",
    description: "Asymmetrical grid split layout featuring side-by-side content panels.",
    image: "/templates/two-column.webp",
    atsCompatible: true,
  },
  {
    id: "developer",
    name: "Developer",
    category: "Creative",
    description: "Monospace font with custom command-line styling designed for programmers and tech roles.",
    image: "/templates/developer.webp",
    atsCompatible: false,
    badgeText: "Developer Focus",
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "ATS Friendly",
    description: "Spacious layout with faint divider lines, standard-case headers, and clean margins.",
    image: "/templates/minimal.jpeg",
    atsCompatible: true,
  },
  {
    id: "startup",
    name: "Startup",
    category: "Creative",
    description: "Modern punchy layout featuring tag capsules for skills and custom tech stacks.",
    image: "/templates/startup.webp",
    atsCompatible: true,
  },
  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    description: "Artistic off-white template with Playfair headers, warm backgrounds, and terracota accents.",
    image: "/templates/creative.webp",
    atsCompatible: false,
    badgeText: "Design Focus",
  },
];

export default function TemplateGalleryPage() {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser().catch(console.error);
  }, [fetchUser]);

  const handleUseTemplate = async (templateId: string) => {
    if (user && user.plan === "basic" && user.resumeCount >= 10) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      const uploadedDataStr = typeof window !== "undefined" ? sessionStorage.getItem("uploadedResumeData") : null;
      
      let payload: any = {
        title: `My ${templateId.replace("-", " ")} Resume`,
        summary: "",
        skills: "",
        template: templateId,
        experience: {
          personalInfo: {
            name: "",
            email: "",
            phone: "",
            jobTitle: "",
            location: "",
            website: "",
            linkedin: "",
            github: "",
            codeforces: "",
            leetcode: "",
          },
          items: [],
          settings: {
            fontSize: "md",
            spacing: "normal",
            sectionOrder: ["summary", "education", "experience", "projects", "certifications", "skills"],
          }
        },
        education: {
          items: [],
          certifications: []
        },
        projects: {
          items: []
        }
      };

      if (uploadedDataStr) {
        try {
          const parsed = JSON.parse(uploadedDataStr);
          payload = {
            ...payload,
            ...parsed,
            template: templateId, // ensure chosen template is set
          };
          // Clear session storage so it is a one-time operation
          sessionStorage.removeItem("uploadedResumeData");
        } catch (e) {
          console.error("Failed to parse uploaded resume data from session", e);
        }
      }

      const newResume = await createResume(payload);
      // Refresh user profile store (resumeCount changed)
      await fetchUser().catch(console.error);
      router.push(`/resumes/${newResume.id}/edit`);
    } catch (err) {
      console.error("Failed to create resume from template", err);
      alert("Failed to initialize resume. Please try again.");
    }
  };


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
                Choose a Template
              </h2>
              <p className="text-[#bfc7d4] text-sm font-['Inter'] max-w-xl">
                Select from our library of high-performance, recruiter-ready designs to jumpstart your career builder.
              </p>
            </div>

            {/* Grid Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`group relative flex flex-col bg-[#1d2022]/40 rounded-xl border border-[#ffffff14] overflow-hidden transition-all duration-300 ${
                    template.comingSoon 
                      ? "opacity-75" 
                      : "hover:border-[#a0caff]/40 hover:-translate-y-1"
                  }`}
                >
                  <div className="aspect-[4/5] bg-[#191c1e] relative overflow-hidden">
                    <img
                      className="w-full h-full object-cover object-top opacity-85 transition-transform duration-500 group-hover:scale-105"
                      src={template.image}
                      alt={template.name}
                    />

                    {/* Overlay Actions on Hover */}
                    {!template.comingSoon && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleUseTemplate(template.id)}
                          className="px-5 py-2.5 bg-[#a0caff] text-[#003259] font-['Geist'] text-xs font-bold rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(160,202,255,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                        >
                          Use Template
                        </button>
                        <button
                          onClick={() => setPreviewImage(template.image)}
                          className="px-5 py-2.5 bg-[#191c1e] text-[#e1e2e4] font-['Geist'] text-xs font-bold rounded-lg border border-[#ffffff14] hover:bg-[#282a2c] hover:scale-[1.02] transition-all cursor-pointer"
                        >
                          Preview Template
                        </button>
                      </div>
                    )}

                    {template.comingSoon && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="px-4 py-2 bg-[#ffb781]/10 border border-[#ffb781]/30 text-[#ffb781] text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg">
                          Coming Soon
                        </span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {template.atsCompatible ? (
                        <span className="px-2.5 py-1 bg-[#10b981]/25 text-[#10b981] text-[9px] font-bold uppercase tracking-wider rounded border border-[#10b981]/30 backdrop-blur-md">
                          ATS Friendly
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-[#ffb781]/25 text-[#ffb781] text-[9px] font-bold uppercase tracking-wider rounded border border-[#ffb781]/30 backdrop-blur-md">
                          {template.badgeText || "Developer Focus"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex items-center justify-between border-t border-[#ffffff0a] bg-[#111415]/20">
                    <div>
                      <h3 className="font-['Geist'] text-base font-semibold text-white">
                        {template.name}
                      </h3>
                      <p className="font-['Geist'] text-xs text-[#bfc7d4] mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Image Preview Overlay Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black p-2 rounded-full flex items-center justify-center transition-colors border border-white/10"
              onClick={() => setPreviewImage(null)}
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <img
              src={previewImage}
              alt="Template Preview"
              className="w-full h-auto rounded-xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </ProtectedRoute>
  );
}

