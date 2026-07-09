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

const features = [
  {
    name: "Resume Creation Limit",
    basic: "Up to 10 Resumes",
    pro: "Unlimited Resumes",
    highlight: true,
  },
  {
    name: "Standard & Premium Templates",
    basic: "Included",
    pro: "Included",
    highlight: false,
  },
  {
    name: "Live Sandbox Builder Workspace",
    basic: "Included",
    pro: "Included",
    highlight: false,
  },
  {
    name: "PDF Downloads & Exports",
    basic: "Included",
    pro: "Included",
    highlight: false,
  },
  {
    name: "ATS Score Analysis",
    basic: "Included",
    pro: "Included",
    highlight: false,
  },
  {
    name: "Future Resume Versioning",
    basic: "Coming Soon",
    pro: "Priority Access",
    highlight: false,
  },
  {
    name: "Future AI Suggestions & Enhancements",
    basic: "Coming Soon",
    pro: "Priority Access",
    highlight: false,
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const setUser = useAuthStore((state) => state.setUser);

  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);

  useEffect(() => {
    // Handle loading active tab from query param on mount
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["profile", "security", "billing"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabName);
      window.history.replaceState(null, "", url.toString());
    }
  };

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
        profilePicture: null,
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
    window.location.href = "/?logout=true";
  };

  // Using user initial-based logo instead of profile picture URL

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

            {/* Tab Navigation */}
            <div className="flex border-b border-[#ffffff14] gap-2 pb-px text-xs font-['Geist'] font-bold">
              <button
                onClick={() => handleTabChange("profile")}
                className={`py-2.5 px-4 transition-all border-b-2 cursor-pointer ${
                  activeTab === "profile"
                    ? "text-[#a0caff] border-[#2294f4]"
                    : "text-[#bfc7d4] border-transparent hover:text-white"
                }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => handleTabChange("security")}
                className={`py-2.5 px-4 transition-all border-b-2 cursor-pointer ${
                  activeTab === "security"
                    ? "text-[#a0caff] border-[#2294f4]"
                    : "text-[#bfc7d4] border-transparent hover:text-white"
                }`}
              >
                Security & Password
              </button>
              <button
                onClick={() => handleTabChange("billing")}
                className={`py-2.5 px-4 transition-all border-b-2 cursor-pointer ${
                  activeTab === "billing"
                    ? "text-[#a0caff] border-[#2294f4]"
                    : "text-[#bfc7d4] border-transparent hover:text-white"
                }`}
              >
                Plan & Billing
              </button>
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
                <div className="lg:col-span-1 bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 flex flex-col items-center text-center self-start">
                  <div className="w-24 h-24 rounded-full bg-[#a0caff]/15 text-[#a0caff] border-2 border-[#a0caff]/35 flex items-center justify-center font-bold text-3xl select-none mb-4">
                    {(user?.name || name || "A").charAt(0).toUpperCase()}
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

                {/* Form/Details Columns (Right) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* TAB 1: Profile Info */}
                  {activeTab === "profile" && (
                    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 animate-fade-in">
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
                          className="bg-[#2294f4] text-[#002b4e] font-['Geist'] text-xs font-bold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer mt-2"
                        >
                          Save Account Details
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB 2: Security & Password */}
                  {activeTab === "security" && (
                    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 animate-fade-in">
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
                          className="bg-[#2294f4] text-[#002b4e] font-['Geist'] text-xs font-bold px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer mt-2"
                        >
                          Change Password
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB 3: Plan & Billing Benefits table */}
                  {activeTab === "billing" && (
                    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl overflow-hidden animate-fade-in">
                      <div className="p-6 border-b border-[#ffffff14]">
                        <h4 className="font-['Geist'] text-base font-bold text-white">
                          Compare Plan Benefits
                        </h4>
                        <p className="text-[#bfc7d4]/60 text-xs font-['Inter'] mt-0.5">
                          Explore what is included in each plan tier.
                        </p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-['Inter'] border-collapse">
                          <thead>
                            <tr className="bg-[#191c1e] text-[10px] uppercase font-bold text-[#bfc7d4]/70 tracking-widest border-b border-[#ffffff14]">
                              <th className="py-4 px-6">Feature</th>
                              <th className="py-4 px-6 text-center">Basic Plan</th>
                              <th className="py-4 px-6 text-center">Pro Plan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#ffffff0a] text-xs text-[#e1e2e4]">
                            {features.map((feature, idx) => (
                              <tr
                                key={idx}
                                className={`hover:bg-[#111415]/20 transition-colors ${
                                  feature.highlight ? "bg-[#2294f4]/5" : ""
                                }`}
                              >
                                <td className="py-4 px-6 font-medium text-white">{feature.name}</td>
                                <td className="py-4 px-6 text-center text-[#bfc7d4]/80">
                                  {feature.basic === "Included" ? (
                                    <span className="material-symbols-outlined text-[#10b981] text-[18px] inline-block align-middle">
                                      check_circle
                                    </span>
                                  ) : (
                                    <span>{feature.basic}</span>
                                  )}
                                </td>
                                <td className="py-4 px-6 text-center font-bold text-[#a0caff]">
                                  {feature.pro === "Included" ? (
                                    <span className="material-symbols-outlined text-[#a0caff] text-[18px] inline-block align-middle">
                                      check_circle
                                    </span>
                                  ) : (
                                    <span>{feature.pro}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {user?.plan === "basic" && (
                        <div className="p-6 bg-[#191c1e] border-t border-[#ffffff14] flex justify-end">
                          <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="bg-[#2294f4] hover:bg-[#a0caff] text-[#002b4e] font-['Geist'] text-xs font-bold px-6 py-2.5 rounded-lg transition-all cursor-pointer"
                          >
                            Get Unlimited Resumes Now
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
