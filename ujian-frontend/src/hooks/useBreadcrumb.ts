"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useBreadcrumbContext } from "@/contexts/BreadcrumbContext";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

// Route mapping untuk label yang lebih user-friendly
const routeLabels: Record<string, string> = {
  // Dashboard
  dashboard: "Dashboard",

  // Admin routes
  admin: "Admin",
  "user-management": "Manajemen User",
  "fakultas-management": "Manajemen Fakultas",
  "prodi-management": "Manajemen Program Studi",

  // Mahasiswa routes
  mahasiswa: "Mahasiswa",
  "pengajuan-judul": "Pengajuan Judul",
  "pendaftaran-ujian": "Pendaftaran Ujian",
  "jadwal-ujian": "Jadwal Ujian",
  "hasil-ujian": "Hasil Ujian",

  // Dosen routes
  dosen: "Dosen",
  bimbingan: "Bimbingan",
  penilaian: "Penilaian",
  "jadwal-penguji": "Jadwal Penguji",

  // Kaprodi routes
  kaprodi: "Kepala Program Studi",
  "persetujuan-judul": "Persetujuan Judul",
  "penetapan-penguji": "Penetapan Penguji",
  laporan: "Laporan",

  // Sekprodi routes
  sekprodi: "Sekretaris Program Studi",
  penjadwalan: "Penjadwalan",
  administrasi: "Administrasi",

  // Prodi routes
  prodi: "Program Studi",
  "data-mahasiswa": "Data Mahasiswa",
  "data-dosen": "Data Dosen",

  // Super Admin routes
  "super-admin": "Super Admin",
  "system-management": "Manajemen Sistem",
  "audit-log": "Log Audit",

  // Common routes
  profile: "Profil",
  settings: "Pengaturan",
  help: "Bantuan",

  // Dynamic routes
  create: "Buat Baru",
  edit: "Edit",
  detail: "Detail",
  view: "Lihat",
};

export function useBreadcrumb() {
  const pathname = usePathname();
  const { customBreadcrumbs, pageTitle } = useBreadcrumbContext();

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    // Return custom breadcrumbs if set
    if (customBreadcrumbs.length > 0) {
      return customBreadcrumbs.map((item) => ({
        label: item.label,
        href: item.href || "#",
        isActive: item.isActive || false,
      }));
    }

    // Skip breadcrumb for login and public routes
    if (
      pathname === "/login" ||
      pathname === "/" ||
      pathname === "/unauthorized"
    ) {
      return [];
    }

    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Always add Home as first item
    items.push({
      label: "Home",
      href: "/",
      isActive: false,
    });

    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Get label for segment
      let label = routeLabels[segment] || segment;

      // Handle dynamic segments (IDs, UUIDs, etc.)
      if (
        segment.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        )
      ) {
        // UUID format - likely an ID
        label = "Detail";
      } else if (segment.match(/^\d+$/)) {
        // Numeric ID
        label = "Detail";
      } else if (segment === "new" || segment === "create") {
        label = "Buat Baru";
      } else if (segment === "edit") {
        label = "Edit";
      }

      // Capitalize first letter if not in routeLabels
      if (!routeLabels[segment]) {
        label =
          label.charAt(0).toUpperCase() + label.slice(1).replace(/-/g, " ");
      }

      items.push({
        label,
        href: currentPath,
        isActive: isLast,
      });
    });

    return items;
  }, [pathname, customBreadcrumbs]);

  const currentPage = useMemo(() => {
    if (pageTitle) return pageTitle;
    return breadcrumbs[breadcrumbs.length - 1]?.label || "";
  }, [breadcrumbs, pageTitle]);

  return {
    breadcrumbs,
    currentPage,
    pathname,
  };
}
