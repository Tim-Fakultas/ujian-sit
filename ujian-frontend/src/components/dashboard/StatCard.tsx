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
        bg: "bg-primary/5 dark:bg-blue-900/10",
        text: "text-primary dark:text-blue-400",
        border: "border-primary/20 dark:border-blue-800/50",
        ring: "group-hover:ring-primary/20 dark:group-hover:ring-blue-900/30",
    },
    emerald: {
        bg: "bg-primary/5 dark:bg-blue-900/10",
        text: "text-primary dark:text-blue-400",
        border: "border-primary/20 dark:border-blue-800/50",
        ring: "group-hover:ring-primary/20 dark:group-hover:ring-blue-900/30",
    },
    amber: {
        bg: "bg-primary/5 dark:bg-blue-900/10",
        text: "text-primary dark:text-blue-400",
        border: "border-primary/20 dark:border-blue-800/50",
        ring: "group-hover:ring-primary/20 dark:group-hover:ring-blue-900/30",
    },
    violet: {
        bg: "bg-primary/5 dark:bg-blue-900/10",
        text: "text-primary dark:text-blue-400",
        border: "border-primary/20 dark:border-blue-800/50",
        ring: "group-hover:ring-primary/20 dark:group-hover:ring-blue-900/30",
    },
    rose: {
        bg: "bg-primary/5 dark:bg-blue-900/10",
        text: "text-primary dark:text-blue-400",
        border: "border-primary/20 dark:border-blue-800/50",
        ring: "group-hover:ring-primary/20 dark:group-hover:ring-blue-900/30",
    },
    slate: {
        bg: "bg-primary/5 dark:bg-blue-900/10",
        text: "text-primary dark:text-blue-400",
        border: "border-primary/20 dark:border-blue-800/50",
        ring: "group-hover:ring-primary/20 dark:group-hover:ring-blue-900/30",
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
