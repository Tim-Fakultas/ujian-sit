"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupLabel,
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

export interface NavSubItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  isActive?: boolean;
}

export interface NavItem {
  title: string;
  icon?: React.ElementType;
  url?: string; // untuk single link (Home)
  items?: NavSubItem[]; // untuk collapsible
}

export interface NavProps {
  data: {
    navItems: NavItem[];
  };
}

export function NavMain({ data }: NavProps) {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <SidebarGroup className={`${open ? "px-2" : "px-3"}`}>
     
      <SidebarMenu className="space-y-0.5">
        {data.navItems.map((item) => {
          // ✅ Case: Single link (Home)
          if (!item.items) {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url || "#"}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2",
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        size={18}
                        className={cn(
                          "flex-shrink-0",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      />
                    )}
                    <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // ✅ Case: Collapsible (punya children)
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2",
                      isGroupActive
                        ? "bg-slate-50 text-slate-900 dark:bg-slate-800/50 dark:text-slate-100"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        size={18}
                        className={cn(
                          "flex-shrink-0",
                          isGroupActive
                            ? "text-slate-700 dark:text-slate-300"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      />
                    )}
                    <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto h-3.5 w-3.5 transition-transform flex-shrink-0 group-data-[collapsible=icon]:hidden",
                        "group-data-[state=open]/collapsible:rotate-90",
                        isGroupActive
                          ? "text-slate-600 dark:text-slate-400"
                          : "text-slate-400 dark:text-slate-500"
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>

              {open && (
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="ml-4 mt-1 space-y-0.5">
                      {item.items.map((sub, index) => {
                        // ✅ aktif hanya kalau exact match
                        const isActive = pathname === sub.url;

                        return (
                          <SidebarMenuItem key={index}>
                            <SidebarMenuButton asChild>
                              <Link
                                href={sub.url}
                                className={cn(
                                  "flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm",
                                  isActive
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-medium"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                    isActive
                                      ? "bg-blue-500 dark:bg-blue-400"
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
