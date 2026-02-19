"use client";
import { useState, useMemo, useEffect } from "react";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  User,
  GraduationCap,
  Calendar,
  BookOpen,
  BadgeInfo,
  Filter,
  X,
} from "lucide-react";
import Search from "@/components/common/Search";
import AngkatanFilter from "@/components/common/AngkatanFilter";
import DetailModal from "@/components/common/DetailModal";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TableGlobal from "@/components/tableGlobal";
import { DataCard } from "@/components/common/DataCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { getStatusColor } from "@/lib/utils";

export interface MahasiswaBimbingan {
  id: number;
  nama: string;
  nim: string;
  status: string;
  prodi: {
    id: string;
    nama: string;
  };
  angkatan: string;
  judul: string;
  peran: string; // 'PA', 'Pembimbing 1', 'Pembimbing 2'
  pembimbing1?: { id: number; nama: string } | null;
  pembimbing2?: { id: number; nama: string } | null;
}

interface MahasiswaBimbinganTableProps {
  data: MahasiswaBimbingan[];
}

export default function MahasiswaBimbinganTable({
  data,
}: MahasiswaBimbinganTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "nama", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedFilter = useDebounce(globalFilter, 300);

  // State for Modal Detail
  const [selectedMahasiswa, setSelectedMahasiswa] =
    useState<MahasiswaBimbingan | null>(null);

  const columns = useMemo<ColumnDef<MahasiswaBimbingan>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row, table }) =>
          table.getSortedRowModel().rows.findIndex((r) => r.id === row.id) + 1,
        size: 50,
      },
      {
        accessorKey: "nama",
        header: "Mahasiswa",
        cell: ({ row }) => (
          <div
            className="flex flex-col gap-0.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 p-1.5 -ml-1.5 rounded-md transition-colors group w-fit"
            onClick={() => setSelectedMahasiswa(row.original)}
          >
            <span className="font-medium text-sm text-blue-600 dark:text-blue-400 group-hover:underline decoration-blue-600/30 underline-offset-2">
              {row.original.nama}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.nim}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "prodi",
        header: "Prodi",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.prodi?.nama || "-"}</span>
        ),
      },
      {
        accessorKey: "angkatan",
        header: "Angkatan",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.angkatan}</span>
        ),
        filterFn: (row, id, value) => {
          if (!value || value.length === 0) return true;
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "judul",
        header: "Judul Skripsi",
        cell: ({ row }) => (
          <div className="max-w-[300px] text-xs text-muted-foreground italic leading-snug">
            "{row.original.judul}"
          </div>
        ),
      },

      {
        accessorKey: "peran",
        header: "Peran Dosen",
        cell: ({ row }) => {
          const peranStr = row.original.peran;
          const roles = peranStr.split(",").map((r) => r.trim());

          return (
            <div className="flex flex-wrap gap-1">
              {roles.map((peran, idx) => {
                let colorClass = "bg-gray-100 text-gray-700 border-gray-200";
                if (peran === "Dosen PA")
                  colorClass = "bg-purple-50 text-purple-700 border-purple-200";
                else if (peran === "Pembimbing 1")
                  colorClass = "bg-blue-50 text-blue-700 border-blue-200";
                else if (peran === "Pembimbing 2")
                  colorClass =
                    "bg-emerald-50 text-emerald-700 border-emerald-200";

                return (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
                  >
                    {peran}
                  </span>
                );
              })}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(
              row.original.status,
            )}`}
          >
            {row.original.status}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    state: {
      sorting,
      columnFilters,
      globalFilter: debouncedFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const nama = row.original.nama.toLowerCase();
      const nim = row.original.nim.toLowerCase();
      const judul = row.original.judul.toLowerCase();
      return (
        nama.includes(search) || nim.includes(search) || judul.includes(search)
      );
    },
  });

  return (
    <DataCard>
      <div className="flex items-center gap-4 mb-4 w-full md:justify-end">
        {/* Search */}
        <Search
          placeholder="Cari Mahasiswa, NIM..."
          className="flex-1 w-full md:flex-none md:w-[300px]"
          value={globalFilter}
          onChange={setGlobalFilter}
          disableUrlParams={true}
        />

        {/* Filter Angkatan */}
        <AngkatanFilter
          selectedYears={
            (table.getColumn("angkatan")?.getFilterValue() as string[]) || []
          }
          onYearChange={(years) =>
            table
              .getColumn("angkatan")
              ?.setFilterValue(years.length > 0 ? years : undefined)
          }
        />
      </div>

      <TableGlobal table={table} cols={columns} />

      {/* Detail Modal */}

      {/* Detail Modal */}
      <DetailModal
        isOpen={!!selectedMahasiswa}
        onClose={() => setSelectedMahasiswa(null)}
        title="Detail Mahasiswa"
        headerData={
          selectedMahasiswa
            ? {
                name: selectedMahasiswa.nama,
                subText: selectedMahasiswa.nim,
                status: selectedMahasiswa.status,
                statusColor: getStatusColor(selectedMahasiswa.status),
                initials: selectedMahasiswa.nama.charAt(0),
                avatarColor:
                  "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-white dark:border-neutral-800",
              }
            : undefined
        }
        items={
          selectedMahasiswa
            ? [
                {
                  label: "Program Studi",
                  value: selectedMahasiswa.prodi?.nama,
                  icon: GraduationCap,
                },
                {
                  label: "Angkatan",
                  value: selectedMahasiswa.angkatan,
                  icon: Calendar,
                },
                {
                  label: "Status Mahasiswa",
                  value: selectedMahasiswa.status,
                  icon: BadgeInfo,
                },
                {
                  label: "Judul Skripsi",
                  value: `"${selectedMahasiswa.judul}"`,
                  icon: BookOpen,
                  colSpan: 2,
                },
                {
                  label: "Pembimbing 1",
                  value: selectedMahasiswa.pembimbing1?.nama,
                  icon: User,
                },
                {
                  label: "Pembimbing 2",
                  value: selectedMahasiswa.pembimbing2?.nama,
                  icon: User,
                },
                {
                  label: "Peran Anda",
                  value: selectedMahasiswa.peran,
                  icon: User,
                },
              ]
            : []
        }
      />
    </DataCard>
  );
}
