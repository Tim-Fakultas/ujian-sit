"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AngkatanFilterProps {
    selectedYears: string[];
    onYearChange: (years: string[]) => void;
}

export default function AngkatanFilter({ selectedYears, onYearChange }: AngkatanFilterProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from(
        { length: currentYear - 2016 + 1 },
        (_, i) => (currentYear - i).toString()
    );

    const toggleYear = (year: string) => {
        if (selectedYears.includes(year)) {
            onYearChange(selectedYears.filter((y) => y !== year));
        } else {
            onYearChange([...selectedYears, year]);
        }
    };

    const reset = () => onYearChange([]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-dashed shrink-0 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors"
                >
                    <Filter className="mr-2 h-4 w-4" />
                    <span className="text-xs font-medium">Angkatan</span>
                    {selectedYears.length > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4 bg-slate-200 dark:bg-neutral-700" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden bg-primary/10 text-primary border-none"
                            >
                                {selectedYears.length}
                            </Badge>
                            <div className="hidden lg:flex gap-1 overflow-hidden">
                                {selectedYears.length > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal bg-primary/10 text-primary border-none"
                                    >
                                        {selectedYears.length} dipilih
                                    </Badge>
                                ) : (
                                    selectedYears.map((year) => (
                                        <Badge
                                            variant="secondary"
                                            key={year}
                                            className="rounded-sm px-1 font-normal bg-primary/10 text-primary border-none"
                                        >
                                            {year}
                                        </Badge>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0" align="end">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between p-2 border-b">
                        <span className="text-xs font-semibold">Tahun Angkatan</span>
                        {selectedYears.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={reset}
                                className="h-auto p-1 text-[10px] text-muted-foreground hover:text-foreground"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                    <ScrollArea className="h-64">
                        <div className="p-2 space-y-2">
                            {years.map((year) => (
                                <div key={year} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`year-${year}`}
                                        checked={selectedYears.includes(year)}
                                        onCheckedChange={() => toggleYear(year)}
                                    />
                                    <Label
                                        htmlFor={`year-${year}`}
                                        className="text-sm font-normal cursor-pointer flex-1"
                                    >
                                        {year}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
}
