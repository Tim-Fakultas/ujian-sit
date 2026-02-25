"use client";

import { format } from "date-fns";
import { ListFilter, Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FilterState } from "./types";
import {
  STATUS_OPTIONS,
  MIN_ANGKATAN_YEAR,
  MAX_ANGKATAN_YEAR,
} from "./constants";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (partial: Partial<FilterState>) => void;
  onOpenDatePicker: () => void;
}

function FilterBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
      {count}
    </span>
  );
}

export function FilterPanel({
  filters,
  onFilterChange,
  onOpenDatePicker,
}: FilterPanelProps) {
  const activeCount =
    (filters.status !== "all" ? 1 : 0) +
    (filters.angkatan !== "all" ? 1 : 0) +
    (filters.dateRange ? 1 : 0);

  const hasActiveFilter = activeCount > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 border-dashed gap-2"
        >
          <ListFilter size={16} />
          <span className="text-sm font-medium">Filter</span>
          <FilterBadge count={activeCount} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" side="top" className="w-[320px] p-4">
        <ScrollArea className="h-80 -mr-4 pr-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 mb-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                DATA FILTER
              </h4>
              {hasActiveFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onFilterChange({
                      status: "all",
                      angkatan: "all",
                      dateRange: undefined,
                    })
                  }
                  className="h-7 px-2 text-[11px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors uppercase tracking-widest"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Status Filter */}
            <div className="space-y-2.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                STATUS PENGAJUAN
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onFilterChange({ status: opt.value })}
                    className={`cursor-pointer rounded-lg border px-3 py-2 text-[11px] font-bold transition-all flex items-center gap-2.5 ${
                      filters.status === opt.value
                        ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                        : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-neutral-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${filters.status === opt.value ? "bg-white" : opt.color}`}
                    />
                    {opt.label.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Angkatan Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  TAHUN ANGKATAN
                </label>
                <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {filters.angkatan === "all" ? "SEMUA" : filters.angkatan}
                </div>
              </div>
              <Slider
                min={MIN_ANGKATAN_YEAR}
                max={MAX_ANGKATAN_YEAR}
                step={1}
                value={[
                  filters.angkatan === "all"
                    ? MIN_ANGKATAN_YEAR
                    : parseInt(filters.angkatan),
                ]}
                onValueChange={([val]) =>
                  onFilterChange({ angkatan: String(val) })
                }
                className="py-1 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-bold text-slate-400 px-1">
                <span>{MIN_ANGKATAN_YEAR}</span>
                <span>{MAX_ANGKATAN_YEAR}</span>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                TANGGAL PENGAJUAN
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenDatePicker}
                className={`w-full justify-start text-left font-bold text-[11px] h-10 rounded-lg border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-neutral-800 ${
                  !filters.dateRange && "text-slate-400"
                }`}
              >
                <CalendarIcon
                  className={`mr-2 h-3.5 w-3.5 ${filters.dateRange ? "text-primary" : "text-slate-400"}`}
                />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <span className="text-slate-700 dark:text-slate-200 uppercase tracking-tighter">
                      {format(filters.dateRange.from, "dd MMM y")} –{" "}
                      {format(filters.dateRange.to, "dd MMM y")}
                    </span>
                  ) : (
                    <span className="text-slate-700 dark:text-slate-200 uppercase tracking-tighter">
                      {format(filters.dateRange.from, "dd MMM y")}
                    </span>
                  )
                ) : (
                  "PILIH RENTANG TANGGAL"
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
