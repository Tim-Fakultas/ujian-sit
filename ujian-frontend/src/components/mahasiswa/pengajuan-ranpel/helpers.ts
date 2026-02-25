import { RancanganPenelitian } from "@/types/RancanganPenelitian";

/**
 * Formats a date string/value into Indonesian short date format.
 * Returns null if the value is falsy or an invalid date.
 */
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

/**
 * Returns the Tailwind CSS classes for a given submission status badge.
 */
export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "diterima":
      return "bg-green-50 text-green-700 border-green-200";
    case "ditolak":
      return "bg-red-50 text-red-700 border-red-200";
    case "diverifikasi":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "menunggu":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "bg-primary/5 text-primary border-primary/20";
  }
}

/**
 * Returns a fresh, empty RancanganPenelitian form state.
 * Using a factory function ensures each call gets a new object reference.
 */
export function createEmptyForm(): RancanganPenelitian {
  return {
    judulPenelitian: "",
    masalahDanPenyebab: "",
    alternatifSolusi: "",
    metodePenelitian: "",
    hasilYangDiharapkan: "",
    kebutuhanData: "",
    jurnalReferensi: "",
  };
}

/** Status filter options for the table's DataTableFilter. */
export const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "menunggu", label: "Menunggu" },
  { value: "diverifikasi", label: "Diverifikasi" },
  { value: "diterima", label: "Diterima" },
  { value: "ditolak", label: "Ditolak" },
] as const;
