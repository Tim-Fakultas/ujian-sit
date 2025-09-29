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

const navMahasiswa: NavItem[] = [
  {
    title: "Home",
    url: "/mahasiswa/dashboard", // pakai absolute path
    icon: IconHome,
  },
  {
    title: "Skripsi",
    icon: IconListDetails,
    items: [
      {
        title: "Rancangan Penelitian",
        url: "/mahasiswa/pengajuan-ranpel",
      },
      {
        title: "Pengajuan Judul",
        url: "/mahasiswa/pengajuan",
      },
      {
        title: "Bimbingan",
        url: "/mahasiswa/bimbingan",
      },
      {
        title: "Daftar Ujian",
        url: "/mahasiswa/ujian",
      },
      {
        title: "Penilaian",
        url: "/mahasiswa/penilaian",
      },
    ],
  },
];

const navAdmin: NavItem[] = [
  {
    title: "Home",
    url: "/admin/dashboard",
    icon: IconHome,
  },
  {
    title: "Jadwal Ujian",
    url: "/admin/jadwal-ujian",
    icon: IconBook,
  },
  {
    title: "Data Master",
    icon: IconBuilding,
    items: [{ title: "Dosen", url: "/admin/dosen" }],
  },
];

const navDosen: NavItem[] = [
  {
    title: "Home",
    url: "/dosen/dashboard",
    icon: IconHome,
  },
  {
    title: "Skripsi",
    icon: IconBook,
    items: [
      { title: "Rancangan Penelitian", url: "/dosen/pengajuan-ranpel" },
      { title: "Pengajuan Judul", url: "/dosen/pengajuan-judul" },
      { title: "Mahasiswa", url: "/dosen/mahasiswa" },
      { title: "Bimbingan", url: "/dosen/bimbingan" },
      { title: "Ujian", url: "/dosen/ujian" },
      { title: "Penilaian", url: "/dosen/penilaian" },
    ],
  },
];

export function AppSidebar() {
  // const {user} = useAuthStore((state) => ({ user: state.user }));

  const pathname = usePathname();

  let navItems: NavItem[] = [];
  if (pathname.startsWith("/mahasiswa")) navItems = navMahasiswa;
  else if (pathname.startsWith("/admin")) navItems = navAdmin;
  else if (pathname.startsWith("/dosen")) navItems = navDosen;
  // else if (pathname.startsWith("/prodi")) navItems = navProdi;
  // fallback: navMahasiswa jika tidak ada yang cocok
  else navItems = navMahasiswa;

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="py-6">
              <div className="flex">
                <Image
                  src="/images/uin-raden-fatah.png"
                  alt="Logo UIN"
                  width={40}
                  height={40}
                  className="mb-1 self-center"
                />
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
