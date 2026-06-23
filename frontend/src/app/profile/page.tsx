"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { useAuthStore } from "@/store/auth.store";

export default function ProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Profile updated successfully!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert("Please enter both current and new password");
      return;
    }
    setSaveStatus("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
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
                Profile & Settings
              </h2>
              <p className="text-[#bfc7d4] text-sm font-['Inter']">
                Manage your personal info, security preferences, and subscription details.
              </p>
            </div>

            {/* Save Status Notification */}
            {saveStatus && (
              <div className="bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] px-4 py-3 rounded-lg text-xs font-[#Geist] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{saveStatus}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card & Membership (Left) */}
              <div className="lg:col-span-1 bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#a0caff] mb-4">
                  <img
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKSv6WdBwxcbXqU6Rc6evCO6WcJgkFmGCBqfgBrbgPZ1r95-zV5R6O6XqFdIt5yUfLga4HXK0UPiVT7K-xJ47yT5f81gz8jusmiFGrTT5st6FKkd7FM1mgvS34p7xa45NrsioeSj0Ti0ehyI4bN2yOlffkrvFhTeGpnbRicaYeaypn4-mvy-cwslNK0fXf3d1jd2y1DM35rSmZ6zstz37Qv8phW8ZOtNIKjvmptgJ-sI8bu5wjKfM5RMmKOyW57KUgZpH1q05O18ox"
                  />
                </div>
                <h3 className="font-['Geist'] text-lg font-bold text-white mb-1">{name}</h3>
                <p className="font-['Inter'] text-xs text-[#bfc7d4] opacity-75 mb-6">{email}</p>

                <div className="w-full bg-[#191c1e] border border-[#ffffff0a] rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center text-xs font-['Geist'] mb-1">
                    <span className="text-[#bfc7d4]">Current Plan:</span>
                    <span className="text-[#a0caff] font-bold">Pro Membership</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-['Geist']">
                    <span className="text-[#bfc7d4]">Renews on:</span>
                    <span className="text-white">Oct 24, 2026</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] rounded-lg font-[#Geist] text-xs font-bold transition-all"
                >
                  Log Out
                </button>
              </div>

              {/* Form Updates (Right) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Edit details */}
                <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6">
                  <h4 className="font-['Geist'] text-base font-bold text-white mb-4">Account Information</h4>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#bfc7d4]/60">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-[#111415] border border-[#ffffff14] text-[#e1e2e4] p-3 rounded-lg text-xs focus:outline-none focus:border-[#a0caff]"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#bfc7d4]/60">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-[#111415] border border-[#ffffff14] text-[#e1e2e4] p-3 rounded-lg text-xs focus:outline-none focus:border-[#a0caff]"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-[#2294f4] text-[#002b4e] font-[#Geist] text-xs font-bold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      Save Account Details
                    </button>
                  </form>
                </div>

                {/* Change password */}
                <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6">
                  <h4 className="font-['Geist'] text-base font-bold text-white mb-4">Change Password</h4>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#bfc7d4]/60">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="bg-[#111415] border border-[#ffffff14] text-[#e1e2e4] p-3 rounded-lg text-xs focus:outline-none focus:border-[#a0caff]"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#bfc7d4]/60">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-[#111415] border border-[#ffffff14] text-[#e1e2e4] p-3 rounded-lg text-xs focus:outline-none focus:border-[#a0caff]"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-[#2294f4] text-[#002b4e] font-[#Geist] text-xs font-bold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
