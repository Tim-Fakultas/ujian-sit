import { create } from "zustand";
import Cookies from "js-cookie";

interface Role {
  id?: number;
  name: string;
  guard_name?: string;
}

interface User {
  id: number;
  nip_nim?: string;
  nim?: string;
  nidn?: string;
  nama: string;
  email: string;
  roles: Role[];
  prodi?: {
    id: number;
    nama: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;
  initializeFromCookies: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

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
        set({ user, token: tokenCookie || null });
      }
    } catch (error) {
      console.error("Failed to rehydrate auth:", error);
    }
  },
}));
