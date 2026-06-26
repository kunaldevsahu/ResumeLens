"use client";

import { AtsHistoryItem } from "@/services/ats.service";

interface HistoryTableProps {
  history: AtsHistoryItem[];
  onSelectReport: (id: string) => void;
}

export default function HistoryTable({
  history,
  onSelectReport,
}: HistoryTableProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20";
    if (score >= 70) return "text-[#2294f4] bg-[#2294f4]/10 border-[#2294f4]/20";
    return "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20";
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="font-['Geist'] text-lg font-bold text-white mb-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#a0caff]">history</span>
          Analysis History
        </h3>
        <p className="text-xs text-[#bfc7d4] opacity-75">
          Revisit and reopen your past ATS compatibility reports at any time.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#ffffff0a] text-[#bfc7d4]/60 font-['Geist'] uppercase tracking-wider text-[10px] font-bold">
              <th className="py-3 px-4 font-semibold">Resume</th>
              <th className="py-3 px-4 font-semibold">Job Role</th>
              <th className="py-3 px-4 font-semibold">Analyzed Date</th>
              <th className="py-3 px-4 font-semibold text-center">Score</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ffffff05] font-['Inter']">
            {history.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#191c1e] transition-colors duration-150 group"
              >
                <td className="py-3.5 px-4 font-semibold text-white">
                  {item.resumeTitle}
                </td>
                <td className="py-3.5 px-4 text-[#bfc7d4]">
                  {item.jobTitle || "N/A"}
                </td>
                <td className="py-3.5 px-4 text-[#bfc7d4]/60">
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded font-extrabold font-['Geist'] border ${getScoreColor(item.overallScore)}`}>
                    {item.overallScore}%
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onSelectReport(item.id)}
                    className="text-[#a0caff] font-['Geist'] text-xs font-bold hover:underline cursor-pointer transition-all"
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
