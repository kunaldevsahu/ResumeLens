"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

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
            <p className="text-sm font-medium text-[#e1e2e4] font-['Geist']">Alex Rivera</p>
            <p className="text-xs text-[#bfc7d4] opacity-65 font-['Geist']">Pro Plan</p>
          </div>
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-[#323537] overflow-hidden border border-[#ffffff14] block hover:border-[#a0caff] transition-all"
          >
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKSv6WdBwxcbXqU6Rc6evCO6WcJgkFmGCBqfgBrbgPZ1r95-zV5R6O6XqFdIt5yUfLga4HXK0UPiVT7K-xJ47yT5f81gz8jusmiFGrTT5st6FKkd7FM1mgvS34p7xa45NrsioeSj0Ti0ehyI4bN2yOlffkrvFhTeGpnbRicaYeaypn4-mvy-cwslNK0fXf3d1jd2y1DM35rSmZ6zstz37Qv8phW8ZOtNIKjvmptgJ-sI8bu5wjKfM5RMmKOyW57KUgZpH1q05O18ox"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
