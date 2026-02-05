"use client"
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
import { User, GraduationCap, Calendar, BookOpen, BadgeInfo, Filter, X } from "lucide-react";
import Search from "@/components/common/Search";
import AngkatanFilter from "@/components/common/AngkatanFilter";


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

export default function MahasiswaBimbinganTable({ data }: MahasiswaBimbinganTableProps) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "nama", desc: false }
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const debouncedFilter = useDebounce(globalFilter, 300);

    // State for Modal Detail
    const [selectedMahasiswa, setSelectedMahasiswa] = useState<MahasiswaBimbingan | null>(null);

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
                        <span className="text-xs text-muted-foreground">{row.original.nim}</span>
                    </div>
                ),
            },
            {
                accessorKey: "prodi",
                header: "Prodi",
                cell: ({ row }) => <span className="text-sm">{row.original.prodi?.nama || '-'}</span>,
            },
            {
                accessorKey: "angkatan",
                header: "Angkatan",
                cell: ({ row }) => <span className="text-sm">{row.original.angkatan}</span>,
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
                    const roles = peranStr.split(',').map(r => r.trim());

                    return (
                        <div className="flex flex-wrap gap-1">
                            {roles.map((peran, idx) => {
                                let colorClass = "bg-gray-100 text-gray-700 border-gray-200";
                                if (peran === 'Dosen PA') colorClass = "bg-purple-50 text-purple-700 border-purple-200";
                                else if (peran === 'Pembimbing 1') colorClass = "bg-blue-50 text-blue-700 border-blue-200";
                                else if (peran === 'Pembimbing 2') colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";

                                return (
                                    <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
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
                            row.original.status
                        )}`}
                    >
                        {row.original.status}
                    </span>
                ),
            },
        ],
        []
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
            return nama.includes(search) || nim.includes(search) || judul.includes(search);
        }
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
                    selectedYears={(table.getColumn("angkatan")?.getFilterValue() as string[]) || []}
                    onYearChange={(years) => table.getColumn("angkatan")?.setFilterValue(years.length > 0 ? years : undefined)}
                />
            </div>

            <TableGlobal table={table} cols={columns} />

            {/* Detail Modal */}

            {selectedMahasiswa && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in-0"
                    onClick={() => setSelectedMahasiswa(null)}
                >
                    <div
                        className="relative w-full sm:max-w-sm md:max-w-md max-h-[80vh] lg:max-w-lg rounded-xl bg-background shadow-lg border animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Detail Mahasiswa
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setSelectedMahasiswa(null)}
                            >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="text-center pb-2">
                                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 border-2 border-white dark:border-neutral-800 shadow-sm">
                                    {selectedMahasiswa.nama.charAt(0)}
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{selectedMahasiswa.nama}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{selectedMahasiswa.nim}</p>
                            </div>

                            <div className="space-y-4 mt-6">
                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Program Studi</p>
                                        <p className="text-sm font-medium">{selectedMahasiswa.prodi?.nama || '-'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Angkatan</p>
                                        <p className="text-sm font-medium">{selectedMahasiswa.angkatan}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <BadgeInfo className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Status Mahasiswa</p>
                                        <p className="text-sm font-medium capitalize">{selectedMahasiswa.status}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Judul Skripsi</p>
                                        <p className="text-sm font-medium italic leading-relaxed">"{selectedMahasiswa.judul}"</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Pembimbing 1</p>
                                        <p className="text-sm font-medium">{selectedMahasiswa.pembimbing1?.nama || '-'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Pembimbing 2</p>
                                        <p className="text-sm font-medium">{selectedMahasiswa.pembimbing2?.nama || '-'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Peran Anda</p>
                                        <p className="text-sm font-bold text-blue-600">{selectedMahasiswa.peran}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </DataCard>
    );
}
