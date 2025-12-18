
import { Skeleton } from "@/components/ui/skeleton";
import { DataCard } from "@/components/common/DataCard";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
           <Skeleton className="h-8 w-64" />
           <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <DataCard>
         <div className="mb-6 flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-24" />
         </div>
         
         <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
               <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
         </div>
      </DataCard>
    </div>
  );
}
