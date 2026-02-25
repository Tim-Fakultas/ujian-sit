"use client";

import { X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerModalProps {
  isOpen: boolean;
  dateRange: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  onClose: () => void;
}

export function DatePickerModal({
  isOpen,
  dateRange,
  onSelect,
  onClose,
}: DatePickerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-zinc-950 rounded-lg shadow-xl max-w-fit"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Tutup</span>
        </button>

        <div className="p-6">
          <div className="pb-4 border-b mb-4">
            <h2 className="text-lg font-semibold">Pilih Rentang Tanggal</h2>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onSelect}
            numberOfMonths={2}
            pagedNavigation
            showOutsideDays={false}
            className="p-0"
          />
        </div>
      </div>
    </div>
  );
}
