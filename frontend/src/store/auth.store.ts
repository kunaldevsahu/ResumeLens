import { create } from "zustand";
import api from "@/lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  linkedin?: string | null;
  github?: string | null;
  profilePicture?: string | null;
  plan: string; // "basic" | "pro"
  subscriptionStatus: string;
  resumeCount: number;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: UserProfile | null;

  login: (token: string, user?: UserProfile) => void;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
  fetchUser: () => Promise<UserProfile>;
}

export const useAuthStore = create<AuthState>(
  (set) => ({
    token:
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null,

    isAuthenticated:
      typeof window !== "undefined"
        ? !!localStorage.getItem("token")
        : false,

    user: null,

    login: (token, user) => {
      localStorage.setItem("token", token);

      set({
        token,
        isAuthenticated: true,
        user: user || null,
      });
    },

    logout: () => {
      localStorage.removeItem("token");

      set({
        token: null,
        isAuthenticated: false,
        user: null,
      });
    },

    setUser: (user) => {
      set({ user });
    },

    fetchUser: async () => {
      const response = await api.get("/auth/profile");
      const userProfile = response.data;
      set({ user: userProfile });
      return userProfile;
    },
  })
);