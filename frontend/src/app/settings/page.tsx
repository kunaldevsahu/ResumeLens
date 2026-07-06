"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile?tab=billing");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#111415] text-[#e1e2e4] flex items-center justify-center">
      <div className="text-center font-['Geist']">
        <span className="animate-spin inline-block h-8 w-8 border-4 border-[#a0caff] border-t-transparent rounded-full mb-4"></span>
        <p className="text-[#bfc7d4] text-xs">Redirecting to account settings...</p>
      </div>
    </div>
  );
}
