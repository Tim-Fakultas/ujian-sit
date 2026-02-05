import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
}

export function DashboardHeader({
    title,
    subtitle,
    children,
    className,
}: DashboardHeaderProps) {
    // Get current date suitable for dashboard header
    const dateStr = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div
            className={cn(
                "relative flex flex-col md:flex-row md:items-end md:justify-between py-6 px-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-neutral-900 dark:to-neutral-900/50 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden",
                className
            )}
        >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

            <div className="space-y-2 relative z-10 w-full max-w-3xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 dark:bg-blue-900/20 border border-primary/10 dark:border-blue-900/30 text-primary dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
                        <CalendarDays size={12} />
                        <span>{dateStr}</span>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
                        {subtitle}
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
