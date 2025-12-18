
import { Skeleton } from "@/components/ui/skeleton";
import { DataCard } from "@/components/common/DataCard";
import PageHeader from "@/components/common/PageHeader";
import { User } from "lucide-react";

export default function Loading() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
         <div className="flex items-center gap-2 text-gray-400">
            <User className="h-6 w-6" />
            <Skeleton className="h-8 w-32" />
         </div>
         <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Skeleton */}
        <div className="md:col-span-1">
           <DataCard className="flex flex-col items-center p-6 text-center space-y-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-2 w-full flex flex-col items-center">
                 <Skeleton className="h-6 w-48" />
                 <Skeleton className="h-4 w-32" />
                 <Skeleton className="h-6 w-24 rounded-full mt-2" />
              </div>
           </DataCard>
        </div>

        {/* Form Skeleton */}
        <div className="md:col-span-2">
           <DataCard className="p-6">
              <Skeleton className="h-6 w-32 mb-6" />
              <div className="space-y-6">
                 <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-24" />
                       <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-24" />
                       <Skeleton className="h-10 w-full" />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Skeleton className="h-4 w-24" />
                       <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-24" />
                       <Skeleton className="h-10 w-full" />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-24 w-full" />
                 </div>

                 <div className="pt-4 flex justify-end">
                    <Skeleton className="h-10 w-32" />
                 </div>
              </div>
           </DataCard>
        </div>
      </div>
    </div>
  );
}
