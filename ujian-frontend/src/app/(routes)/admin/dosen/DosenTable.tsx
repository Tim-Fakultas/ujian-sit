"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import { Dosen } from "@/types/Dosen";
import { User } from "@/types/Auth";
import TableGlobal from "@/components/tableGlobal";

interface DosenTableProps {
  dosen: Dosen[];
  user?: User | null;
}

export function DosenTable({ dosen }: DosenTableProps) {
  // data berasal dari props `dosen`
  const data = React.useMemo(() => dosen ?? [], [dosen]);

  // global search state (nama, nidn, nip, prodi)
  const [search, setSearch] = React.useState("");

  // filteredData memfilter berdasarkan nama, nidn, nip, dan prodi.nama
  const filteredData = React.useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return data;
    return data.filter((d) => {
      const nama = (d.nama ?? "").toLowerCase();
      const nidn = (d.nidn ?? "").toLowerCase();
      const nip = (d.nip ?? "").toLowerCase();
      const prodi = (d.prodi?.nama ?? "").toLowerCase();
      return (
        nama.includes(q) ||
        nidn.includes(q) ||
        nip.includes(q) ||
        prodi.includes(q)
      );
    });
  }, [data, search]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const cols: ColumnDef<Dosen>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "nama",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="">{row.getValue("nama") as string}</div>
        ),
      },
      {
        accessorKey: "nidn",
        header: "NIDN",
        cell: ({ row }) => (
          <div className="">{row.getValue("nidn") ?? "-"}</div>
        ),
      },
      {
        accessorKey: "nip",
        header: "NIP",
        cell: ({ row }) => <div className="">{row.getValue("nip") ?? "-"}</div>,
      },
      {
        id: "prodi",
        accessorFn: (row) => row.prodi?.nama ?? "-",
        header: "Program Studi",
        cell: ({ row }) => (
          <div className="">{row.getValue("prodi") as string}</div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns: cols,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <span className="text-xl">Dosen</span>
        <div className="flex items-center py-4">
          <Input
            placeholder="Search "
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm bg-white dark:bg-neutral-800"
          />
        </div>
      </div>
      <TableGlobal cols={cols} table={table} />
    </div>
  );
}
