"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import UpgradeModal from "@/components/ui/UpgradeModal";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetchUser().catch((err) => console.error("Failed to load user profile in sidebar:", err));
  }, [fetchUser]);

  const handleLogout = () => {
    window.location.href = "/?logout=true";
  };

  const handleBuildNew = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user && user.plan === "basic" && user.resumeCount >= 10) {
      setShowUpgradeModal(true);
    } else {
      router.push("/resumes/new");
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "My Resumes", href: "/resumes", icon: "description" },
    { name: "ATS Analyzer", href: "/ats-analysis", icon: "analytics" },
    { name: "Templates", href: "/templates", icon: "style" },
    { name: "Pricing", href: "/pricing", icon: "payments" },
    { name: "Profile & Settings", href: "/profile", icon: "person" },
  ];

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-[#ffffff14] bg-[#111415] py-6 px-4 md:flex z-50">
        {/* Brand Logo */}
        <div className="mb-8 px-2">
          <Link href="/dashboard" className="block">
            <h1 className="font-['Geist'] text-2xl font-bold tracking-tight text-[#a0caff]">
              ResumeLens
            </h1>
            <p className="font-['Geist'] text-[10px] font-bold tracking-widest text-[#bfc7d4] opacity-60 uppercase mt-1">
              Career Engine
            </p>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-[#a0caff] font-bold border-r-2 border-[#a0caff] bg-[#1d2022]"
                    : "text-[#bfc7d4] hover:bg-[#191c1e] hover:text-[#e1e2e4] active:scale-[0.98]"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive ? "fill-icon" : ""}`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="font-['Geist'] text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout Button */}
        <div className="mt-auto px-2 space-y-3">
          <button
            onClick={handleBuildNew}
            className="w-full bg-[#2294f4] text-[#002b4e] hover:opacity-90 active:scale-[0.98] py-3 px-4 rounded-lg font-['Geist'] text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Build New Resume
          </button>

          <button
            onClick={handleLogout}
            className="w-full border border-[#ffffff14] hover:bg-[#191c1e] hover:text-white active:scale-[0.98] py-2 px-4 rounded-lg font-['Geist'] text-xs font-medium text-[#bfc7d4] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
}

