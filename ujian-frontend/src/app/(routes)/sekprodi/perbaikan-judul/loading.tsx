import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="p-6">
      {/* Page Header Skeleton */}
      <div className="mb-6 flex flex-col gap-2">
         <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
               <Skeleton className="h-6 w-48 mb-1" />
               <Skeleton className="h-4 w-72" />
            </div>
         </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm">
        {/* Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 mb-6">
          <Skeleton className="h-10 w-full sm:w-[300px] rounded-lg" /> {/* Search */}
           <div className="flex gap-2 w-full sm:w-auto">
             <Skeleton className="h-10 w-10 rounded-lg" /> {/* Filter Button */}
             <Skeleton className="h-10 w-24 rounded-lg" /> {/* Tab Button */}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="border border-gray-100 dark:border-neutral-800 rounded-xl overflow-hidden">
           {/* Table Header */}
           <div className="hidden md:flex items-center p-4 bg-gray-50/50 dark:bg-neutral-800/50 gap-4 border-b border-gray-100 dark:border-neutral-800">
            <Skeleton className="h-4 w-8" />   {/* No */}
            <Skeleton className="h-4 w-24" />  {/* Tanggal */}
            <Skeleton className="h-4 w-40" />  {/* Mahasiswa */}
            <Skeleton className="h-4 flex-1" /> {/* Judul Lama */}
            <Skeleton className="h-4 flex-1" /> {/* Judul Baru */}
            <Skeleton className="h-4 w-24" />  {/* Status */}
            <Skeleton className="h-4 w-32" />  {/* Aksi */}
          </div>

          {/* Table Body */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-center p-4 border-b border-gray-100 dark:border-neutral-800 last:border-0 gap-4 bg-white dark:bg-neutral-900"
            >
              {/* No */}
              <div className="hidden md:block w-8">
                  <Skeleton className="h-4 w-4 mx-auto" />
              </div>

               {/* Tanggal */}
               <div className="w-24">
                  <Skeleton className="h-4 w-20" />
              </div>

              {/* Mahasiswa */}
              <div className="w-40 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>

               {/* Judul Lama */}
               <div className="flex-1">
                 <Skeleton className="h-4 w-full max-w-[200px]" />
                 <Skeleton className="h-3 w-1/2 mt-1.5" />
              </div>
              
              {/* Judul Baru */}
               <div className="flex-1">
                 <Skeleton className="h-4 w-full max-w-[200px]" />
                 <Skeleton className="h-3 w-1/2 mt-1.5" />
              </div>

              {/* Status */}
              <div className="w-24">
                  <Skeleton className="h-6 w-20 rounded-md" />
              </div>

              {/* Aksi */}
              <div className="w-32">
                   <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
             <Skeleton className="h-4 w-48" />
             <div className="flex gap-2">
                 <Skeleton className="h-9 w-24 rounded-lg" />
                 <Skeleton className="h-9 w-24 rounded-lg" />
             </div>
        </div>
      </div>
    </div>
  );
}
