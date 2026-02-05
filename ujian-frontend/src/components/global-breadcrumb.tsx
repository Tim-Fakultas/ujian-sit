"use client";

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { capitalize } from "@/utils/path";
import React from "react";

export function GlobalBreadcrumb() {
    const pathname = usePathname();

    // Split pathname, remove empty strings
    const segments = pathname.split("/").filter(Boolean);

    // If no segments (e.g. root), don't render or render Home
    if (segments.length === 0) {
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Optional: Add Home icon or link if needed, for now starting from first segment matching sidebar structure */}

                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    const label = capitalize(segment);

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-semibold text-neutral-800 dark:text-gray-100 line-clamp-1">
                                        {label}
                                    </BreadcrumbPage>
                                ) : index === 0 ? (
                                    <span className="hidden md:block text-muted-foreground cursor-default">
                                        {label}
                                    </span>
                                ) : (
                                    <BreadcrumbLink
                                        href={href}
                                        className="hidden md:block transition-colors hover:text-foreground"
                                    >
                                        {label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
