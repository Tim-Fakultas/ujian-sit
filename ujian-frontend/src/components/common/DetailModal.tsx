"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface DetailItem {
  label: string;
  value: ReactNode;
  icon?: React.ElementType;
  colSpan?: number; // 1 or 2 (default 1)
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;

  /**
   * Data for the header section
   */
  headerData?: {
    name: string;
    subText?: string; // e.g. NIM or NIP
    status?: string;
    statusColor?: string; // Tailwind class string
    initials?: string;
    avatarColor?: string; // Tailwind class string for avatar bg
  };

  /**
   * List of details to display in the grid
   */
  items?: DetailItem[];

  /**
   * Optional loading state
   */
  loading?: boolean;
}

export default function DetailModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  headerData,
  items = [],
  loading = false,
}: DetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg overflow-hidden flex flex-col max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="overflow-y-auto p-6 scrollbar-thin">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Section */}
              {headerData && (
                <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl flex flex-col items-center justify-center gap-3 border border-primary/10">
                  <div
                    className={cn(
                      "h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm border-2 border-white dark:border-neutral-800",
                      headerData.avatarColor ||
                        "bg-white dark:bg-neutral-800 text-primary",
                    )}
                  >
                    {headerData.initials || <User className="h-10 w-10" />}
                  </div>
                  <div className="text-center">
                    <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">
                      {headerData.name}
                    </h2>
                    {headerData.subText && (
                      <p className="text-gray-500 text-sm font-mono mt-1">
                        {headerData.subText}
                      </p>
                    )}
                  </div>
                  {headerData.status && (
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize border",
                        headerData.statusColor ||
                          "bg-gray-100 text-gray-700 border-gray-200",
                      )}
                    >
                      {headerData.status}
                    </span>
                  )}
                </div>
              )}

              {/* Details Grid */}
              {items && items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-start gap-3",
                        item.colSpan === 2
                          ? "col-span-1 sm:col-span-2"
                          : "col-span-1",
                      )}
                    >
                      <div className="mt-0.5 text-muted-foreground shrink-0">
                        {item.icon ? (
                          <item.icon size={18} />
                        ) : (
                          <div className="w-[18px]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                          {item.label}
                        </p>
                        <div className="text-sm font-medium text-foreground break-words">
                          {item.value || "-"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {children}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
