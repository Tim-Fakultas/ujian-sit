
import { Skeleton } from "@/components/ui/skeleton";
import { DataCard } from "@/components/common/DataCard";

export default function Loading() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* PageHeader Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-1">
             <Skeleton className="h-7 w-64" />
             <Skeleton className="h-4 w-96" />
          </div>
        </div>
      </div>

      <DataCard>
        {/* Toolbar Skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
           <Skeleton className="h-10 w-full sm:max-w-xs rounded-lg" />
           <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-lg border overflow-hidden">
           {/* Header */}
           <div className="h-12 bg-gray-50 dark:bg-neutral-800 border-b flex items-center px-4 gap-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
           </div>
           
           {/* Rows */}
           {Array.from({ length: 5 }).map((_, i) => (
             <div key={i} className="h-16 border-b last:border-0 flex items-center px-4 gap-4">
                <Skeleton className="h-4 w-8" />
                <div className="flex-1 space-y-2">
                   <Skeleton className="h-4 w-32" />
                   <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-24 rounded" />
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-4 w-16 text-center" />
                <Skeleton className="h-4 w-16 text-center" />
                <Skeleton className="h-8 w-8 ml-auto" />
             </div>
           ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between pt-4">
           <Skeleton className="h-4 w-48" />
           <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
           </div>
        </div>
      </DataCard>
    </div>
  );
}
