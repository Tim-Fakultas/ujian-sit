"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export function SiteHeader() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log("user header effect:", user);
  }, [user]);

  return (
    <header className="flex h-(--header-height)  shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />

      </div>
    </header>
  );
}
