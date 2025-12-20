import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  // We can add a color prop, defaulting to a specific one or generic
  // Let's use a color classes map for simplicity and tailwind support
  variant?: "default" | "emerald" | "blue" | "amber" | "rose" | "indigo" | "purple";
  className?: string;
}

const colorMap = {
  default: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-900 dark:text-gray-100",
    iconBg: "bg-gray-100 dark:bg-gray-800", // fallback
    iconColor: "text-gray-600 dark:text-gray-400"
  },
  emerald: {
    bg: "bg-white dark:bg-neutral-900", // Card bg is usually white/dark
    text: "text-neutral-900 dark:text-neutral-100",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400"
  },
  blue: {
    bg: "bg-white dark:bg-neutral-900",
    text: "text-neutral-900 dark:text-neutral-100",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  amber: {
    bg: "bg-white dark:bg-neutral-900",
    text: "text-neutral-900 dark:text-neutral-100",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400"
  },
  rose: {
    bg: "bg-white dark:bg-neutral-900",
    text: "text-neutral-900 dark:text-neutral-100",
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400"
  },
  indigo: {
    bg: "bg-white dark:bg-neutral-900",
    text: "text-neutral-900 dark:text-neutral-100",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-600 dark:text-indigo-400"
  },
  purple: {
      bg: "bg-white dark:bg-neutral-900",
      text: "text-neutral-900 dark:text-neutral-100",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400"
  }
};

export default function PageHeader({ 
  title, 
  description, 
  icon: Icon, 
  variant = "blue",
  className,
  showDate = false
}: PageHeaderProps & { showDate?: boolean }) {
  const styles = colorMap[variant] || colorMap.default;

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className={cn(
        "bg-white dark:bg-neutral-900 shadow-sm border-none ring-1 ring-gray-200 dark:ring-neutral-800", 
        className
    )}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                {Icon && (
                    <div className={cn("p-2 rounded-lg", styles.iconBg)}>
                    <Icon className={cn("h-6 w-6", styles.iconColor)} />
                    </div>
                )}
                <span>{title}</span>
                </CardTitle>
                {description && (
                <CardDescription className="text-base mt-2">
                    {description}
                </CardDescription>
                )}
            </div>
            {showDate && (
                <div className="text-sm font-medium text-muted-foreground bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-neutral-700 hidden sm:block">
                    {today}
                </div>
            )}
        </div>
      </CardHeader>
    </Card>
  );
}
