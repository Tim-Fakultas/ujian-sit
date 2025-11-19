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
} from "@/components/ui/sidebar";
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
        { title: "Jadwal Ujian", url: "/sekprodi/jadwal-ujian" },
        { title: "Daftar Ujian", url: "/sekprodi/daftar-ujian" },
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
        { title: "Daftar Ujian", url: "/mahasiswa/pendaftaran-ujian" },
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
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="py-6 px-1 transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm">
                    <Image
                      src="/images/uin-raden-fatah.webp"
                      alt="Logo UIN"
                      width={30}
                      height={30}
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
                <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                  <h1 className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                    E-Skripsi
                  </h1>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Faculty of Science & Technology
                  </p>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
