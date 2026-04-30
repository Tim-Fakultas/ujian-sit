import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    label?: string; // Optional small label below value
    icon?: LucideIcon;
    trend?: {
        value: string | number;
        label: string;
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
        ring: "group-hover:ring-blue-500/10",
        icon: "bg-blue-100 dark:bg-blue-900/30",
    },
    emerald: {
        bg: "bg-emerald-50 dark:bg-emerald-900/10",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-100 dark:border-emerald-800/50",
        ring: "group-hover:ring-emerald-500/10",
        icon: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    amber: {
        bg: "bg-amber-50 dark:bg-amber-900/10",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-100 dark:border-amber-800/50",
        ring: "group-hover:ring-amber-500/10",
        icon: "bg-amber-100 dark:bg-amber-900/30",
    },
    violet: {
        bg: "bg-violet-50 dark:bg-violet-900/10",
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-100 dark:border-violet-800/50",
        ring: "group-hover:ring-violet-500/10",
        icon: "bg-violet-100 dark:bg-violet-900/30",
    },
    rose: {
        bg: "bg-rose-50 dark:bg-rose-900/10",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-100 dark:border-rose-800/50",
        ring: "group-hover:ring-rose-500/10",
        icon: "bg-rose-100 dark:bg-rose-900/30",
    },
    slate: {
        bg: "bg-slate-50 dark:bg-slate-900/10",
        text: "text-slate-600 dark:text-slate-400",
        border: "border-slate-100 dark:border-slate-800/50",
        ring: "group-hover:ring-slate-500/10",
        icon: "bg-slate-100 dark:bg-slate-900/30",
    },
};

export function StatCard({
    title,
    value,
    label,
    icon: Icon,
    className,
    color = "blue",
    trend,
}: StatCardProps) {
    const theme = colorMap[color];

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-border/50",
                "group hover:-translate-y-1",
                className
            )}
        >
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-muted-foreground tracking-tight uppercase">
                                {title}
                            </p>
                            <h3 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                            </h3>
                        </div>

                        {(trend || label) && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {trend && (
                                    <div className={cn(
                                        "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
                                        trend.isPositive 
                                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" 
                                            : "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
                                    )}>
                                        {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {trend.value}
                                    </div>
                                )}
                                {trend?.label && (
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {trend.label}
                                    </span>
                                )}
                                {label && !trend && (
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {label}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {Icon && (
                        <div className={cn(
                            "p-4 rounded-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 shrink-0", 
                            theme.icon, 
                            theme.text
                        )}>
                            <Icon size={24} strokeWidth={2.5} />
                        </div>
                    )}
                </div>
            </CardContent>
            
            {/* Subtle bottom accent line */}
            <div className={cn("absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300", theme.text.split(' ')[0].replace('text', 'bg'))} />
        </Card>
    );
}

