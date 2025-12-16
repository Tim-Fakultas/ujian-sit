"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { getCurrentLabel } from "@/utils/path";
import { ModeToggle } from "@/app/theme-toggle";
import { Separator } from "@/components/ui/separator";

export function SiteHeader() {
  const pathname = usePathname();
  const currentLabel = getCurrentLabel(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md px-6 transition-all shadow-sm">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors" />
          <Separator
            orientation="vertical"
            className="mr-2 h-4 bg-neutral-200 dark:bg-neutral-700"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-neutral-800 dark:text-gray-100 line-clamp-1 text-sm md:text-base">
                  {currentLabel}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
