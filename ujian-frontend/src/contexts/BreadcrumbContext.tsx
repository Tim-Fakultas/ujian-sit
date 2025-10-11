"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CustomBreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbContextType {
  customBreadcrumbs: CustomBreadcrumbItem[];
  setCustomBreadcrumbs: (breadcrumbs: CustomBreadcrumbItem[]) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
  clearCustomBreadcrumbs: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState<
    CustomBreadcrumbItem[]
  >([]);
  const [pageTitle, setPageTitle] = useState<string>("");

  const clearCustomBreadcrumbs = () => {
    setCustomBreadcrumbs([]);
    setPageTitle("");
  };

  return (
    <BreadcrumbContext.Provider
      value={{
        customBreadcrumbs,
        setCustomBreadcrumbs,
        pageTitle,
        setPageTitle,
        clearCustomBreadcrumbs,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error(
      "useBreadcrumbContext must be used within a BreadcrumbProvider"
    );
  }
  return context;
}

// Hook untuk halaman yang ingin mengeset custom breadcrumb
export function useSetBreadcrumb() {
  const { setCustomBreadcrumbs, setPageTitle, clearCustomBreadcrumbs } =
    useBreadcrumbContext();

  const setBreadcrumb = (
    breadcrumbs: CustomBreadcrumbItem[],
    title?: string
  ) => {
    setCustomBreadcrumbs(breadcrumbs);
    if (title) setPageTitle(title);
  };

  return {
    setBreadcrumb,
    setPageTitle,
    clearCustomBreadcrumbs,
  };
}
