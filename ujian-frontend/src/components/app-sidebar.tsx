"use client";

import {
  IconFilePlus, // pengajuan judul
  IconBuilding, // fakultas
  IconListDetails,
  IconHome,
  IconFolderFilled,
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
        title: "Pengajuan Judul",
        url: "/mahasiswa/pengajuan",
      },
      {
        title: "Bimbingan",
        url: "/mahasiswa/bimbingan",
      },
      {
        title: "Daftar ujian",
        url: "/mahasiswa/ujian",
      },
    ],
  },
];

const navAdmin: NavItem[] = [
  {
    title: "Data Master",
    icon: IconBuilding,
    items: [
      { title: "Users", url: "dashboard/admin/users" },
      { title: "Fakultas", url: "dashboard/admin/fakultas" },
      { title: "Prodi", url: "dashboard/admin/prodi" },
      { title: "Dosen", url: "dashboard/admin/dosen" },
    ],
  },
];

const navDosen: NavItem[] = [
  {
    title: "Skripsi",
    icon: IconFilePlus,
    items: [
      { title: "Pengajuan Judul", url: "pengajuan-judul" },
      { title: "Bimbingan", url: "bimbingan" },
      { title: "Penilaian", url: "penilaian" },
      { title: "Ujian", url: "ujian" },

    ],
  },
];

// ----------------------
// AppSidebar Component
// ----------------------
export function AppSidebar() {
  // const {user} = useAuthStore((state) => ({ user: state.user }));

  const pathname = usePathname();

  let navItems: NavItem[] = [];
  if (pathname.startsWith("/mahasiswa")) navItems = navMahasiswa;
  else if (pathname.startsWith("/admin")) navItems = navAdmin;
  else if (pathname.startsWith("/dosen")) navItems = navDosen;
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
