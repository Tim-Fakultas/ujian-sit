"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/Auth";

// Re-export User agar komponen lain bisa import dari sini jika perlu
export type { User };

interface AuthState {
  user: User | null;
  _hasHydrated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  refreshUser: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      setUser: (user) => {
        set({ user });
      },

      clearUser: () => {
        set({ user: null });
      },

      refreshUser: async () => {
        try {
          const { refreshUserAction } = await import("@/actions/auth");
          const refreshedUser = await refreshUserAction();
          if (refreshedUser) {
            set({ user: refreshedUser as User });
          }
        } catch (err) {
          console.error("Failed to refresh user:", err);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Hanya simpan 'user' ke localStorage
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        // Tandai bahwa rehydrate dari localStorage sudah selesai
        state?.setHasHydrated(true);
      },
    },
  ),
);
