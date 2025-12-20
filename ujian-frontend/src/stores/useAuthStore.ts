"use client";

import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  id: number;
  nip_nim?: string;
  nim?: string;
  nidn?: string;
  nama: string;
  email: string;
  role?: string;
  roles?: { id?: number; name: string }[];
  prodi?: {
    id: number;
    nama: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;
  initializeFromCookies: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isInitialized: false,

  setUser: (user) => {
    set({ user });
    if (user) Cookies.set("user", JSON.stringify(user), { expires: 7 });
    else Cookies.remove("user");
  },

  setToken: (token) => {
    set({ token });
    if (token) Cookies.set("token", token, { expires: 7 });
    else Cookies.remove("token");
  },

  clearUser: () => {
    set({ user: null, token: null });
    Cookies.remove("user");
    Cookies.remove("token");
  },

  initializeFromCookies: () => {
    try {
      const userCookie = Cookies.get("user");
      const tokenCookie = Cookies.get("token");

      if (userCookie) {
        const user = JSON.parse(userCookie);
        set({ user, token: tokenCookie || null, isInitialized: true });
      } else {
        set({ user: null, token: null, isInitialized: true });
      }
    } catch (err) {
      console.error("Failed to rehydrate auth:", err);
      set({ user: null, token: null, isInitialized: true });
    }
  },

  refreshUser: async () => {
     try {
        // Dynamically import to avoid server-client issues if any, 
        // but server actions can be imported in client files.
        const { refreshUserAction } = await import("@/actions/auth");
        const refreshedUser = await refreshUserAction();
        if (refreshedUser) {
           set({ user: refreshedUser });
           // Coordinate with cookie is handled in server action, but 
           // we update local state immediately.
           // Also update client cookie to match
           Cookies.set("user", JSON.stringify(refreshedUser), { expires: 7 });
        }
     } catch (err) {
        console.error("Failed to refresh user:", err);
     }
  }

}));
