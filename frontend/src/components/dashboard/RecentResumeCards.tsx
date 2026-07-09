"use client";

import type { Resume } from "@/services/resume.service";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RecentResumeCardsProps {
  resumes: Resume[];
  onDuplicate: (resume: Resume) => void;
  onDelete: (id: string) => void;
}

export default function RecentResumeCards({
  resumes,
  onDuplicate,
  onDelete,
}: RecentResumeCardsProps) {
  const router = useRouter();

  // Get up to 4 most recently updated resumes
  const sortedResumes = [...resumes]
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 4);

  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return "Some time ago";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${Math.max(1, diffMins)} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTemplateLabel = (templateName?: string) => {
    if (!templateName) return "Modern ATS";
    return templateName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  // If no resumes exist, render the empty state
  if (resumes.length === 0) {
    return (
      <div className="bg-[#191c1e] border border-[#ffffff14] rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-6">
        {/* Modern Illustration using pure CSS / Material Icons */}
        <div className="w-20 h-20 rounded-full bg-[#2294f4]/5 border border-[#2294f4]/15 flex items-center justify-center text-[#a0caff]">
          <span className="material-symbols-outlined text-[40px] animate-pulse">
            note_add
          </span>
        </div>

        <div className="space-y-2 max-w-sm">
          <h4 className="font-['Geist'] text-lg font-bold text-white tracking-tight">
            Create Your First Resume
          </h4>
          <p className="font-['Inter'] text-xs text-[#bfc7d4]/60 leading-relaxed">
            Start building your career progression profile. Choose from our professional, recruiter-vetted templates.
          </p>
        </div>

        <button
          onClick={() => router.push("/resumes/new")}
          className="bg-[#2294f4] hover:opacity-95 text-[#002b4e] font-['Geist'] text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-[#2294f4]/10 active:scale-95"
        >
          Create Resume
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <h3 className="font-['Geist'] text-lg font-bold text-white tracking-tight">
          Recent Resumes
        </h3>
        <Link
          href="/resumes"
          className="text-[#a0caff] font-['Geist'] text-xs font-bold hover:underline transition-all flex items-center gap-0.5"
        >
          <span>View All</span>
          <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
        </Link>
      </div>

      {/* Grid of resume cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedResumes.map((resume) => (
          <div
            key={resume.id}
            className="bg-[#191c1e] border border-[#ffffff14] hover:border-white/[0.08] rounded-2xl p-5 flex gap-4 transition-all duration-300 group hover:shadow-xl hover:bg-white/[0.01]"
          >
            {/* Miniature Preview Thumbnail Placeholder */}
            <div
              onClick={() => router.push(`/resumes/${resume.id}/edit`)}
              className="w-20 h-28 shrink-0 bg-[#111415] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden cursor-pointer hover:border-white/20 transition-all select-none relative group/thumb"
            >
              {/* Fake Resume Lines mimicking layout */}
              <div className="space-y-2">
                {/* Header */}
                <div className="space-y-1">
                  <div className="w-9 h-1 bg-[#a0caff]/30 rounded-full" />
                  <div className="w-5 h-0.5 bg-[#bfc7d4]/20 rounded-full" />
                </div>
                {/* Body Blocks */}
                <div className="space-y-1 pt-1">
                  <div className="w-12 h-0.5 bg-[#bfc7d4]/10 rounded-full" />
                  <div className="w-10 h-0.5 bg-[#bfc7d4]/10 rounded-full" />
                  <div className="w-13 h-0.5 bg-[#bfc7d4]/10 rounded-full" />
                </div>
                {/* Exp Blocks */}
                <div className="space-y-1 pt-1">
                  <div className="w-11 h-0.5 bg-[#bfc7d4]/10 rounded-full" />
                  <div className="w-8 h-0.5 bg-[#bfc7d4]/10 rounded-full" />
                </div>
              </div>

              {/* Template Label tag on hover */}
              <div className="w-full text-center text-[7px] text-[#bfc7d4]/40 scale-95 uppercase tracking-widest leading-none pt-2 border-t border-white/[0.03]">
                {resume.template?.replace("-ats", "") || "Modern"}
              </div>

              {/* Preview Hover Glow */}
              <div className="absolute inset-0 bg-[#2294f4]/5 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
            </div>

            {/* Description & Action buttons */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h4
                  onClick={() => router.push(`/resumes/${resume.id}/edit`)}
                  className="font-['Geist'] text-sm font-bold text-white truncate cursor-pointer hover:text-[#a0caff] transition-colors"
                >
                  {resume.title}
                </h4>
                <p className="text-[10px] text-[#bfc7d4]/40 font-['Inter'] mt-1">
                  Template: <span className="text-[#bfc7d4]/80 font-semibold">{getTemplateLabel(resume.template)}</span>
                </p>
                <p className="text-[10px] text-[#bfc7d4]/40 font-['Inter'] mt-0.5">
                  Updated: <span className="text-[#bfc7d4]/80 font-semibold">{getRelativeTime(resume.updatedAt || resume.createdAt)}</span>
                </p>
              </div>

              {/* Actions Grid */}
              <div className="flex items-center gap-1 mt-4">
                {/* Edit */}
                <button
                  onClick={() => router.push(`/resumes/${resume.id}/edit`)}
                  title="Edit Resume"
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 text-[#bfc7d4] hover:text-white hover:bg-[#2294f4]/20 hover:border-[#2294f4]/35 transition-all flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                </button>

                {/* View */}
                <Link
                  href={`/resumes/${resume.id}`}
                  target="_blank"
                  title="View Resume Page"
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 text-[#bfc7d4] hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[15px]">visibility</span>
                </Link>

                {/* Duplicate */}
                <button
                  onClick={() => onDuplicate(resume)}
                  title="Duplicate Resume"
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 text-[#bfc7d4] hover:text-white hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDelete(resume.id)}
                  title="Delete Resume"
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 text-[#bfc7d4] hover:text-[#ef4444] hover:bg-[#ef4444]/10 hover:border-[#ef4444]/20 transition-all flex items-center justify-center cursor-pointer ml-auto"
                >
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
