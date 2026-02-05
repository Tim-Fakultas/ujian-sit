import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ActionItem {
    label: string;
    icon: LucideIcon;
    href: string;
    description?: string;
    color?: "blue" | "emerald" | "amber" | "violet" | "rose" | "slate";
}

interface ActionGridProps {
    items: ActionItem[];
    columns?: 2 | 3 | 4; // grid-cols config
    className?: string;
}

const colorMap = {
    blue: "text-primary dark:text-blue-400 group-hover:bg-primary/5 dark:group-hover:bg-blue-900/20",
    emerald: "text-primary dark:text-blue-400 group-hover:bg-primary/5 dark:group-hover:bg-blue-900/20",
    amber: "text-primary dark:text-blue-400 group-hover:bg-primary/5 dark:group-hover:bg-blue-900/20",
    violet: "text-primary dark:text-blue-400 group-hover:bg-primary/5 dark:group-hover:bg-blue-900/20",
    rose: "text-primary dark:text-blue-400 group-hover:bg-primary/5 dark:group-hover:bg-blue-900/20",
    slate: "text-primary dark:text-blue-400 group-hover:bg-primary/5 dark:group-hover:bg-blue-900/20",
};

export function ActionCard({ item, className }: { item: ActionItem, className?: string }) {
    const Icon = item.icon;
    const colorClass = colorMap[item.color || "blue"];

    return (
        <Link href={item.href} className={cn("block group h-full outline-none", className)}>
            <Card className="h-full p-5 flex flex-col items-start gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-border/60 hover:border-border">
                <div className={cn("p-3 rounded-xl transition-colors bg-muted/50", colorClass)}>
                    <Icon size={24} strokeWidth={1.5} />
                </div>

                <div className="space-y-1 flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        {item.label}
                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-muted-foreground" />
                    </h3>
                    {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {item.description}
                        </p>
                    )}
                </div>
            </Card>
        </Link>
    )
}

export function ActionGrid({ items, columns = 4, className }: ActionGridProps) {
    const gridCols = {
        2: "sm:grid-cols-2",
        3: "sm:grid-cols-2 lg:grid-cols-3",
        4: "sm:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div className={cn("grid gap-4", gridCols[columns], "auto-rows-fr", className)}>
            {items.map((item, idx) => (
                <ActionCard key={idx} item={item} />
            ))}
        </div>
    );
}
