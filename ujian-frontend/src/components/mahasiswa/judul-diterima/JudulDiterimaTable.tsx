"use client"
import { useState, useMemo, useEffect } from "react";
import { DataTableFilter } from "@/components/data-table/DataTableFilter";
import TableGlobal from "@/components/tableGlobal";
import { DataCard } from "@/components/common/DataCard";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";
import { Badge } from "@/components/ui/badge";
import AngkatanFilter from "@/components/common/AngkatanFilter";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface AcceptedRanpel extends RancanganPenelitian {
    mahasiswa?: {
        nama: string;
        nim: string;
        angkatan: string;
    };
    status: string;
}

export default function JudulDiterimaTable({ data }: { data: AcceptedRanpel[] }) {
    const [filter, setFilter] = useState("");
    const [selectedAngkatan, setSelectedAngkatan] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const filteredData = data.filter((item) => {
        const search = filter.toLowerCase();
        const angkatan = parseInt(item.mahasiswa?.angkatan || "0");

        // Search Filter
        const matchesSearch =
            item.judulPenelitian?.toLowerCase().includes(search) ||
            item.mahasiswa?.nama?.toLowerCase().includes(search) ||
            item.mahasiswa?.nim?.toLowerCase().includes(search);

        // Angkatan Filter
        const matchesAngkatan =
            selectedAngkatan.length === 0 ||
            selectedAngkatan.includes(item.mahasiswa?.angkatan || "");

        return matchesSearch && matchesAngkatan;
    });

    const totalPage = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const cols = [
        {
            id: "no",
            header: () => <div className="text-center">No</div>,
            cell: ({ row, table }: any) => {
                const index =
                    (table.getState().pagination?.pageIndex ?? 0) *
                    (table.getState().pagination?.pageSize ?? 10) +
                    row.index +
                    1;
                return <div className="text-center">{index}</div>;
            },
            size: 60,
        },
        {
            id: "mahasiswa",
            header: "Mahasiswa",
            cell: ({ row }: any) => (
                <div>
                    <div className="font-medium">{row.original.mahasiswa?.nama || "-"}</div>
                    <div className="text-xs text-muted-foreground">
                        {row.original.mahasiswa?.nim || "-"}
                    </div>
                </div>
            ),
            size: 220,
        },
        {
            id: "judul",
            header: "Judul Penelitian",
            cell: ({ row }: any) => (
                <div className="text-sm min-w-[500px] whitespace-normal break-words py-1 leading-relaxed">
                    {row.original.judulPenelitian}
                </div>
            ),
            size: 600
        },
        {
            id: "angkatan",
            header: () => <div className="text-center">Angkatan</div>,
            cell: ({ row }: any) => (
                <div className="text-center">{row.original.mahasiswa?.angkatan || "-"}</div>
            ),
            size: 100
        },

        {
            id: "catatanKaprodi",
            header: () => <div className="text-center">Catatan</div>,
            cell: ({ row }: any) => {
                const catatan = row.original.catatanKaprodi;
                if (!catatan || catatan === "-" || catatan.trim() === "") {
                    return <div className="text-center text-muted-foreground">-</div>;
                }
                return (
                    <div className="flex justify-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary rounded-full">
                                    <Eye size={15} />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[90%] sm:max-w-md rounded-xl">
                                <DialogHeader>
                                    <DialogTitle>Catatan Kaprodi</DialogTitle>
                                </DialogHeader>
                                <div className="pt-2">
                                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                        {catatan}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                );
            },
            size: 100
        }
    ];

    const table = {
        getRowModel: () => ({
            rows: paginatedData.map((item, idx) => ({
                id: idx.toString(),
                index: idx,
                original: item,
                getIsSelected: () => false,
                getVisibleCells: () =>
                    cols.map((col: any) => ({
                        id: col.id,
                        column: { columnDef: col },
                        getContext: () => ({
                            row: {
                                index: idx,
                                original: item,
                            },
                            table: {
                                getState: () => ({ pagination: { pageIndex: page - 1, pageSize } })
                            }
                        }),
                    })),
            })),
        }),
        getHeaderGroups: () => [
            {
                id: "main",
                headers: cols.map((col: any) => ({
                    id: col.id,
                    isPlaceholder: false,
                    column: { columnDef: col },
                    getContext: () => ({}),
                })),
            },
        ],
        previousPage: () => setPage((p) => Math.max(1, p - 1)),
        nextPage: () => setPage((p) => Math.min(totalPage, p + 1)),
        getCanPreviousPage: () => page > 1,
        getCanNextPage: () => page < totalPage,
        getState: () => ({
            pagination: { pageIndex: page - 1, pageSize },
        }),
        getPageCount: () => totalPage,
        setPageIndex: (p: number) => setPage(p + 1),
    };

    return (
        <DataCard>
            <DataTableFilter
                searchValue={filter}
                onSearchChange={setFilter}
                searchPlaceholder="Cari Judul, Nama, atau NIM..."
                actions={
                    <AngkatanFilter
                        selectedYears={selectedAngkatan}
                        onYearChange={setSelectedAngkatan}
                    />
                }
            />

            <div className="mt-4">
                <TableGlobal
                    table={table}
                    cols={cols}
                    emptyMessage="Tidak ada data judul yang diterima."
                />
            </div>
        </DataCard>
    );
}
