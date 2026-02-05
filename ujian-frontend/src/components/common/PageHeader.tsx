"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, Users, BookOpen, Calendar, Settings, BarChart, Home, User, Bookmark, UserCircle, GraduationCap, ListChecks, LayoutDashboard, University, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  iconName?: string; // Changed from LucideIcon to string

  // We can add a color prop, defaulting to a specific one or generic
  // Let's use a color classes map for simplicity and tailwind support
  variant?: "default" | "emerald" | "blue" | "amber" | "rose" | "indigo" | "purple";
  className?: string;
}

const colorMap = {
  default: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-900 dark:text-gray-100",
    iconBg: "bg-gray-100 dark:bg-gray-800clear", // fallback
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
    iconBg: "bg-primary/10 dark:bg-primary/30",
    iconColor: "text-primary dark:text-primary"
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

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Users,
  BookOpen,
  Calendar,
  Settings,
  BarChart,
  Home,
  User,
  Clock,
  Bookmark,
  UserCircle,
  GraduationCap,
  ListChecks,
  LayoutDashboard,
  University,
  PencilLine,
};

export default function PageHeader({
  title,
  description,
  iconName,
  variant = "blue",
  className,
  showDate = false
}: PageHeaderProps & { showDate?: boolean }) {
  const styles = colorMap[variant] || colorMap.default;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const today = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Get the icon component from the map
  const Icon = iconName ? iconMap[iconName] : null;

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
              <span className="text-xl md:text-2xl">{title}</span>
            </CardTitle>
            {description && (
              <CardDescription className="text-base mt-2">
                {description}
              </CardDescription>
            )}
          </div>
          {showDate && (
            <div className="hidden sm:flex flex-col gap-1 items-end">
              <div className="text-sm font-medium text-muted-foreground bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-neutral-700">
                {today}
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white bg-primary/5 dark:bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/10 dark:border-primary/30 flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-primary dark:text-primary" />
                {time}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
