import type { FilterState } from "./types";

export const MIN_ANGKATAN_YEAR = 2015;
export const MAX_ANGKATAN_YEAR = new Date().getFullYear() + 1;

export const STATUS_OPTIONS = [
  { value: "menunggu", label: "Menunggu", color: "bg-amber-500" },
  { value: "diverifikasi", label: "Diverifikasi", color: "bg-primary" },
  { value: "diterima", label: "Diterima", color: "bg-success" },
  { value: "ditolak", label: "Ditolak", color: "bg-destructive" },
] as const;

export const STATUS_BADGE_CLASS: Record<string, string> = {
  menunggu: "bg-yellow-100 text-yellow-800",
  diterima: "bg-green-100 text-green-800",
  ditolak: "bg-red-100 text-red-800",
};

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "diverifikasi",
  angkatan: "all",
  dateRange: undefined,
};
