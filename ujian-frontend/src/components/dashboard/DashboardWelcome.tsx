"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { getDisplayName } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardWelcomeProps {
  /** Custom greeting, default: "Selamat Datang" */
  greeting?: string;
  /** Role label untuk subtitle, e.g. "Ketua Prodi". Jika ada, subtitle otomatis dibuat. */
  roleLabel?: string;
  /** Override subtitle sepenuhnya */
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Client component yang membaca user dari localStorage (Zustand store).
 * Menunggu rehydrate selesai sebelum render nama agar tidak ada mismatch.
 */
export function DashboardWelcome({
  greeting = "Selamat Datang",
  roleLabel,
  subtitle,
  className,
  children,
}: DashboardWelcomeProps) {
  const { user, _hasHydrated } = useAuthStore();

  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Tunggu sampai localStorage selesai di-load
  const displayName = _hasHydrated ? getDisplayName(user?.nama) : null;

  const resolvedSubtitle =
    subtitle ??
    (roleLabel && _hasHydrated
      ? `Dashboard ${roleLabel}${user?.prodi?.nama ? ` ${user.prodi.nama}` : ""}`
      : roleLabel
        ? `Dashboard ${roleLabel}`
        : undefined);

  return (
    <div
      className={cn(
        "relative flex flex-col md:flex-row md:items-end md:justify-between py-6 px-6 bg-linear-to-br from-white to-gray-50/50 dark:from-neutral-900 dark:to-neutral-900/50 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden",
        className,
      )}
    >
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="space-y-2 relative z-10 w-full max-w-3xl">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 dark:bg-blue-900/20 border border-primary/10 dark:border-blue-900/30 text-primary dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <CalendarDays size={12} />
            <span>{dateStr}</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          {greeting},{" "}
          {displayName ? (
            <span className="animate-in fade-in duration-300">
              {displayName}
            </span>
          ) : (
            // Skeleton saat menunggu hydrate
            <span className="inline-block w-40 h-9 bg-gray-200 dark:bg-neutral-700 rounded-lg animate-pulse align-middle" />
          )}
          !
        </h1>

        {resolvedSubtitle && (
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
            {resolvedSubtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="mt-6 md:mt-0 relative z-10 flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
