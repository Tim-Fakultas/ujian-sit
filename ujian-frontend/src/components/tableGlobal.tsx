/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function TableGlobal({
  table,
  cols,
}: {
  table: any;
  cols: any[];
}) {
  // Total data (use filtered row model if available so count updates with filters)
  const totalFiltered =
    typeof table.getFilteredRowModel === "function"
      ? table.getFilteredRowModel().rows.length
      : table.getRowModel?.()?.rows.length ?? 0;

  // Total before filter (if available)
  const totalAll =
    typeof table.getPreFilteredRowModel === "function"
      ? table.getPreFilteredRowModel().rows.length
      : totalFiltered;

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any, idx: number) => (
              <TableRow
                key={headerGroup.id}
                className={`${idx === 0 ? "text-center" : ""}`}
              >
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 dark:hover:bg-neutral-900 transition"
                >
                  {row.getVisibleCells().map((cell: any, idx: number) => (
                    <TableCell
                      key={cell.id}
                      className={`text-sm ${idx === 0 ? "text-center" : ""}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={cols.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-muted-foreground flex-1 text-xs sm:text-sm order-2 sm:order-1">
          Menampilkan {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} hingga{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            totalFiltered
          )}{" "}
          dari {totalFiltered} data
        </div>

        <div className="flex items-center gap-2 order-1 sm:order-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hidden sm:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">First page</span>
              <ChevronsLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft size={16} />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageCount = table.getPageCount();
                const pages = [];

                // Always show first
                pages.push(0);

                // Calculate range around current page
                let start = Math.max(1, pageIndex - 1);
                let end = Math.min(pageCount - 2, pageIndex + 1);

                // Adjust if near start or end to show consistent number of items
                if (pageIndex < 3) {
                  end = Math.min(pageCount - 2, 3);
                }
                if (pageIndex > pageCount - 4) {
                  start = Math.max(1, pageCount - 4);
                }

                // Add ellipsis after first if needed
                if (start > 1) {
                  pages.push('dots-1');
                }

                // Add middle pages
                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }

                // Add ellipsis before last if needed
                if (end < pageCount - 2) {
                  pages.push('dots-2');
                }

                // Always show last if distinct from first
                if (pageCount > 1) {
                  pages.push(pageCount - 1);
                }

                // If total pages is small, just show all (simplification of logic above might be needed or just let it handle it)
                // Actually, simplified approach for small counts:
                if (pageCount <= 6) {
                  return Array.from({ length: pageCount }).map((_, i) => (
                    <Button
                      key={i}
                      variant={pageIndex === i ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 ${pageIndex === i ? "pointer-events-none" : ""}`}
                      onClick={() => table.setPageIndex(i)}
                    >
                      {i + 1}
                    </Button>
                  ));
                }

                return pages.map((p, idx) => {
                  if (typeof p === 'string') {
                    return <span key={p} className="text-muted-foreground px-1">...</span>;
                  }
                  return (
                    <Button
                      key={p}
                      variant={pageIndex === p ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 ${pageIndex === p ? "pointer-events-none" : ""}`}
                      onClick={() => table.setPageIndex(p)}
                    >
                      {p + 1}
                    </Button>
                  );
                });
              })()}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Next page</span>
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 hidden sm:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Last page</span>
              <ChevronsRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
