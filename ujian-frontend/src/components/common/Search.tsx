"use client";

import { useUrlSearch } from "@/hooks/use-url-search";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchProps {
    placeholder?: string;
    className?: string;
    /**
     * Jika true, menggunakan state lokal, bukan URL.
     * Default: false (menggunakan URL search param 'q')
     */
    disableUrlParams?: boolean;
    value?: string;
    onChange?: (value: string) => void;
}

export default function Search({
    placeholder = "Cari...",
    className,
    disableUrlParams = false,
    value: controlledValue,
    onChange: controlledOnChange,
}: SearchProps) {
    // Hook selalu dipanggil, tapi kita abaikan jika disableUrlParams true
    const { search: urlSearch, setSearch: setUrlSearch } = useUrlSearch();

    const isControlled = disableUrlParams && controlledValue !== undefined;

    // Jika controlled, gunakan props. Jika tidak, gunakan URL state.
    const searchValue = isControlled ? controlledValue : urlSearch;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (disableUrlParams) {
            controlledOnChange?.(val);
        } else {
            setUrlSearch(val);
        }
    };

    return (
        <div className={cn("relative w-full sm:max-w-sm", className)}>
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                value={searchValue}
                onChange={handleSearchChange}
                className="pl-9 bg-white dark:bg-neutral-800"
            />
        </div>
    );
}
