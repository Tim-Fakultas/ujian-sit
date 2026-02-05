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
  const { open, isMobile } = useSidebar();
  // On mobile, the sidebar is always "expanded" visually inside the sheet
  const isExpanded = open || isMobile;

  return (
    <SidebarGroup className={`${isExpanded ? "px-2" : "px-3"}`}>
      <SidebarMenu className="space-y-1">
        {navItems.map((item) => {
          // 🌟 Single Link
          if (!item.items) {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "group/btn relative overflow-hidden transition-all duration-200",
                    isActive
                      ? "bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary font-semibold shadow-sm ring-1 ring-primary/20 dark:ring-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Link
                    href={item.url || "#"}
                    prefetch={true}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 text-sm",
                      isExpanded ? "justify-start" : "justify-center",
                      "group-data-[collapsible=icon]:justify-center"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        size={20}
                        stroke={isActive ? 2 : 1.5}
                        className={cn(
                          "flex-shrink-0 transition-colors",
                          isActive ? "text-primary dark:text-primary" : "text-muted-foreground group-hover/btn:text-foreground",
                          isExpanded ? "" : "mx-auto",
                          "group-data-[collapsible=icon]:mx-auto"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "truncate",
                        isExpanded ? "inline" : "hidden",
                        "group-data-[collapsible=icon]:hidden"
                      )}
                    >
                      {item.title}
                    </span>
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full opacity-100 dark:bg-primary" />
                    )}
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
              defaultOpen={true}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      "group/btn w-full transition-all duration-200",
                      isGroupActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        size={20}
                        stroke={isGroupActive ? 2 : 1.5}
                        className={cn(
                          "flex-shrink-0 transition-colors",
                          isGroupActive ? "text-primary" : "text-muted-foreground group-hover/btn:text-foreground",
                          isExpanded ? "" : "mx-auto",
                          "group-data-[collapsible=icon]:mx-auto"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "truncate",
                        isExpanded ? "inline" : "hidden",
                        "group-data-[collapsible=icon]:hidden"
                      )}
                    >
                      {item.title}
                    </span>
                    <ChevronRight
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground",
                        isExpanded ? "inline" : "hidden",
                        "group-data-[collapsible=icon]:hidden"
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>

              {isExpanded && (
                <CollapsibleContent>
                  <div className="relative pl-6 pr-2 py-1">
                    {/* Timeline Line */}
                    <div className="absolute left-[21px] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

                    <SidebarMenu className="space-y-1">
                      {item.items.map((sub) => {
                        const isActive = pathname === sub.url;
                        return (
                          <SidebarMenuItem key={sub.url}>
                            <SidebarMenuButton asChild className="h-auto py-1.5 ring-0 outline-none focus-visible:ring-0">
                              <Link
                                href={sub.url}
                                prefetch={true}
                                className={cn(
                                  "flex items-center gap-2 pl-3 py-2 rounded-lg text-sm transition-all relative",
                                  isActive
                                    ? "text-primary font-medium bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                )}
                              >
                                <div className={cn(
                                  "absolute -left-[16px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border-2 transition-colors z-10",
                                  isActive
                                    ? "bg-background border-primary"
                                    : "bg-border border-border group-hover:bg-muted-foreground"
                                )} />
                                <span className="truncate">{sub.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </div>
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