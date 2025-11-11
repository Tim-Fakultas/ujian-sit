"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { memo } from "react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: React.ElementType;
}

export interface NavItem {
  title: string;
  icon?: React.ElementType;
  url?: string;
  items?: NavSubItem[];
}

function NavMain({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <SidebarGroup className={`${open ? "px-2" : "px-3"}`}>
      <SidebarMenu className="space-y-0.5">
        {navItems.map((item) => {
          // 🌟 Single Link
          if (!item.items) {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url || "#"}
                    prefetch={true}
                    className={cn(
                      // Perbaiki alignment agar rapi di kedua mode
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors",
                      open ? "justify-start" : "justify-center",
                      "group-data-[collapsible=icon]:justify-center",
                      isActive
                        ? "bg-blue-50 text-blue-500  dark:text-blue-300"
                        : "text-slate-700  hover:bg-slate-50 "
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        size={18}
                        className={cn(
                          "flex-shrink-0",
                          open ? "" : "mx-auto",
                          "group-data-[collapsible=icon]:mx-auto"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "truncate",
                        open ? "inline" : "hidden",
                        "group-data-[collapsible=icon]:hidden"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // 🌟 Collapsible Group
          const isGroupActive = item.items.some((sub) => pathname === sub.url);

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isGroupActive && open}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      // Perbaiki alignment agar rapi di kedua mode
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium w-full transition-colors",
                      open ? "justify-start" : "justify-center",
                      "group-data-[collapsible=icon]:justify-center",
                      isGroupActive
                        ? "bg-slate-50 text-slate-900 dark:bg-slate-800/50 dark:text-slate-100"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        size={18}
                        className={cn(
                          "flex-shrink-0",
                          open ? "" : "mx-auto",
                          "group-data-[collapsible=icon]:mx-auto"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "truncate",
                        open ? "inline" : "hidden",
                        "group-data-[collapsible=icon]:hidden"
                      )}
                    >
                      {item.title}
                    </span>
                    <ChevronRight
                      className={cn(
                        "ml-auto h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90",
                        open ? "inline" : "hidden",
                        "group-data-[collapsible=icon]:hidden"
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>

              {open && (
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="ml-4 mt-1 space-y-0.5">
                      {item.items.map((sub) => {
                        const isActive = pathname === sub.url;
                        return (
                          <SidebarMenuItem key={sub.url}>
                            <SidebarMenuButton asChild>
                              <Link
                                href={sub.url}
                                prefetch={true}
                                className={cn(
                                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors",
                                  isActive
                                    ? "bg-blue-50 text-blue-400 font-medium"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                    isActive
                                      ? "bg-blue-400 "
                                      : "bg-slate-300 dark:bg-slate-600"
                                  )}
                                />
                                <span className="truncate">{sub.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              )}
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default memo(NavMain);
