"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

export function useUrlSearch(defaultSearch: string = "", delay: number = 300) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Local state for immediate input feedback
    const paramQuery = searchParams.get("q") ?? defaultSearch;
    const [search, setSearch] = useState(paramQuery);
    const [isPending, startTransition] = useTransition();

    // Sync local state if URL changes externally (e.g. back button)
    useEffect(() => {
        setSearch(paramQuery);
    }, [paramQuery]);

    const updateUrl = useCallback(
        (term: string) => {
            const params = new URLSearchParams(searchParams);
            if (term) {
                params.set("q", term);
            } else {
                params.delete("q");
            }

            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        },
        [pathname, router, searchParams]
    );

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            // Only update URL if local state is different from current URL param
            // and we are not just initializing
            if (search !== paramQuery) {
                updateUrl(search);
            }
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [search, delay, paramQuery, updateUrl]);

    return { search, setSearch, isPending };
}
