import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    label?: string; // Optional small label below value
    icon?: LucideIcon;
    trend?: {
        value: number; // e.g. 12
        isPositive: boolean;
    };
    className?: string;
    color?: "blue" | "emerald" | "amber" | "violet" | "rose" | "slate"; // Theme color accent
}

const colorMap = {
    blue: {
        bg: "bg-blue-50 dark:bg-blue-900/10",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-100 dark:border-blue-800/50",
        ring: "group-hover:ring-blue-100 dark:group-hover:ring-blue-900/30",
    },
    emerald: {
        bg: "bg-emerald-50 dark:bg-emerald-900/10",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-100 dark:border-emerald-800/50",
        ring: "group-hover:ring-emerald-100 dark:group-hover:ring-emerald-900/30",
    },
    amber: {
        bg: "bg-amber-50 dark:bg-amber-900/10",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-100 dark:border-amber-800/50",
        ring: "group-hover:ring-amber-100 dark:group-hover:ring-amber-900/30",
    },
    violet: {
        bg: "bg-violet-50 dark:bg-violet-900/10",
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-100 dark:border-violet-800/50",
        ring: "group-hover:ring-violet-100 dark:group-hover:ring-violet-900/30",
    },
    rose: {
        bg: "bg-rose-50 dark:bg-rose-900/10",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-100 dark:border-rose-800/50",
        ring: "group-hover:ring-rose-100 dark:group-hover:ring-rose-900/30",
    },
    slate: {
        bg: "bg-slate-50 dark:bg-slate-900/10",
        text: "text-slate-600 dark:text-slate-400",
        border: "border-slate-100 dark:border-slate-800/50",
        ring: "group-hover:ring-slate-100 dark:group-hover:ring-slate-900/30",
    },
};

export function StatCard({
    title,
    value,
    label,
    icon: Icon,
    className,
    color = "blue",
}: StatCardProps) {
    const theme = colorMap[color];

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-md border",
                "group hover:-translate-y-0.5",
                theme.border,
                className
            )}
        >
            <CardContent className="p-6">
                <div className="flex items-start justify-between space-x-4">
                    <div className="flex flex-col">
                        <p className="text-sm font-medium text-muted-foreground tracking-wide">
                            {title}
                        </p>
                        <div className="mt-4 flex flex-col gap-1">
                            <h3 className="text-2xl font-bold tracking-tight text-foreground leading-none">
                                {value}
                            </h3>
                            {label && (
                                <p className="text-xs font-medium text-muted-foreground">
                                    {label}
                                </p>
                            )}
                        </div>
                    </div>
                    {Icon && (
                        <div className={cn("p-2.5 rounded-xl transition-colors shrink-0", theme.bg, theme.text)}>
                            <Icon size={20} strokeWidth={2} />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
