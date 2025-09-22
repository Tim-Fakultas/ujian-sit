import { Mahasiswa } from "@/types/Mahasiswa";
import { create } from "zustand";

interface MahasiswaState {
  mahasiswa: Mahasiswa | null;
  setMahasiswa: (data: Mahasiswa) => void;
  clearMahasiswa: () => void;
}

export const useMahasiswaStore = create<MahasiswaState>((set) => ({
  mahasiswa: null,
  setMahasiswa: (data) => set({ mahasiswa: data }),
  clearMahasiswa: () => set({ mahasiswa: null }),
}));
