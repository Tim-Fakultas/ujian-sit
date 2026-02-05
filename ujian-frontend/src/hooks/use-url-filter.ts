"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

/**
 * Hook to manage a specific URL query parameter for filtering.
 * Unlike useUrlSearch, this updates immediately (no debounce).
 *
 * @param key The query parameter key (e.g., 'status', 'page')
 * @param defaultValue The default value (will be removed from URL if matches)
 * @returns [value, setValue, isPending]
 */
export function useUrlFilter(key: string, defaultValue: string = "all") {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const value = searchParams.get(key) ?? defaultValue;

    const setValue = useCallback(
        (newValue: string) => {
            const params = new URLSearchParams(searchParams);

            if (newValue && newValue !== defaultValue) {
                params.set(key, newValue);
            } else {
                params.delete(key);
            }

            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        },
        [key, defaultValue, pathname, router, searchParams]
    );

    return [value, setValue, isPending] as const;
}
