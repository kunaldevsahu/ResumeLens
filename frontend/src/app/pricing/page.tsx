"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { useAuthStore } from "@/store/auth.store";
import { createOrder, verifyPayment } from "@/services/payment.service";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PricingPage() {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser().catch((err) => console.error("Failed to load user info on pricing page:", err));
  }, [fetchUser]);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay payment gateway script. Please check your internet connection.");
      }

      // 2. Create Razorpay order on backend
      const order = await createOrder();

      // 3. Configure Razorpay checkout options
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "ResumeLens",
        description: "Upgrade to Pro Plan (Unlimited Resumes)",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKSv6WdBwxcbXqU6Rc6evCO6WcJgkFmGCBqfgBrbgPZ1r95-zV5R6O6XqFdIt5yUfLga4HXK0UPiVT7K-xJ47yT5f81gz8jusmiFGrTT5st6FKkd7FM1mgvS34p7xa45NrsioeSj0Ti0ehyI4bN2yOlffkrvFhTeGpnbRicaYeaypn4-mvy-cwslNK0fXf3d1jd2y1DM35rSmZ6zstz37Qv8phW8ZOtNIKjvmptgJ-sI8bu5wjKfM5RMmKOyW57KUgZpH1q05O18ox",
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            setLoading(true);

            // 4. Verify payment on backend
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            // 5. Update state and show success alert
            await fetchUser();
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 5000);
          } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#2294f4",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description || "Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Payment setup failed");
      setLoading(false);
    }
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
                Pricing Plans
              </h2>
              <p className="text-[#bfc7d4] text-sm font-['Inter']">
                Choose the best plan to boost your job applications. Upgrade instantly via Razorpay.
              </p>
            </div>

            {/* Success Notification */}
            {success && (
              <div className="bg-[#10b981]/25 border border-[#10b981]/40 text-[#10b981] p-4 rounded-xl text-xs font-['Geist'] font-bold flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <div>
                  <p>Pro Plan Active!</p>
                  <p className="font-normal opacity-90 mt-0.5 text-[10px]">
                    Thank you for upgrading. Your account is now upgraded to Pro, and you can create unlimited resumes.
                  </p>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] p-3 rounded-lg text-xs font-['Inter'] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto pt-4">
              {/* Basic Plan Card */}
              <div className="bg-[#1d2022] border border-[#ffffff14] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between hover:border-[#ffffff20] transition-all">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-[#Geist] text-xs font-bold text-[#bfc7d4]/60 uppercase tracking-widest">
                      Basic Plan
                    </span>
                    {user?.plan === "basic" && (
                      <span className="text-[10px] bg-[#bfc7d4]/10 text-[#bfc7d4] border border-[#bfc7d4]/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <div className="mb-6">
                    <h3 className="text-4xl font-extrabold text-white font-['Geist'] mb-1">
                      Free
                    </h3>
                    <p className="text-[#bfc7d4]/50 text-xs font-['Inter'] leading-relaxed">
                      Essential resume builder limits for single jobs.
                    </p>
                  </div>
                  <div className="space-y-3.5 border-t border-[#ffffff08] pt-6">
                    <div className="flex items-center gap-3 text-sm text-[#bfc7d4]">
                      <span className="material-symbols-outlined text-[#10b981] text-[18px]">check</span>
                      <span>Maximum 10 Resumes</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#bfc7d4]">
                      <span className="material-symbols-outlined text-[#10b981] text-[18px]">check</span>
                      <span>All Resume Templates</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#bfc7d4]">
                      <span className="material-symbols-outlined text-[#10b981] text-[18px]">check</span>
                      <span>Live Builder Preview</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#bfc7d4]">
                      <span className="material-symbols-outlined text-[#10b981] text-[18px]">check</span>
                      <span>PDF Export</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    disabled
                    className="w-full bg-[#191c1e] text-[#bfc7d4]/50 border border-[#ffffff0a] font-['Geist'] text-sm font-bold py-3 rounded-lg cursor-not-allowed text-center"
                  >
                    {user?.plan === "basic" ? "Current Plan" : "Free"}
                  </button>
                </div>
              </div>

              {/* Pro Plan Card */}
              <div className="bg-[#0b1c33]/40 border-2 border-[#2294f4] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-[0_0_30px_rgba(34,148,244,0.1)] hover:scale-[1.01] transition-all">
                {/* Glow Accent */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#2294f4]/15 blur-2xl rounded-full"></div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-[#Geist] text-xs font-bold text-[#a0caff] uppercase tracking-widest">
                      Pro Plan
                    </span>
                    {user?.plan === "pro" && (
                      <span className="text-[10px] bg-[#2294f4]/20 text-[#a0caff] border border-[#2294f4]/40 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-4xl font-extrabold text-white font-['Geist'] mb-1">
                        ₹499
                      </h3>
                      <span className="text-[#a0caff] text-sm font-medium">/ month</span>
                    </div>
                    <p className="text-[#a0caff]/70 text-xs font-['Inter'] leading-relaxed">
                      For active job seekers applying to multiple roles.
                    </p>
                  </div>
                  <div className="space-y-3.5 border-t border-[#ffffff14] pt-6">
                    <div className="flex items-center gap-3 text-sm text-[#e1e2e4]">
                      <span className="material-symbols-outlined text-[#a0caff] text-[18px]">check</span>
                      <span className="font-semibold text-white">Unlimited Resumes</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#e1e2e4]">
                      <span className="material-symbols-outlined text-[#a0caff] text-[18px]">check</span>
                      <span>All Premium Templates</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#e1e2e4]">
                      <span className="material-symbols-outlined text-[#a0caff] text-[18px]">check</span>
                      <span>Priority PDF Generation</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#e1e2e4]">
                      <span className="material-symbols-outlined text-[#a0caff] text-[18px]">check</span>
                      <span>ATS Keyword Optimizations</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleUpgrade}
                    disabled={loading || success || user?.plan === "pro"}
                    className="w-full bg-[#2294f4] hover:bg-[#a0caff] text-[#002b4e] font-['Geist'] text-sm font-bold py-3 rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="animate-spin h-4 w-4 border-2 border-[#002b4e] border-t-transparent rounded-full"></span>
                    ) : user?.plan === "pro" ? (
                      <span>Pro Plan Active</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                        <span>Upgrade to Pro</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
