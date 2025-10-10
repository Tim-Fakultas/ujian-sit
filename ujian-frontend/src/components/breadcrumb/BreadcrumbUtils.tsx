"use client";

import { useSetBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";

// Contoh komponen untuk halaman detail
export function ExampleDetailPage({
  title,
  parentPath,
  parentLabel,
}: {
  title: string;
  parentPath: string;
  parentLabel: string;
}) {
  const { setBreadcrumb } = useSetBreadcrumb();

  useEffect(() => {
    setBreadcrumb(
      [
        { label: "Home", href: "/" },
        { label: parentLabel, href: parentPath },
        { label: title, isActive: true },
      ],
      title
    );

    // Cleanup when component unmounts
    return () => {
      // Optional: clear custom breadcrumb when leaving page
      // clearCustomBreadcrumbs();
    };
  }, [setBreadcrumb, title, parentPath, parentLabel]);

  return null; // This is just a utility component
}

// Hook utility untuk set breadcrumb dengan pattern umum
export function useBreadcrumbForDetail(
  title: string,
  sections: Array<{ label: string; href: string }>
) {
  const { setBreadcrumb } = useSetBreadcrumb();

  useEffect(() => {
    const breadcrumbItems = [
      { label: "Home", href: "/" },
      ...sections,
      { label: title, isActive: true },
    ];

    setBreadcrumb(breadcrumbItems, title);
  }, [setBreadcrumb, title, sections]);
}

// Utility untuk breadcrumb form (create/edit)
export function useBreadcrumbForForm(
  action: "create" | "edit",
  entityName: string,
  parentSections: Array<{ label: string; href: string }>
) {
  const { setBreadcrumb } = useSetBreadcrumb();

  useEffect(() => {
    const actionLabel = action === "create" ? "Buat Baru" : "Edit";
    const title = `${actionLabel} ${entityName}`;

    const breadcrumbItems = [
      { label: "Home", href: "/" },
      ...parentSections,
      { label: actionLabel, isActive: true },
    ];

    setBreadcrumb(breadcrumbItems, title);
  }, [setBreadcrumb, action, entityName, parentSections]);
}
