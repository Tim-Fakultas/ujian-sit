import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const truncateTitle = (title: string, maxLength: number = 35) => {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + "...";
};

export const getJenisUjianColor = (jenis: string) => {
  switch (jenis.toLowerCase()) {
    case "sidang proposal":
      return "bg-purple-100 text-purple-800";
    case "sidang hasil":
      return "bg-orange-100 text-orange-800";
    case "sidang skripsi":
      return "bg-teal-100 text-teal-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "dijadwalkan":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case "diterima":
    case "disetujui":
    case "lulus":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
    case "ditolak":
    case "tidak lulus":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    case "revisi":
      return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
    case "menunggu":
      return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
  }
};

export function getStorageUrl(path: string | undefined | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const baseUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:8000";
  // Ensure protocol if missing
  const fullBase = baseUrl.startsWith("http") ? baseUrl : `http://${baseUrl}`;

  // Clean slash - path should not start with / if base ends with it, but here base usually doesn't end with slash.
  let cleanPath = path.startsWith("/") ? path.substring(1) : path;

  if (cleanPath.startsWith("uploads/") || cleanPath.startsWith("signatures/")) {
    cleanPath = `storage/${cleanPath}`;
  }

  return `${fullBase}/${cleanPath}`;
}

/**
 * Returns the display name for a user.
 * If the first name is an initial (e.g., "M." or "A."), it returns the second name.
 * Otherwise, it returns the first name.
 */
export function getDisplayName(fullName: string | undefined | null): string {
  if (!fullName) return "User";

  const parts = fullName.trim().split(/\s+/);

  if (parts.length > 1) {
    const firstPart = parts[0];
    // Check if first part looks like an initial (ends with dot or is single letter)
    // Common initials: "M.", "A.", "Dr.", "Ir." etc usually end with dot.
    // User specifically asked for M. or A.
    if (
      firstPart.endsWith(".") ||
      (firstPart.length === 1 && /^[A-Z]$/.test(firstPart))
    ) {
      return parts[1];
    }
  }

  return parts[0];
}
