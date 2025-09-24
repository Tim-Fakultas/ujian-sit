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
      { title: "Pengajuan Judul", url: "dashboard/dosen/pengajuan-judul" },
    ],
  },
];

// ----------------------
// AppSidebar Component
// ----------------------
export function AppSidebar() {
  // const {user} = useAuthStore((state) => ({ user: state.user }));

  const role = "mahasiswa" as "mahasiswa" | "admin" | "dosen"; // user?.role || "mahasiswa"

  let navItems: NavItem[] = [];
  if (role === "mahasiswa") navItems = navMahasiswa;
  if (role === "admin") navItems = navAdmin;
  if (role === "dosen") navItems = navDosen;

  return (
    <Sidebar collapsible="icon" >
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
