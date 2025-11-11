import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex justify-end gap-2 mb-2">
        <Skeleton className="h-10 w-64" /> {/* Search */}
        <Skeleton className="h-10 w-24" /> {/* Filter */}
      </div>
      <div className="rounded-xl border bg-white">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left w-12">
                <Skeleton className="h-4 w-8" />
              </th>
              <th className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-32" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={6}
                className="py-8 text-center text-muted-foreground text-sm"
              >
                <Skeleton className="h-4 w-48 mx-auto" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
