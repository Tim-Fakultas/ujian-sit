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
      <div className="overflow-x-auto rounded-xl border bg-white dark:bg-neutral-800 shadow-sm">
        <Table className="min-w-[700px] sm:min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead
                    key={header.id}
                    className="bg-gray-50 dark:bg-neutral-900 text-xs font-semibold uppercase tracking-wide py-3 px-2"
                  >
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
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-2 text-sm align-middle"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4">
        <div className="text-muted-foreground flex-1 text-xs sm:text-sm">
          Total data: {totalFiltered}
          {totalAll !== totalFiltered && (
            <span className="text-muted-foreground"> dari {totalAll}</span>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg px-4 py-2 text-xs sm:text-sm"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg px-4 py-2 text-xs sm:text-sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
