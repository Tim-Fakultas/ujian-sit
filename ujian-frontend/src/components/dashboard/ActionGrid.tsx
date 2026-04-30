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
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white",
    emerald: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white",
    amber: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white",
    violet: "text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white",
    rose: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white",
    slate: "text-slate-600 bg-slate-100 dark:bg-slate-900/30 dark:text-slate-400 group-hover:bg-slate-600 group-hover:text-white",
};

export function ActionCard({ item, className }: { item: ActionItem, className?: string }) {
    const Icon = item.icon;
    const colorClass = colorMap[item.color || "blue"];

    return (
        <Link href={item.href} className={cn("block group h-full outline-none", className)}>
            <Card className="h-full p-6 flex flex-col items-start gap-5 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 border-border/50 hover:border-primary/20 relative overflow-hidden">
                <div className={cn("p-4 rounded-2xl transition-all duration-500 transform group-hover:scale-110", colorClass)}>
                    <Icon size={28} strokeWidth={1.5} />
                </div>

                <div className="space-y-2 flex-1 relative z-10">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        {item.label}
                        <ArrowRight size={18} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-primary" />
                    </h3>
                    {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                            {item.description}
                        </p>
                    )}
                </div>
                
                {/* Decorative background element */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
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
        <div className={cn("grid gap-6", gridCols[columns], "auto-rows-fr", className)}>
            {items.map((item, idx) => (
                <ActionCard key={idx} item={item} />
            ))}
        </div>
    );
}

