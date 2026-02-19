"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings2,
  Check,
  Calendar as CalendarIcon,
  FileDown,
} from "lucide-react";
import Search from "@/components/common/Search";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  title: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface DataTableFilterProps {
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Filters (Popover)
  filters?: FilterConfig[];

  // Date Filter (Optional)
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;

  // PDF Export (Optional)
  onExport?: () => void;

  // Custom Actions (e.g. "Add" button)
  actions?: React.ReactNode;
  className?: string;
}

export function DataTableFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari data...",
  filters = [],
  date,
  onDateChange,
  onExport,
  actions,
  className,
}: DataTableFilterProps) {
  const [openFilter, setOpenFilter] = useState(false);

  const isControlledSearch =
    searchValue !== undefined && onSearchChange !== undefined;

  const hasActiveFilters = filters.some((f) => f.value !== "all");

  return (
    <div
      className={cn(
        "flex items-center gap-2 mb-4 w-full md:justify-end",
        className,
      )}
    >
      {/* Search Input using unified Component */}
      <Search
        className="flex-1 w-full md:flex-none md:w-[300px]"
        placeholder={searchPlaceholder}
        disableUrlParams={isControlledSearch}
        value={searchValue}
        onChange={onSearchChange!}
      />
      <div className="flex items-center gap-2 shrink-0">
        {/* Date Filter */}
        {onDateChange && (
          <div className={cn("grid gap-2")}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  size="sm"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal h-9 bg-white dark:bg-neutral-800",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd LLL y")} -{" "}
                        {format(date.to, "dd LLL y")}
                      </>
                    ) : (
                      format(date.from, "dd LLL y")
                    )
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={onDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* PDF Export */}
        {onExport && (
          <Button
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium bg-primary hover:bg-primary/90"
            onClick={onExport}
          >
            <FileDown size={14} />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        )}

        {/* Filters Popover */}
        {filters.length > 0 && (
          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            <PopoverTrigger asChild>
              <Button
                variant={hasActiveFilters ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-md border-dashed bg-white dark:bg-neutral-800",
                  hasActiveFilters &&
                    "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
                )}
              >
                <Settings2 size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[200px] p-0">
              <ScrollArea className="max-h-[300px] p-1">
                {filters.map((group, idx) => (
                  <div key={group.key}>
                    {idx > 0 && <div className="my-1 h-px bg-border" />}
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      {group.title}
                    </div>
                    {group.options.map((opt) => (
                      <Button
                        key={opt.value}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-between h-8 px-2 font-normal",
                          group.value === opt.value
                            ? "bg-accent text-accent-foreground font-medium"
                            : "",
                        )}
                        onClick={() => {
                          group.onChange(opt.value);
                          // We don't close popover to allow specific multi-filter selection if desired,
                          // but single select per group implies we might want to keep it open or close it.
                          // For now keep open to easier change multiple filters.
                        }}
                      >
                        <span className="text-sm truncate">{opt.label}</span>
                        {group.value === opt.value && (
                          <Check size={14} className="ml-auto shrink-0" />
                        )}
                      </Button>
                    ))}
                  </div>
                ))}
              </ScrollArea>
              {hasActiveFilters && (
                <div className="border-t p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      filters.forEach((f) => f.onChange("all"));
                      setOpenFilter(false);
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}

        {/* Custom Actions */}
        {actions}
      </div>
    </div>
  );
}
