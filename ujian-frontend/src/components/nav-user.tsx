"use client";

import { useEffect } from "react";
import {
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "./ui/button";
import { logoutAction } from "@/actions/logoutAction";
import { useAuthStore } from "@/stores/useAuthStore";

export function NavUser() {
  const { isMobile, open } = useSidebar();
  const { user, initializeFromCookies } = useAuthStore();

  useEffect(() => {
    initializeFromCookies();
  }, [initializeFromCookies]);

  if (!user) return null;

  const userRole =
    user.roles && user.roles.length > 0 ? user.roles[0].name : "user";

  const initials = user.nama
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SidebarMenu className={`${open ? "px-2" : "px-1"}`}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 h-12 group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="h-7 w-7 rounded-full flex-shrink-0">
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-xs leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium text-slate-800 dark:text-slate-100">
                  {user.nama}
                </span>
                <span className="text-slate-500 dark:text-slate-400 truncate text-xs">
                  {user.nim || user.nidn || user.nip_nim}
                </span>
              </div>

              <IconDotsVertical className="ml-auto size-4 text-slate-500 dark:text-slate-400 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full flex-shrink-0">
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-medium">{user.nama}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>

                  <span className="text-muted-foreground truncate text-xs capitalize">
                    Role: {userRole}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={`/${userRole
                    .replace(/\s+/g, "-")
                    .toLowerCase()}/profile`}
                >
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <IconNotification className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <form action={logoutAction}>
              <DropdownMenuItem asChild>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600"
                >
                  <IconLogout className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
