
import { Skeleton } from "@/components/ui/skeleton";
import { DataCard } from "@/components/common/DataCard";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
         <Skeleton className="h-8 w-48" />
         <Skeleton className="h-4 w-72" />
      </div>

      <DataCard>
         <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
             <Skeleton className="h-10 w-full sm:w-64" />
             <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
             </div>
         </div>
         
         <div className="rounded-md border">
            <div className="h-12 border-b bg-muted/50 px-4 flex items-center gap-4">
               <Skeleton className="h-4 w-8" />
               <Skeleton className="h-4 flex-1" />
               <Skeleton className="h-4 w-32" />
               <Skeleton className="h-4 w-24" />
               <Skeleton className="h-4 w-20" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="h-16 px-4 flex items-center gap-4 border-b last:border-0">
                  <Skeleton className="h-4 w-8" />
                  <div className="flex-1 space-y-2">
                     <Skeleton className="h-4 w-48" />
                     <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
               </div>
            ))}
         </div>
      </DataCard>
    </div>
  );
}
