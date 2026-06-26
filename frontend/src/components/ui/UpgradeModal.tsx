"use client";

import { useState } from "react";
import { createOrder, verifyPayment } from "@/services/payment.service";
import { useAuthStore } from "@/store/auth.store";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const user = useAuthStore((state) => state.user);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay payment gateway script. Please check your internet connection.");
      }

      // 2. Create Razorpay order on backend
      const order = await createOrder();

      // 3. Setup checkout options
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
            
            // 4. Verify payment signature on backend
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            // 5. Update user plan in frontend state and show success dialog
            await fetchUser();
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              onClose();
            }, 3000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Background radial glow */}
      <div className="absolute w-[400px] h-[400px] bg-[#2294f4]/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative w-full max-w-xl bg-[#1d2022] border border-[#ffffff14] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#2294f4] via-[#a0caff] to-[#2294f4]"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#bfc7d4] hover:text-white hover:bg-[#ffffff0d] p-1.5 rounded-lg transition-colors"
          disabled={loading}
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Content */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-[#a0caff] bg-[#a0caff]/10 p-2.5 rounded-xl text-[24px]">
              workspace_premium
            </span>
            <div>
              <h2 className="font-['Geist'] text-2xl font-bold text-white tracking-tight">
                Upgrade to Pro
              </h2>
              <p className="text-[#bfc7d4] text-xs font-['Inter'] mt-0.5">
                Unlock the full power of ResumeLens.
              </p>
            </div>
          </div>

          {/* Success Notification */}
          {success && (
            <div className="mt-4 bg-[#10b981]/25 border border-[#10b981]/40 text-[#10b981] p-4 rounded-xl text-xs font-['Geist'] font-bold flex items-center gap-2.5 animate-pulse">
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
            <div className="mt-4 bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] p-3 rounded-lg text-xs font-['Inter'] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Plans Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Basic Plan Card */}
            <div className="bg-[#111415] border border-[#ffffff0a] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-[#Geist] text-xs font-bold text-[#bfc7d4]/60 uppercase tracking-widest">
                    Basic Plan
                  </span>
                  <span className="text-[10px] bg-[#bfc7d4]/10 text-[#bfc7d4] px-2 py-0.5 rounded font-bold uppercase">
                    Free
                  </span>
                </div>
                <h4 className="text-xl font-bold text-[#bfc7d4] font-['Geist'] mb-1">
                  10 Resumes
                </h4>
                <p className="text-[#bfc7d4]/50 text-[10px] font-['Inter'] leading-relaxed mb-4">
                  Essential resume builder limits for single jobs.
                </p>
                <div className="space-y-2 border-t border-[#ffffff05] pt-4">
                  <div className="flex items-center gap-2 text-xs text-[#bfc7d4]">
                    <span className="material-symbols-outlined text-[#10b981] text-[16px]">check</span>
                    <span>All Resume Templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#bfc7d4]">
                    <span className="material-symbols-outlined text-[#10b981] text-[16px]">check</span>
                    <span>Live Builder Preview</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#bfc7d4]">
                    <span className="material-symbols-outlined text-[#10b981] text-[16px]">check</span>
                    <span>PDF Export</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#bfc7d4]">
                    <span className="material-symbols-outlined text-[#10b981] text-[16px]">check</span>
                    <span>ATS Analysis</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-[10px] text-[#bfc7d4]/40 font-['Inter'] italic text-center">
                Current limit: 10 resumes max
              </div>
            </div>

            {/* Pro Plan Card */}
            <div className="bg-[#0b1c33]/40 border border-[#2294f4]/35 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
              {/* Glow Accent */}
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#2294f4]/10 blur-xl rounded-full"></div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-[#Geist] text-xs font-bold text-[#a0caff] uppercase tracking-widest">
                    Pro Plan
                  </span>
                  <span className="text-[10px] bg-[#2294f4]/25 text-[#a0caff] px-2 py-0.5 rounded font-bold uppercase border border-[#2294f4]/30">
                    Unlimited
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white font-['Geist'] mb-1">
                  Unlimited Resumes
                </h4>
                <p className="text-[#a0caff]/70 text-[10px] font-['Inter'] leading-relaxed mb-4">
                  For active job seekers applying to multiple roles.
                </p>
                <div className="space-y-2 border-t border-[#ffffff0a] pt-4">
                  <div className="flex items-center gap-2 text-xs text-[#e1e2e4]">
                    <span className="material-symbols-outlined text-[#a0caff] text-[16px]">check</span>
                    <span className="font-semibold text-white">Unlimited Resumes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#e1e2e4]">
                    <span className="material-symbols-outlined text-[#a0caff] text-[16px]">check</span>
                    <span>All Premium Templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#e1e2e4]">
                    <span className="material-symbols-outlined text-[#a0caff] text-[16px]">check</span>
                    <span>Future ATS Analysis Suggests</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#e1e2e4]">
                    <span className="material-symbols-outlined text-[#a0caff] text-[16px]">check</span>
                    <span>Future Resume Versioning</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleUpgrade}
                  disabled={loading || success || user?.plan === "pro"}
                  className="w-full bg-[#2294f4] hover:bg-[#a0caff] text-[#002b4e] font-['Geist'] text-xs font-bold py-2.5 rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-[#002b4e] border-t-transparent rounded-full"></span>
                  ) : user?.plan === "pro" ? (
                    <span>Pro Plan Active</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      <span>Upgrade Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="bg-[#191c1e] px-8 py-4 border-t border-[#ffffff0a] flex items-center justify-between text-[11px] text-[#bfc7d4]/60 font-['Inter']">
          <span>Payments processed securely by Razorpay.</span>
          <button
            onClick={onClose}
            className="text-white hover:underline hover:text-[#a0caff]"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
