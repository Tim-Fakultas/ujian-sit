import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="p-6">
      {/* Header Skeleton */}
      <Card className="mb-6 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
      </Card>

      {/* Table Section Skeleton */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border">
        {/* Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 mb-4">
          <Skeleton className="h-9 w-full sm:w-[250px]" /> {/* Search */}
          <div className="flex gap-2 w-full sm:w-auto">
             <Skeleton className="h-9 w-12" /> {/* Filter Button */}
             <Skeleton className="h-9 w-20" /> {/* View Mode */}
          </div>
        </div>

        {/* Table/Content Skeleton */}
        <div className="border rounded-md">
          {/* Table Header */}
          <div className="hidden md:flex items-center p-4 border-b bg-gray-50/50 dark:bg-gray-800/50 gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-[1.5]" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Table Body */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-center p-4 border-b last:border-0 gap-4"
            >
              {/* Mobile layout simulation or just simple rows */}
              <Skeleton className="hidden md:block h-4 w-8" /> {/* No */}
              
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" /> {/* Nama */}
                <Skeleton className="h-3 w-20" /> {/* NIM */}
              </div>

              <div className="flex-[1.5]">
                 <Skeleton className="h-4 w-full max-w-[200px]" /> {/* Judul */}
              </div>

              <div className="w-24">
                  <Skeleton className="h-6 w-20 rounded" /> {/* Jenis */}
              </div>
              
              <div className="w-24">
                  <Skeleton className="h-6 w-20 rounded" /> {/* Status */}
              </div>

              <div className="w-12 flex justify-end">
                   <Skeleton className="h-8 w-8 rounded-md" /> {/* Action */}
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between mt-4">
             <Skeleton className="h-4 w-40" />
             <div className="flex gap-2">
                 <Skeleton className="h-8 w-20" />
                 <Skeleton className="h-8 w-20" />
             </div>
        </div>
      </div>
    </div>
  );
}