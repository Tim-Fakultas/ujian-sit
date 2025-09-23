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

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
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
                      "flex items-center gap-2 transition-colors hover:bg-blue-50 hover:text-site-header",
                      isActive
                        ? "font-medium bg-blue-50 text-site-header"
                        : "text-gray-600 dark:text-gray-300"
                    )}
                  >
                    {item.icon && <item.icon size={18} />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // ✅ Case: Collapsible (punya children)
          const isGroupActive = item.items.some(
            (sub) => pathname === sub.url
          );

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isGroupActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    {item.icon && <item.icon size={18} />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((sub) => {
                      // ✅ aktif hanya kalau exact match
                      const isActive = pathname === sub.url;

                      return (
                        <SidebarMenuItem key={sub.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={sub.url}
                              className={cn(
                                "flex items-center gap-2 transition-colors hover:bg-blue-50 hover:text-site-header dark:hover:text-blue-400",
                                isActive
                                  ? "font-medium bg-blue-50 text-site-header dark:text-blue-400"
                                  : "text-gray-600 dark:text-gray-300"
                              )}
                            >
                              {sub.icon ? (
                                <sub.icon size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                              <span>{sub.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
