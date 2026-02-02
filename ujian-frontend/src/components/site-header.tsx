"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/app/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { GlobalBreadcrumb } from "./global-breadcrumb";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md px-6 transition-all shadow-sm">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 h-9 w-9 text-muted-foreground hover:text-foreground transition-colors" />
          <Separator
            orientation="vertical"
            className="mr-2 h-4 bg-neutral-200 dark:bg-neutral-700"
          />
          <GlobalBreadcrumb />
        </div>
        <div className="flex items-center gap-1">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

