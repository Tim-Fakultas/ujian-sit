"use client";

import {
  IconBuilding,
  IconListDetails,
  IconHome,
  IconBook,
  IconUsers,
  IconClipboardList,
} from "@tabler/icons-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, memo } from "react";
import NavMain, { NavItem } from "./nav-main";

/**
 * Sidebar client yang hanya meng-hydrate bagian kecil (navigasi + collapsible)
 */
export const AppSidebarClient = memo(function AppSidebarClient({
  user,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const { user: storeUser, setUser } = useAuthStore();

  // Hydrate Zustand store dari server
  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  const currentUser = user || storeUser;

  const navSuperAdmin: NavItem[] = [
    { title: "Dashboard", url: "/super-admin/dashboard", icon: IconHome },
    {
      title: "Data Master",
      icon: IconBuilding,
      items: [
        { title: "Dosen", url: "/super-admin/dosen" },
        { title: "Mahasiswa", url: "/super-admin/mahasiswa" },
        { title: "Peminatan", url: "/super-admin/peminatan" },
        { title: "Prodi", url: "/super-admin/prodi" },
        { title: "Jenis Ujian", url: "/super-admin/jenis-ujian" },
        { title: "Komponen Penilaian", url: "/super-admin/komponen-penilaian" },
      ],
    },
  ];

  const navAdmin: NavItem[] = [
    { title: "Dashboard", url: "/admin/dashboard", icon: IconHome },

    {
      title: "Data Master",
      icon: IconUsers,
      items: [
        { title: "Dosen", url: "/admin/dosen" },
        { title: "Mahasiswa", url: "/admin/mahasiswa" },
      ],
    },
    {
      title: "Skripsi",
      url: "/admin/pendaftaran-ujian",
      icon: IconClipboardList,
      items: [
        { title: "Daftar Ujian", url: "/admin/pendaftaran-ujian" },
        { title: "Jadwal Ujian", url: "/admin/jadwal-ujian" },
        { title: "Rekapitulasi Nilai", url: "/admin/rekapitulasi-nilai" },
      ],
    },
  ];

  const navSekprodi: NavItem[] = [
    { title: "Dashboard", url: "/sekprodi/dashboard", icon: IconHome },
    {
      title: "Skripsi",
      icon: IconBook,
      items: [
        { title: "Daftar Ujian", url: "/sekprodi/daftar-ujian" },
        { title: "Penjadwalan Ujian", url: "/sekprodi/penjadwalan-ujian" },
        { title: "Jadwal Ujian", url: "/sekprodi/jadwal-ujian" },
        { title: "Berita Acara", url: "/sekprodi/berita-ujian" },
        { title: "Rekapitulasi Nilai", url: "/sekprodi/rekapitulasi-nilai" },
      ],
    },
  ];

  const navKaprodi: NavItem[] = [
    { title: "Dashboard", url: "/kaprodi/dashboard", icon: IconHome },
    {
      title: "Skripsi",
      icon: IconBook,
      items: [
        { title: "Rancangan Penelitian", url: "/kaprodi/pengajuan-ranpel" },
      ],
    },
  ];

  const navDosen: NavItem[] = [
    { title: "Dashboard", url: "/dosen/dashboard", icon: IconHome },
    {
      title: "Skripsi",
      icon: IconBook,
      items: [
        { title: "Rancangan Penelitian", url: "/dosen/pengajuan-ranpel" },
        { title: "Jadwal Ujian", url: "/dosen/jadwal-ujian" },
      ],
    },
  ];

  const navMahasiswa: NavItem[] = [
    { title: "Dashboard", url: "/mahasiswa/dashboard", icon: IconHome },
    {
      title: "Skripsi",
      icon: IconListDetails,
      items: [
        { title: "Rancangan Penelitian", url: "/mahasiswa/pengajuan-ranpel" },
        { title: "Perbaikan judul", url: "/mahasiswa/perbaikan-judul" },
        { title: "Pengajuan Ujian", url: "/mahasiswa/pendaftaran-ujian" },
        { title: "Jadwal Ujian", url: "/mahasiswa/jadwal-ujian" },
        { title: "Berita Ujian", url: "/mahasiswa/berita-ujian" },
        { title: "Rekapitulasi Nilai", url: "/mahasiswa/rekapitulasi-nilai" },
      ],
    },
  ];

  const routeMap: Record<string, NavItem[]> = {
    "/super-admin": navSuperAdmin,
    "/admin": navAdmin,
    "/sekprodi": navSekprodi,
    "/kaprodi": navKaprodi,
    "/dosen": navDosen,
    "/mahasiswa": navMahasiswa,
  };

  const routeKey = Object.keys(routeMap).find((key) =>
    pathname.startsWith(key)
  );
  const navItems = routeKey ? routeMap[routeKey] : navMahasiswa;

  return (
    <Sidebar collapsible="icon" >
      {/* Header */}
      {/* Header */}
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between gap-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="py-6 px-1 transition-all hover:bg-transparent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!size-auto group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!p-1"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white">
                      <Image
                        src="/images/uin-raden-fatah.webp"
                        alt="Logo UIN"
                        width={40}
                        height={40}
                        className="object-contain"
                        priority
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                    <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                      E-Skripsi
                    </h1>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                      Fakultas Saintek
                    </p>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {isMobile && (
            <button
              onClick={() => setOpenMobile(false)}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="flex-1 overflow-y-auto">
        <NavMain navItems={navItems} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-200/30 dark:border-slate-700/30 mt-auto p-2">
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
});