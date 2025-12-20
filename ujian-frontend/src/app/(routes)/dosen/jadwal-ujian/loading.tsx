
import { Skeleton } from "@/components/ui/skeleton";

export default function JadwalUjianLoading() {
  return (
    <div className="p-6">
      {/* Page Header Skeleton */}
      <div className="flex flex-col gap-2 mb-6">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-5 w-72 rounded-md" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Skeleton className="h-10 w-64 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-slate-50/50 dark:bg-neutral-800/50">
          <Skeleton className="col-span-1 h-5 w-8" />
          <Skeleton className="col-span-3 h-5 w-24" />
          <Skeleton className="col-span-3 h-5 w-32" />
          <Skeleton className="col-span-2 h-5 w-16" />
          <Skeleton className="col-span-2 h-5 w-20" />
          <Skeleton className="col-span-1 h-5 w-10" />
        </div>

        {/* Table Body Rows */}
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center">
              <Skeleton className="col-span-1 h-4 w-4" />
              <div className="col-span-3 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="col-span-3 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="col-span-2 h-8 w-24 rounded-full" />
              <Skeleton className="col-span-2 h-4 w-24" />
              <Skeleton className="col-span-1 h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>

        {/* Table Item Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
                 <Skeleton className="h-8 w-8 rounded-md" />
                 <Skeleton className="h-8 w-8 rounded-md" />
            </div>
        </div>
      </div>
    </div>
  );
}