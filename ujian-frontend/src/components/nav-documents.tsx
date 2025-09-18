"use client";

import {
  IconBook,
  IconDashboard,
  IconDots,
  IconFolder,
  IconHome,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Archive,
  ArchiveIcon,
  BookOpen,
  Bot,
  ChevronRight,
  Dot,
  FolderArchive,
  Frame,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Data Berkas Mahasiswa",
      url: "#",
      icon: FolderArchive,
      isActive: true,
      items: [
        {
          title: "Pengajuan Judul",
          url: "/mahasiswa/pengajuan-judul",
        },
        {
          title: "Judul diterima",
          url: "/mahasiswa/judul-diterima",
        },
        {
          title: "Judul ditolak",
          url: "/mahasiswa/judul-ditolak",
        },
      ],
    },
  ],
};

export function NavDocuments() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                pathname === "/"
                  ? "text-[#476EAE] bg-blue-50"
                  : "hover:bg-blue-50 hover:text-[#476EAE] transition-colors"
              )}
            >
              <Link href="/">
                <IconHome />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="">Menu</SidebarGroupLabel>

        <SidebarMenu className="">
          {data.navMain.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="hover:bg-blue-50 hover:text-[#476EAE] transition-colors"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          className={cn(
                            pathname === subItem.url
                              ? "text-[#476EAE] bg-blue-50"
                              : "hover:bg-blue-50 hover:text-[#476EAE]  transition-colors"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight size={16} />
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </div>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                pathname === "/dosen/daftar-pengajuan"
                  ? "text-[#476EAE] bg-blue-50"
                  : "hover:bg-blue-50 hover:text-[#476EAE] transition-colors"
              )}
            >
              <Link href="/dosen/daftar-pengajuan">
                <IconBook />
                <span>Pengajuan Judul</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
