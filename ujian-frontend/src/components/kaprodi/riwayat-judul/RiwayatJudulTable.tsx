"use client"
import { useState, useMemo, Fragment } from "react";
import {
    ColumnDef,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnFiltersState,
    getExpandedRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Download, Search, User, GraduationCap, MapPin, Phone, BookOpen, Calendar, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataCard } from "@/components/common/DataCard";
import { PerbaikanJudul } from "@/types/PerbaikanJudul";
import { Mahasiswa } from "@/types/Mahasiswa";
import { getStatusColor } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface RiwayatJudulTableProps {
    data: PerbaikanJudul[];
}

// Tipe data untuk grouping
interface GroupedMahasiswa {
    mahasiswaId: number;
    mahasiswa: Mahasiswa;
    history: PerbaikanJudul[];
    latestUpdate: string; // tanggal terbaru
    latestStatus: string;
}

export default function RiwayatJudulTable({ data }: RiwayatJudulTableProps) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "latestUpdate", desc: true }
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [expanded, setExpanded] = useState({});

    // State for Profile Modal
    const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);

    // 1. Grouping Data Logic
    const groupedData = useMemo(() => {
        const groups: Record<number, GroupedMahasiswa> = {};

        data.forEach((item) => {
            const mId = item.mahasiswa.id;
            if (!groups[mId]) {
                groups[mId] = {
                    mahasiswaId: mId,
                    mahasiswa: item.mahasiswa,
                    history: [],
                    latestUpdate: item.tanggalPerbaikan,
                    latestStatus: item.status
                };
            }
            groups[mId].history.push(item);

            // Check if this item is newer
            if (new Date(item.tanggalPerbaikan) > new Date(groups[mId].latestUpdate)) {
                groups[mId].latestUpdate = item.tanggalPerbaikan;
                groups[mId].latestStatus = item.status;
            }
        });

        // Convert map to array and sort history within each group desc by date
        return Object.values(groups).map(g => {
            g.history.sort((a, b) => new Date(b.tanggalPerbaikan).getTime() - new Date(a.tanggalPerbaikan).getTime());
            return g;
        });
    }, [data]);

    const columns = useMemo<ColumnDef<GroupedMahasiswa>[]>(
        () => [
            {
                id: "expander",
                header: () => null,
                cell: ({ row }) => {
                    return row.getCanExpand() ? (
                        <button
                            {...{
                                onClick: row.getToggleExpandedHandler(),
                                style: { cursor: 'pointer' },
                                className: "p-1 hover:bg-slate-100 rounded-full transition-colors",
                            }}
                        >
                            {row.getIsExpanded() ? (
                                <ChevronDown className="h-4 w-4 text-slate-500" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                            )}
                        </button>
                    ) : null;
                },
                size: 30,
            },
            {
                id: "no",
                header: "No",
                cell: ({ row, table }) =>
                    table.getSortedRowModel().rows.findIndex((r) => r.id === row.id) + 1,
                size: 50,
            },
            {
                accessorFn: (row) => row.mahasiswa.nama,
                id: "mahasiswa",
                header: "Mahasiswa",
                cell: ({ row }) => (
                    <div
                        className="flex flex-col gap-0.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 p-1.5 -ml-1.5 rounded-md transition-colors group w-fit"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row expand
                            setSelectedMahasiswa(row.original.mahasiswa);
                        }}
                        title="Klik untuk melihat detail mahasiswa"
                    >
                        <span className="font-medium text-sm text-blue-600 dark:text-blue-400 group-hover:underline decoration-blue-600/30 underline-offset-2">
                            {row.original.mahasiswa.nama}
                        </span>
                        <span className="text-xs text-muted-foreground">{row.original.mahasiswa.nim}</span>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row.history.length,
                id: "totalRevisi",
                header: "Total Revisi",
                cell: ({ getValue }) => (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-100">
                            {getValue() as number}
                        </span>
                        <span className="text-xs text-muted-foreground">kali</span>
                    </div>
                ),
            },
            {
                accessorKey: "latestStatus",
                header: "Status Terakhir",
                cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(
                            row.original.latestStatus
                        )}`}
                    >
                        {row.original.latestStatus}
                    </span>
                ),
            },
            {
                accessorKey: "latestUpdate",
                header: "Update Terakhir",
                cell: ({ getValue }) => {
                    const val = getValue() as string;
                    if (!val) return "-";
                    return new Date(val).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    });
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: groupedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onExpandedChange: setExpanded,
        getRowCanExpand: () => true,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            expanded,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            const nama = row.original.mahasiswa.nama.toLowerCase();
            const nim = row.original.mahasiswa.nim.toLowerCase();
            return nama.includes(search) || nim.includes(search);
        }
    });

    return (
        <DataCard>
            <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari Mahasiswa atau NIM..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-9 bg-white dark:bg-neutral-800"
                    />
                </div>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
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
                            table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
                                    <TableRow
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>

                                    {/* Expanded Row Content */}
                                    {row.getIsExpanded() && (
                                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 dark:bg-neutral-900/50">
                                            <TableCell colSpan={columns.length} className="p-0">
                                                <div className="p-4 pl-12">
                                                    <div className="rounded-md border bg-white dark:bg-neutral-950 shadow-sm overflow-hidden">
                                                        <div className="px-4 py-2 border-b bg-slate-50 dark:bg-neutral-900 flex items-center gap-2">
                                                            <div className="h-6 w-1 bg-blue-500 rounded-full"></div>
                                                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                                Riwayat Pengajuan Judul
                                                            </h4>
                                                        </div>
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="w-[150px] text-xs h-9">Tanggal</TableHead>
                                                                    <TableHead className="text-xs h-9">Judul Lama</TableHead>
                                                                    <TableHead className="text-xs h-9">Judul Baru</TableHead>
                                                                    <TableHead className="w-[100px] text-xs h-9">Status</TableHead>
                                                                    <TableHead className="w-[80px] text-xs h-9 text-right">Surat</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {row.original.history.map((item, idx) => (
                                                                    <TableRow key={item.id} className="border-b last:border-0 hover:bg-transparent">
                                                                        <TableCell className="py-2.5 text-xs text-muted-foreground align-top">
                                                                            {new Date(item.tanggalPerbaikan).toLocaleDateString("id-ID", {
                                                                                day: "numeric",
                                                                                month: "short",
                                                                                year: "numeric",
                                                                                hour: "2-digit",
                                                                                minute: "2-digit"
                                                                            })}
                                                                        </TableCell>
                                                                        <TableCell className="py-2.5 text-xs italic text-muted-foreground align-top max-w-[200px]">
                                                                            "{item.judulLama}"
                                                                        </TableCell>
                                                                        <TableCell className="py-2.5 align-top">
                                                                            <div className="text-sm font-medium text-blue-700 dark:text-blue-400 leading-snug">
                                                                                {item.judulBaru}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="py-2.5 align-top">
                                                                            <span
                                                                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(item.status)}`}
                                                                            >
                                                                                {item.status}
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell className="py-2.5 text-right align-top">
                                                                            {item.berkas ? (
                                                                                <Link
                                                                                    href={item.berkas.startsWith('http') ? item.berkas : `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${item.berkas}`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Unduh Surat">
                                                                                        <Download className="w-3.5 h-3.5" />
                                                                                    </Button>
                                                                                </Link>
                                                                            ) : <span className="text-muted-foreground text-[10px]">-</span>}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Manual */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>

            {/* Profile Modal */}
            <Dialog open={!!selectedMahasiswa} onOpenChange={(open) => !open && setSelectedMahasiswa(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Profil Mahasiswa
                        </DialogTitle>
                    </DialogHeader>

                    {selectedMahasiswa && (
                        <div className="mt-4 space-y-6">
                            {/* Header Info */}
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
                                        <p className="text-sm font-medium">{selectedMahasiswa.prodi?.nama || "-"}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Semester</p>
                                        <p className="text-sm font-medium">Semester {selectedMahasiswa.semester || "-"}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Dosen Pembimbing Akademik</p>
                                        <p className="text-sm font-medium">{selectedMahasiswa.dosenPa?.nama || "-"}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">No. Handphone</p>
                                        <p className="text-sm font-medium">{selectedMahasiswa.noHp || "-"}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[20px_1fr] gap-3 items-start">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Alamat</p>
                                        <p className="text-sm font-medium leading-snug">{selectedMahasiswa.alamat || "-"}</p>
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
