"use client";

import type { Resume } from "@/services/resume.service";
import type { AtsHistoryItem } from "@/services/ats.service";
import Link from "next/link";

interface ActivityTimelineProps {
  resumes: Resume[];
  atsHistory: AtsHistoryItem[];
}

interface TimelineEvent {
  id: string;
  icon: string;
  iconColor: string;
  label: string;
  details: string;
  targetLink: string;
  timestamp: Date;
}

export default function ActivityTimeline({
  resumes,
  atsHistory,
}: ActivityTimelineProps) {
  
  // Construct events dynamically
  const events: TimelineEvent[] = [];

  resumes.forEach((r) => {
    if (r.createdAt) {
      events.push({
        id: `create-${r.id}`,
        icon: "post_add",
        iconColor: "text-[#a0caff] bg-[#2294f4]/10 border-[#2294f4]/20",
        label: "Created Resume",
        details: `"${r.title}"`,
        targetLink: `/resumes/${r.id}/edit`,
        timestamp: new Date(r.createdAt),
      });
    }
    // Only add updated event if it is substantially later than creation
    if (r.updatedAt && r.createdAt && new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime() > 60000) {
      events.push({
        id: `update-${r.id}-${r.updatedAt}`,
        icon: "edit",
        iconColor: "text-[#ffb781] bg-[#dc7506]/10 border-[#dc7506]/20",
        label: "Edited Resume",
        details: `"${r.title}"`,
        targetLink: `/resumes/${r.id}/edit`,
        timestamp: new Date(r.updatedAt),
      });
    }
  });

  atsHistory.forEach((h) => {
    if (h.createdAt) {
      events.push({
        id: `ats-${h.id}`,
        icon: "analytics",
        iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        label: "Analyzed Resume",
        details: `"${h.resumeTitle}" against "${h.jobTitle || "Target Role"}"`,
        targetLink: "/ats-analysis",
        timestamp: new Date(h.createdAt),
      });
    }
  });

  // Sort by date descending and slice
  const sortedEvents = events
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 4);

  const getRelativeTimeLabel = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-[#191c1e] border border-[#ffffff14] rounded-2xl p-5 space-y-4 font-['Inter']">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400 text-[18px]">history</span>
            Recent Activity
          </h4>
          <p className="text-[10px] text-[#bfc7d4]/60 mt-1">
            Realtime history of edits and analyses.
          </p>
        </div>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-6 text-xs text-[#bfc7d4]/40">
          No recent activity to show.
        </div>
      ) : (
        <div className="relative pl-4 border-l border-white/5 space-y-5">
          {sortedEvents.map((evt) => (
            <div key={evt.id} className="relative space-y-1">
              {/* Event Bullet Node */}
              <div className="absolute -left-[27px] top-1 flex items-center justify-center">
                <div className={`w-[24px] h-[24px] rounded-lg border flex items-center justify-center shrink-0 ${evt.iconColor}`}>
                  <span className="material-symbols-outlined text-[13px]">{evt.icon}</span>
                </div>
              </div>

              {/* Event Content */}
              <div className="pl-2">
                <div className="flex justify-between items-baseline gap-2">
                  <Link
                    href={evt.targetLink}
                    className="text-xs text-[#bfc7d4] hover:text-white transition-colors"
                  >
                    <span className="font-bold text-white/90">{evt.label}</span>{" "}
                    <span className="text-[#bfc7d4]/60 text-[11px] truncate inline-block max-w-[160px] vertical-middle">{evt.details}</span>
                  </Link>
                  <span className="text-[9px] text-[#bfc7d4]/30 shrink-0 font-['Geist'] font-bold uppercase">
                    {getRelativeTimeLabel(evt.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
