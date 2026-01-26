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
import { Search, User, GraduationCap, Calendar, BookOpen, BadgeInfo, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import TableGlobal from "@/components/tableGlobal";
import { DataCard } from "@/components/common/DataCard";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export interface MahasiswaBimbingan {
    id: number;
    nama: string;
    nim: string;
    status: string;
    prodi: string;
    angkatan: string;
    judul: string;
    peran: string; // 'PA', 'Pembimbing 1', 'Pembimbing 2'
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

    // State for Modal Detail
    const [selectedMahasiswa, setSelectedMahasiswa] = useState<MahasiswaBimbingan | null>(null);

    // Calculate min and max angkatan
    const { minAngkatan, maxAngkatan } = useMemo(() => {
        const years = data.map(d => parseInt(d.angkatan)).filter(n => !isNaN(n));
        if (years.length === 0) return { minAngkatan: 2020, maxAngkatan: new Date().getFullYear() };
        return {
            minAngkatan: Math.min(...years),
            maxAngkatan: Math.max(...years)
        };
    }, [data]);

    const [sliderValue, setSliderValue] = useState([minAngkatan, maxAngkatan]);

    // Update slider when data changes
    useEffect(() => {
        setSliderValue([minAngkatan, maxAngkatan]);
        // Optional: clear filter or set to full range when data updates
    }, [minAngkatan, maxAngkatan]);

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
                cell: ({ row }) => <span className="text-sm">{row.original.prodi}</span>,
            },
            {
                accessorKey: "angkatan",
                header: "Angkatan",
                cell: ({ row }) => <span className="text-sm">{row.original.angkatan}</span>,
                filterFn: (row, id, value) => {
                    const rowValue = parseInt(row.getValue(id));
                    const [min, max] = value as number[];
                    return rowValue >= min && rowValue <= max;
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
                    const peran = row.original.peran;
                    let colorClass = "bg-gray-100 text-gray-700 border-gray-200";

                    if (peran === 'Dosen PA') colorClass = "bg-purple-50 text-purple-700 border-purple-200";
                    else if (peran === 'Pembimbing 1') colorClass = "bg-blue-50 text-blue-700 border-blue-200";
                    else if (peran === 'Pembimbing 2') colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";

                    return (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${colorClass}`}>
                            {peran}
                        </span>
                    )
                },
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => (
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border bg-slate-100 text-slate-700 border-slate-200">
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
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                {/* Search */}
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari Mahasiswa, NIM..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-9 bg-white dark:bg-neutral-800"
                    />
                </div>

                {/* Filter Angkatan Popover */}
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 border-dashed">
                                <Filter className="mr-2 h-4 w-4" />
                                Angkatan
                                {(sliderValue[0] > minAngkatan || sliderValue[1] < maxAngkatan) && (
                                    <>
                                        <Separator orientation="vertical" className="mx-2 h-4" />
                                        <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                            {sliderValue[0]}-{sliderValue[1]}
                                        </Badge>
                                        <div className="hidden lg:flex gap-1">
                                            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                                {sliderValue[0]} - {sliderValue[1]}
                                            </Badge>
                                        </div>
                                    </>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-4" align="end">
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Rentang Angkatan</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Filter berdasarkan tahun masuk mahasiswa.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between text-sm font-medium pt-2">
                                    <span>{sliderValue[0]}</span>
                                    <span>{sliderValue[1]}</span>
                                </div>
                                <Slider
                                    min={minAngkatan}
                                    max={maxAngkatan}
                                    step={1}
                                    value={sliderValue}
                                    onValueChange={(val) => {
                                        setSliderValue(val);
                                        table.getColumn("angkatan")?.setFilterValue(val);
                                    }}
                                    className="py-2"
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <TableGlobal table={table} cols={columns} />

            {/* Detail Modal */}
            <Dialog open={!!selectedMahasiswa} onOpenChange={(open) => !open && setSelectedMahasiswa(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Detail Mahasiswa
                        </DialogTitle>
                    </DialogHeader>

                    {selectedMahasiswa && (
                        <div className="mt-4 space-y-6">
                            <div className="text-center pb-2">
                                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 border-2 border-white dark:border-neutral-800 shadow-sm">
                                    {selectedMahasiswa.nama.charAt(0)}
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{selectedMahasiswa.nama}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{selectedMahasiswa.nim}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Program Studi</p>
                                        <p className="text-sm font-medium">{selectedMahasiswa.prodi}</p>
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
                                        <p className="text-xs text-muted-foreground">Peran Dosen Anda</p>
                                        <p className="text-sm font-bold text-blue-600">{selectedMahasiswa.peran}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DataCard>
    );
}
