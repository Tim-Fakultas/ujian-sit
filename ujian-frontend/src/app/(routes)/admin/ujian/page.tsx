import PageHeader from "@/components/common/PageHeader";
import { Suspense } from "react";
import UjianTableWrapper from "./UjianTableWrapper";
import AdminUjianTableSkeleton from "@/components/admin/ujian/AdminUjianTableSkeleton";

export default function AdminUjianPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Ujian"
        description=""
        iconName="FileText"
        variant="blue"
        className="mb-6"
      />
      <Suspense fallback={<AdminUjianTableSkeleton />}>
        <UjianTableWrapper />
      </Suspense>
    </div>
  );
}
