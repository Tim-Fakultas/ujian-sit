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

export  const getStatusColor = (status: string) => {
    switch (status) {
      case "dijadwalkan":
        return "bg-blue-100 text-blue-800";
      case "disetujui":
        return "bg-green-100 text-green-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };
