"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
} from "@/components/ui/breadcrumb";
import { getCurrentLabel } from "@/utils/path";

export function SiteHeader() {
  const pathname = usePathname();
  const currentLabel = getCurrentLabel(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 border-b bg-white">
      <div className="flex w-full items-center justify-between gap-3 px-4 lg:gap-4 lg:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="-ml-1" />
          <span className="mx-2 text-neutral-300 select-none">|</span>
          <div className="truncate max-w-xs sm:max-w-sm md:max-w-md">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <span className="font-semibold text-slate-700 text-sm">
                    {currentLabel}
                  </span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>
    </header>
  );
}
