import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex justify-end gap-2 mb-4">
        <Skeleton className="h-10 w-64" /> {/* Search */}
        <Skeleton className="h-10 w-24" /> {/* Filter */}
      </div>
      <div className="rounded-xl border overflow-hidden">
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
                <Skeleton className="h-4 w-40" />
              </th>
              <th className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-28" />
              </th>
              <th className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-24" />
              </th>
              <th className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-24" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-8" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-40" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
