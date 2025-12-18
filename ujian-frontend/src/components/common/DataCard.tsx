import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DataCardProps {
  children: ReactNode;
  className?: string;
}

export function DataCard({ children, className }: DataCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-3 sm:p-6 rounded-md shadow-sm w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
