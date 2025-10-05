"use client";

import {
  IconBuilding,
  IconListDetails,
  IconHome,
  IconBook,
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
import { NavMain, NavItem } from "./nav-main";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export function AppSidebarClient({ user }: { user: any }) {
  const pathname = usePathname();
  const { setUser } = useAuthStore();

  // Hydrate Zustand dari server (langsung setelah render)
  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  // Super Admin
  const navSuperAdmin: NavItem[] = [
    { title: "Home", url: "/superadmin/dashboard", icon: IconHome },
    {
      title: "Data Master",
      icon: IconBuilding,
      items: [
        { title: "Dosen", url: "/super-admin/dosen" },
        { title: "Mahasiswa", url: "/super-admin/mahasiswa" },
        { title: "Peminatan", url: "/super-admin/peminatan" },
        { title: "Jenis Ujian", url: "/super-admin/jenis-ujian" },
        { title: "Komponen Penilaian", url: "/super-admin/komponen-penilaian" },
      ],
    },
  ];
  // Admin
  const navAdmin: NavItem[] = [
    { title: "Home", url: "/admin/dashboard", icon: IconHome },
    { title: "Jadwal Ujian", url: "/admin/jadwal-ujian", icon: IconBook },
    {
      title: "Data Master",
      icon: IconBuilding,
      items: [
        { title: "Dosen", url: "/admin/dosen" },
        { title: "Mahasiswa", url: "/admin/mahasiswa" },
      ],
    },
  ];
  // Kaprodi
  const navKaprodi: NavItem[] = [
    { title: "Home", url: "/kaprodi/dashboard", icon: IconHome },
    {
      title: "Skripsi",
      icon: IconBook,
      items: [
        { title: "Rancangan Penelitian", url: "/kaprodi/pengajuan-ranpel" },
      ],
    },
  ];

  // Dosen
  const navDosen: NavItem[] = [
    { title: "Home", url: "/dosen/dashboard", icon: IconHome },
    {
      title: "Skripsi",
      icon: IconBook,
      items: [
        { title: "Pengajuan Judul", url: "/dosen/pengajuan-judul" },
        { title: "Rancangan Penelitian", url: "/dosen/pengajuan-ranpel" },
        { title: "Ujian", url: "/dosen/ujian" },
        { title: "Penilaian", url: "/dosen/penilaian" },
      ],
    },
  ];

  // Mahasiswa
  const navMahasiswa: NavItem[] = [
    { title: "Home", url: "/mahasiswa/dashboard", icon: IconHome },
    {
      title: "Skripsi",
      icon: IconListDetails,
      items: [
        { title: "Pengajuan Judul", url: "/mahasiswa/pengajuan" },
        { title: "Rancangan Penelitian", url: "/mahasiswa/pengajuan-ranpel" },
        { title: "Daftar Ujian", url: "/mahasiswa/ujian" },
        { title: "Penilaian", url: "/mahasiswa/penilaian" },
      ],
    },
  ];

  let navItems: NavItem[] = [];
  if (pathname.startsWith("/mahasiswa")) navItems = navMahasiswa;
  else if (pathname.startsWith("/super-admin")) navItems = navSuperAdmin;
  else if (pathname.startsWith("/dosen")) navItems = navDosen;
  else if (pathname.startsWith("/kaprodi")) navItems = navKaprodi;
  else if (pathname.startsWith("/admin")) navItems = navAdmin;
  else navItems = navMahasiswa;

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="py-6">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <Image
                    src="/images/uin-raden-fatah.png"
                    alt="Logo UIN"
                    width={40}
                    height={40}
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>

                <h1 className="text-sm font-medium leading-tight text-neutral-500">
                  Integration System
                </h1>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <NavMain data={{ navItems }} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
