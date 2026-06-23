"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardNav() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            ResumeLens Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Start here to manage resumes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Sign Out
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/resumes"
          className="rounded-xl border border-slate-200 px-4 py-4 font-medium text-slate-800 transition hover:border-blue-300 hover:bg-blue-50"
        >
          View Resume List
        </Link>

        <Link
          href="/resumes/new"
          className="rounded-xl border border-slate-200 px-4 py-4 font-medium text-slate-800 transition hover:border-blue-300 hover:bg-blue-50"
        >
          Create Resume
        </Link>
      </div>
    </div>
  );
}