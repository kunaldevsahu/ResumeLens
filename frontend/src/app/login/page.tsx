"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser({
        email,
        password,
      });

      const token = response.token;
      login(token);

      router.push("/dashboard");
    } catch (currentError: unknown) {
      if (
        typeof currentError === "object" &&
        currentError !== null &&
        "response" in currentError
      ) {
        const response = currentError as {
          response?: { data?: { message?: string } };
        };

        setError(
          response.response?.data?.message || "Login failed. Please check your credentials."
        );
        return;
      }

      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111415] text-[#e1e2e4] px-4">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#2294f4]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#1d2022]/80 border border-[#ffffff14] p-8 rounded-xl shadow-2xl backdrop-blur-xl relative z-10">
        <div className="mb-8 text-center">
          <h1 className="font-['Geist'] text-3xl font-extrabold tracking-tight text-[#a0caff]">
            ResumeLens
          </h1>
          <p className="mt-2 text-sm text-[#bfc7d4] font-['Inter']">
            Sign in to access your career dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] px-4 py-3 rounded-lg text-sm font-['Inter'] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-['Geist'] text-xs font-bold text-[#bfc7d4] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#111415] border border-[#ffffff14] text-[#e1e2e4] p-3 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-[#2294f4] focus:ring-1 focus:ring-[#2294f4] transition-all"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Geist'] text-xs font-bold text-[#bfc7d4] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#111415] border border-[#ffffff14] text-[#e1e2e4] p-3 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-[#2294f4] focus:ring-1 focus:ring-[#2294f4] transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2294f4] hover:opacity-90 active:scale-[0.98] text-[#002b4e] font-['Geist'] font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-[#002b4e] border-t-transparent rounded-full"></span>
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-[#ffffff14] pt-5">
          <p className="text-xs text-[#bfc7d4] font-['Inter']">
            New to ResumeLens?{" "}
            <Link href="/register" className="text-[#a0caff] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
