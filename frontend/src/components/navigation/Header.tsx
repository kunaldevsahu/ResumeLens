"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const name = user?.name || "Alex Rivera";
  const planBadge = user?.plan === "pro" ? "Pro Plan" : "Basic Plan";

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#111415]/80 backdrop-blur-md border-b border-[#ffffff14] flex items-center justify-between px-8 md:pl-8">
      {/* Search Input Container */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#bfc7d4] text-[20px] group-focus-within:text-[#a0caff] transition-colors">
            search
          </span>
          <input
            type="text"
            className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-full py-2 pl-10 pr-4 text-xs font-['Inter'] text-[#e1e2e4] placeholder-[#bfc7d4]/50 focus:outline-none focus:border-[#a0caff] focus:ring-1 focus:ring-[#a0caff] transition-all"
            placeholder="Search resumes, skills, or templates..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-[#bfc7d4] hover:text-[#e1e2e4] hover:bg-[#1d2022] transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* User Info / Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#ffffff14]">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[#e1e2e4] font-['Geist']">{name}</p>
            <p className={`text-[10px] font-bold font-['Geist'] px-1.5 py-0.5 rounded ${user?.plan === "pro" ? "bg-[#2294f4]/25 text-[#a0caff] border border-[#2294f4]/35" : "bg-[#bfc7d4]/10 text-[#bfc7d4]"}`}>{planBadge}</p>
          </div>
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-[#a0caff]/15 text-[#a0caff] border border-[#a0caff]/30 flex items-center justify-center font-bold text-xs select-none hover:border-[#a0caff] hover:bg-[#a0caff]/25 transition-all"
            title="Profile & Settings"
          >
            {name.charAt(0).toUpperCase()}
          </Link>
        </div>
      </div>
    </header>
  );
}

