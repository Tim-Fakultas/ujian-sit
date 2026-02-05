"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/app/theme-toggle";
import { GlobalBreadcrumb } from "./global-breadcrumb";
import { User } from "@/types/Auth";
import { UserProfileMenu } from "./user-profile-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import Image from "next/image";

export function SiteHeader({ user: serverUser }: { user?: User }) {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (serverUser) {
      setUser(serverUser);
    }
  }, [serverUser, setUser]);

  const currentUser = user || serverUser;

  const initials = currentUser?.nama
    ? currentUser.nama
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md px-4 md:px-6 transition-all shadow-sm">
      <div className="flex w-full items-center justify-between">
        {/* Left: Breadcrumb (Desktop Only) */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <SidebarTrigger className="-ml-1 h-9 w-9 text-muted-foreground hover:text-foreground transition-colors" />
            <GlobalBreadcrumb />
          </div>

          {/* Mobile Logo/Title space or empty */}
          <div className="md:hidden flex items-center gap-2">
            <Image
              src="/images/uin-raden-fatah.webp"
              alt="Logo UIN"
              width={32}
              height={32}
              className="object-contain"
              priority
              unoptimized
            />
            <span className="font-bold text-lg text-black dark:text-white tracking-tight">
              E-Skripsi
            </span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
          </div>

          {/* Mobile Menu Trigger (Right side) */}
          <div className="md:hidden flex items-center">
            <SidebarTrigger className="h-9 w-9 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}

