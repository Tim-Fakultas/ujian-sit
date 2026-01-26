"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DosenOption {
    id: number;
    nama: string;
}

interface DosenComboboxProps {
    value: number | null;
    onChange: (val: number) => void;
    options: DosenOption[];
    placeholder?: string;
    disabled?: boolean;
    excludeIds?: number[];
}

export function DosenCombobox({
    value,
    onChange,
    options,
    placeholder = "Pilih Dosen...",
    disabled = false,
    excludeIds = [],
}: DosenComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = options.filter(
        (opt) =>
            !excludeIds.includes(opt.id) &&
            opt.nama.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find((opt) => opt.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="w-full justify-between font-normal dark:bg-[#1f1f1f] dark:text-gray-100 dark:border-neutral-700 h-10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {selectedOption ? (
                        <span className="truncate">{selectedOption.nama}</span>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 dark:bg-[#1f1f1f] dark:border-neutral-700">
                <div className="flex items-center border-b px-3 dark:border-neutral-700">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 dark:text-gray-400" />
                    <input
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100"
                        placeholder="Cari dosen..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="max-h-[200px] overflow-y-auto p-1">
                    {filteredOptions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Tidak ada dosen ditemukan.
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <div
                                key={option.id}
                                className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer",
                                    value === option.id && "bg-slate-100 dark:bg-neutral-800"
                                )}
                                onClick={() => {
                                    onChange(option.id);
                                    setOpen(false);
                                    setSearch("");
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.nama}
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
