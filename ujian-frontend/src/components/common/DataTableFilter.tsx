"use client";

import {
  Search,
  Settings2,
  CheckCircle2,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  label: string;
  key: string; // identifier for the group type, e.g., "status"
  options: FilterOption[];
}

interface DataTableFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  
  // Array of filter groups to display in the dropdown
  filterGroups?: FilterGroup[];
  
  // Current filter state
  selectedFilterType?: string; 
  selectedFilterValue?: string;
  onFilterChange?: (type: string, value: string) => void;

  // View mode toggles
  viewMode?: "table" | "card";
  onViewModeChange?: (mode: "table" | "card") => void;

  children?: React.ReactNode;
  className?: string;
}

export function DataTableFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterGroups = [],
  selectedFilterType,
  selectedFilterValue,
  onFilterChange,
  viewMode,
  onViewModeChange,
  children,
  className,
}: DataTableFilterProps) {
  return (
    <div className={cn("flex flex-col gap-2 mb-4", className)}>
      <div className="flex flex-row items-center gap-2 w-full">
        {/* Search Input */}
        <div className="relative flex-1 flex items-center min-w-0">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full bg-white dark:bg-[#1f1f1f]"
            aria-label="Search"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Dropdown */}
        {(filterGroups.length > 0 || children) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-3 rounded-lg border flex items-center gap-2 bg-white dark:bg-[#1f1f1f]"
                aria-label="Filter"
              >
                <Settings2 size={18} />
                <span className="hidden sm:inline text-xs font-medium">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] p-0">
              <ScrollArea className="max-h-[300px] p-1">
                {children ? (
                  children
                ) : (
                  filterGroups.map((group, index) => (
                    <div key={group.key}>
                      {index > 0 && <div className="h-px bg-gray-100 dark:bg-neutral-800 my-1" />}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {group.label}
                      </div>
                      {group.options.map((opt) => (
                        <DropdownMenuItem
                          key={`${group.key}-${opt.value}`}
                          onClick={() => onFilterChange?.(group.key, opt.value)}
                          className="flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <span className="text-sm">{opt.label}</span>
                          {selectedFilterType === group.key &&
                            selectedFilterValue === opt.value && (
                              <CheckCircle2 size={14} className="text-emerald-500" />
                            )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* View Mode Toggle */}
        {viewMode && onViewModeChange && (
          <Tabs
            value={viewMode}
            onValueChange={(v) => onViewModeChange(v as "table" | "card")}
          >
            <TabsList className="h-9">
              <TabsTrigger value="table" className="h-7 px-2.5">
                <LayoutGrid size={16} />
              </TabsTrigger>
              <TabsTrigger value="card" className="h-7 px-2.5">
                <List size={16} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
    </div>
  );
}
