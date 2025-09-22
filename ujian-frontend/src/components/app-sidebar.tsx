"use client";

import * as React from "react";
import {
  IconInnerShadowTop,
  IconFilePlus, // pengajuan judul
  IconCircleCheck, // judul diterima
  IconCircleX, // judul ditolak
  IconBuilding, // fakultas
  IconSchool, // prodi
  IconUsers,
  IconListDetails,
  IconHome,
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

// ----------------------
// Data Menu flat per role
// ----------------------
const navMahasiswa: NavItem[] = [
  { title: "Home", url: "/mahasiswa/home", icon: IconHome }, // ✅ single link
  {
    title: "Skripsi",
    icon: IconListDetails,
    items: [
      { title: "Pengajuan Judul", url: "/mahasiswa/pengajuan" },
      { title: "Judul Diterima", url: "/mahasiswa/judul-diterima" },
      { title: "Judul Ditolak", url: "/mahasiswa/judul-ditolak" },
    ],
  },
];

const navAdmin: NavItem[] = [
  {
    title: "Data Master",
    icon: IconBuilding,
    items: [
      { title: "Fakultas", url: "/admin/fakultas" },
      { title: "Prodi", url: "/admin/prodi" },
      { title: "Dosen", url: "/admin/dosen" },
    ],
  },
];

const navDosen: NavItem[] = [
  {
    title: "Skripsi",
    icon: IconFilePlus,
    items: [{ title: "Pengajuan Judul", url: "/dosen/pengajuan-judul" }],
  },
];


// ----------------------
// User Dummy
// ----------------------
const baseUser = {
  name: "Muhammad Abdi",
  email: "2109106044",
  avatar: "/avatars/shadcn.jpg",
};

// ----------------------
// AppSidebar Component
// ----------------------
export function AppSidebar({
  role = "mahasiswa",
  ...props
}: {
  role?: "mahasiswa" | "admin" | "dosen";
} & React.ComponentProps<typeof Sidebar>) {
  let navItems: NavItem[] = [];

  if (role === "mahasiswa") navItems = navMahasiswa;
  if (role === "admin") navItems = navAdmin;
  if (role === "dosen") navItems = navDosen;

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image src="/uin-raden-fatah.png" alt="UIN Raden Fatah" width={40} height={40} />
                <span className="text-base font-semibold text-sidebar-accent-foreground">
                  Integration System.
                </span>
              </a>
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
        <NavUser user={{ ...baseUser }} />
      </SidebarFooter>
    </Sidebar>
  );
}
