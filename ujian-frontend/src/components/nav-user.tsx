import {
  IconDotsVertical,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserProfileMenu } from "./user-profile-menu";
import { User } from "@/types/Auth";
import { getDisplayName } from "@/lib/utils";

export function NavUser({ user: serverUser }: { user?: User }) {
  const { open } = useSidebar();
  const { user } = useAuthStore();

  const currentUser = user || serverUser;
  if (!currentUser) return null;

  const initials =
    currentUser.nama
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <SidebarMenu className={`${open ? "px-2" : "px-1"}`}>
      <SidebarMenuItem>
        <UserProfileMenu
          user={serverUser}
          side={open ? "top" : "right"}
          trigger={
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-slate-50 dark:hover:bg-sidebar-accent h-12 group-data-[collapsible=icon]:justify-center"
            >
              <Avatar className="h-7 w-7 rounded-full flex-shrink-0">
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white text-[10px] font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-xs leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium text-slate-800 dark:text-slate-100">
                  {currentUser.nama}
                </span>
                <span className="text-slate-500 dark:text-slate-400 truncate text-xs">
                  {currentUser.nim || currentUser.nip_nim || currentUser.email}
                </span>
              </div>

              <IconDotsVertical className="ml-auto size-4 text-slate-500 dark:text-slate-400 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
