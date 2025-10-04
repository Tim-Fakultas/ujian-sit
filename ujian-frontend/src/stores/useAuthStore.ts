import { create } from "zustand";
import Cookies from "js-cookie";

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot?: any;
  permissions?: any[];
}

interface User {
  id: number;
  nip_nim: string;
  nama: string;
  email: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  roles: Role[];
  permissions?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  
  setUser: (user) => {
    set({ user });
    if (user) {
      // Store user data in cookie for middleware access (same name as loginAction)
      Cookies.set('user', JSON.stringify(user), { expires: 7 });
    } else {
      Cookies.remove('user');
    }
  },
  
  setToken: (token) => {
    set({ token });
    if (token) {
      Cookies.set('token', token, { expires: 7 });
    } else {
      Cookies.remove('token');
    }
  },
  
  clearUser: () => {
    set({ user: null, token: null });
    Cookies.remove('user');
    Cookies.remove('token');
  },
  
  isAuthenticated: () => {
    const { user, token } = get();
    return !!(user && token);
  },
  
  hasRole: (role: string) => {
    const { user } = get();
    if (!user || !user.roles) return false;
    return user.roles.some(r => r.name === role);
  },
}));
