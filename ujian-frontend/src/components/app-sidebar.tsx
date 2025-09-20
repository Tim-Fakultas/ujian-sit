"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavBerkasMahasiswa} from "@/components/nav-berkas-mahasiswa";
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
import { NavMain } from "./nav-main";


const data = {
  user: {
    name: "Muhammad Abdi",
    email: "2109106044",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Berkas Saya",
      url: "#",
      icon: IconFolder,
      items: [
        { title: "Pengajuan Judul", url: "/mahasiswa/pengajuan" },
        { title: "Judul diterima", url: "/mahasiswa/judul-diterima" },
      ]
    },
  
  ],
};



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">E-Thesis.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
   
      <SidebarContent>
        <NavMain/>
        <NavBerkasMahasiswa data={data}  />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
