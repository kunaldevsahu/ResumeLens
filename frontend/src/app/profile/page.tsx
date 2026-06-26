"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { useAuthStore } from "@/store/auth.store";
import {
  updateProfile as updateProfileService,
  updatePassword as updatePasswordService,
} from "@/services/auth.service";
import UpgradeModal from "@/components/ui/UpgradeModal";
import { getSubscription, type SubscriptionResponse } from "@/services/payment.service";

export default function ProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchUser();
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setLinkedin(data.linkedin || "");
        setGithub(data.github || "");
        setProfilePicture(data.profilePicture || "");
        
        try {
          const subData = await getSubscription();
          setSubscription(subData);
        } catch (subErr) {
          console.error("Failed to load subscription details:", subErr);
        }
      } catch (err) {
        console.error("Failed to load user profile in page:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [fetchUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveStatus("");
      setErrorStatus("");
      const updated = await updateProfileService({
        name,
        phone: phone || null,
        linkedin: linkedin || null,
        github: github || null,
        profilePicture: profilePicture || null,
      });
      setUser({
        ...user!,
        ...updated,
      });
      setSaveStatus("Profile updated successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      setErrorStatus(err instanceof Error ? err.message : "Failed to update profile");
      setTimeout(() => setErrorStatus(""), 4000);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setErrorStatus("Please enter both current and new password");
      setTimeout(() => setErrorStatus(""), 4000);
      return;
    }
    try {
      setSaveStatus("");
      setErrorStatus("");
      await updatePasswordService({
        currentPassword,
        newPassword,
      });
      setSaveStatus("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      setErrorStatus(err instanceof Error ? err.message : "Failed to change password");
      setTimeout(() => setErrorStatus(""), 4000);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const avatarUrl = user?.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuCKSv6WdBwxcbXqU6Rc6evCO6WcJgkFmGCBqfgBrbgPZ1r95-zV5R6O6XqFdIt5yUfLga4HXK0UPiVT7K-xJ47yT5f81gz8jusmiFGrTT5st6FKkd7FM1mgvS34p7xa45NrsioeSj0Ti0ehyI4bN2yOlffkrvFhTeGpnbRicaYeaypn4-mvy-cwslNK0fXf3d1jd2y1DM35rSmZ6zstz37Qv8phW8ZOtNIKjvmptgJ-sI8bu5wjKfM5RMmKOyW57KUgZpH1q05O18ox";

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

            {/* Notification Messages */}
            {saveStatus && (
              <div className="bg-[#10b981]/25 border border-[#10b981]/40 text-[#10b981] px-4 py-3 rounded-lg text-xs font-['Geist'] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{saveStatus}</span>
              </div>
            )}
            {errorStatus && (
              <div className="bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] px-4 py-3 rounded-lg text-xs font-['Inter'] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorStatus}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-[#bfc7d4]">
                <span className="animate-spin inline-block h-6 w-6 border-2 border-[#a0caff] border-t-transparent rounded-full mr-2"></span>
                <span>Loading profile details...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card & Membership (Left) */}
                <div className="lg:col-span-1 bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#a0caff] mb-4">
                    <img
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                      src={avatarUrl}
                    />
                  </div>
                  <h3 className="font-['Geist'] text-lg font-bold text-white mb-1">{user?.name || name}</h3>
                  <p className="font-['Inter'] text-xs text-[#bfc7d4] opacity-75 mb-6">{user?.email || email}</p>

                  <div className="w-full bg-[#191c1e] border border-[#ffffff0a] rounded-lg p-4 mb-6 text-left space-y-3">
                    <div className="flex justify-between items-center text-xs font-['Geist']">
                      <span className="text-[#bfc7d4]">Current Plan:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${user?.plan === "pro" ? "bg-[#2294f4]/25 text-[#a0caff] border border-[#2294f4]/35" : "bg-[#bfc7d4]/10 text-[#bfc7d4]"}`}>
                        {user?.plan === "pro" ? "Pro Plan" : "Basic Plan"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-['Geist'] border-t border-[#ffffff05] pt-3">
                      <span className="text-[#bfc7d4]">Status:</span>
                      <span className={`font-bold text-[10px] uppercase ${user?.plan === "pro" ? "text-[#10b981]" : "text-[#bfc7d4]"}`}>
                        {user?.plan === "pro" ? (subscription?.subscriptionStatus || "Active") : "Free Active"}
                      </span>
                    </div>

                    {user?.plan === "pro" && subscription?.endDate && (
                      <div className="flex justify-between items-center text-xs font-['Geist'] border-t border-[#ffffff05] pt-3">
                        <span className="text-[#bfc7d4]">Renewal Date:</span>
                        <span className="text-white font-bold">
                          {new Date(subscription.endDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs font-['Geist'] border-t border-[#ffffff05] pt-3">
                      <span className="text-[#bfc7d4]">Resumes Used:</span>
                      <span className="text-white font-bold font-['Geist']">
                        {user?.plan === "pro" ? `${user?.resumeCount ?? 0} (Unlimited)` : `${user?.resumeCount ?? 0} / 10`}
                      </span>
                    </div>

                    {user?.plan === "basic" && (
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full mt-4 bg-[#2294f4] hover:bg-[#a0caff] text-[#002b4e] font-['Geist'] text-xs font-bold py-2 rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        Upgrade to Pro
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] rounded-lg font-['Geist'] text-xs font-bold transition-all"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <label className="text-[10px] uppercase font-bold text-[#bfc7d4]/60">Email Address (Read-only)</label>
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="bg-[#111415] border border-[#ffffff0a] text-[#bfc7d4]/50 p-3 rounded-lg text-xs cursor-not-allowed focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#bfc7d4]/60">Phone Number</label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-[#111415] border border-[#ffffff14] text-[#e1e2e4] p-3 rounded-lg text-xs focus:outline-none focus:border-[#a0caff]"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#bfc7d4]/60">Profile Picture URL</label>
                          <input
                            type="text"
                            value={profilePicture}
                            onChange={(e) => setProfilePicture(e.target.value)}
                            className="bg-[#111415] border border-[#ffffff14] text-[#e1e2e4] p-3 rounded-lg text-xs focus:outline-none focus:border-[#a0caff]"
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#bfc7d4]/60">LinkedIn Profile URL</label>
                          <input
                            type="text"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            className="bg-[#111415] border border-[#ffffff14] text-[#e1e2e4] p-3 rounded-lg text-xs focus:outline-none focus:border-[#a0caff]"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#bfc7d4]/60">GitHub Profile URL</label>
                          <input
                            type="text"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                            className="bg-[#111415] border border-[#ffffff14] text-[#e1e2e4] p-3 rounded-lg text-xs focus:outline-none focus:border-[#a0caff]"
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-[#2294f4] text-[#002b4e] font-['Geist'] text-xs font-bold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Save Account Details
                      </button>
                    </form>
                  </div>

                  {/* Change password */}
                  <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6">
                    <h4 className="font-['Geist'] text-base font-bold text-white mb-4">Change Password</h4>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="bg-[#2294f4] text-[#002b4e] font-['Geist'] text-xs font-bold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </ProtectedRoute>
  );
}

