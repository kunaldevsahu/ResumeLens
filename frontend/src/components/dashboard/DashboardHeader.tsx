"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  onUpgradeClick: () => void;
}

export default function DashboardHeader({ onUpgradeClick }: DashboardHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // Determine greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#111415]/80 backdrop-blur-md border-b border-[#ffffff14] flex items-center justify-between px-8">
      {/* Greetings */}
      <div className="flex flex-col justify-center">
        <h2 className="font-['Geist'] text-sm sm:text-base font-bold text-white tracking-tight leading-none mb-1">
          {getGreeting()}, {user?.name || "Member"}
        </h2>
        <p className="font-['Inter'] text-[10px] text-[#bfc7d4]/60 leading-none">
          Continue building resumes and prepare for your next opportunity.
        </p>
      </div>

      {/* User Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon Button */}
        <button
          onClick={() => alert("No new notifications")}
          className="w-8 h-8 rounded-full border border-[#ffffff0f] bg-[#191c1e] text-[#bfc7d4] hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center cursor-pointer relative group"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2294f4] border border-[#191c1e]" />
        </button>

        {/* Settings Icon Button */}
        <button
          onClick={() => router.push("/profile")}
          className="w-8 h-8 rounded-full border border-[#ffffff0f] bg-[#191c1e] text-[#bfc7d4] hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center cursor-pointer group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:rotate-45 transition-transform duration-300">
            settings
          </span>
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3 pl-4 border-l border-[#ffffff14] cursor-pointer group shrink-0"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-[#e1e2e4] font-['Geist']">{user?.name || "Member"}</p>
            <p className="text-[9px] font-bold font-['Geist'] text-[#bfc7d4]/60 leading-none mt-0.5">
              {user?.plan === "pro" ? "Pro Plan" : "Basic Plan"}
            </p>
          </div>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-[#ffffff14] group-hover:border-white/20 transition-all"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#a0caff]/15 text-[#a0caff] border border-[#a0caff]/30 flex items-center justify-center text-xs font-bold font-['Geist'] group-hover:border-[#a0caff] group-hover:bg-[#a0caff]/25 transition-all select-none">
              {getInitials(user?.name)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
