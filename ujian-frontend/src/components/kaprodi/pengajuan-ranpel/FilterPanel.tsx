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
  const activeCount = filters.angkatan !== "all" ? 1 : 0;
  const hasActiveFilter = activeCount > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 border-dashed gap-2 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <ListFilter size={16} />
          <span className="text-sm font-medium">Filter</span>
          <FilterBadge count={activeCount} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" side="top" className="w-[300px] p-4 shadow-xl border-slate-200 dark:border-neutral-800">
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
                    angkatan: "all",
                  })
                }
                className="h-7 px-2 text-[11px] font-extrabold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors uppercase tracking-widest"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Angkatan Filter (Renamed to Tahun Ajaran) */}
          <div className="space-y-5 py-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                TAHUN AJARAN
              </label>
              <div className="bg-primary/10 text-primary text-[11px] font-black px-3 py-1 rounded-full border border-primary/20">
                {filters.angkatan === "all" ? "SEMUA" : filters.angkatan}
              </div>
            </div>
            
            <div className="px-1.5">
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
              <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400">
                <span className="bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{MIN_ANGKATAN_YEAR}</span>
                <span className="bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{MAX_ANGKATAN_YEAR}</span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground italic font-medium text-center pt-2">
              Geser untuk memfilter pengajuan berdasarkan tahun ajaran.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
