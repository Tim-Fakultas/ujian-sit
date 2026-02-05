"use client";
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import TableGlobal from "@/components/tableGlobal";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import DosenBimbinganDetailModal from "./DosenBimbinganDetailModal"; // Adjust path if needed
import { getDosenBimbinganDetails } from "@/actions/data-master/dosen";

// Define the shape of data from getMonitorBimbingan
interface MonitorBimbinganData {
    id: number;
    nama: string;
    nip: string;
    total_bimbingan: number;
    selesai: number;
    belum_selesai: number;
    detail_status: Record<string, number>;
}

export default function MahasiswaBimbinganTable({ data }: { data: MonitorBimbinganData[] }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const handleViewDetail = async (dosenId: number) => {
        setIsModalOpen(true);
        setLoadingDetail(true);
        try {
            const result = await getDosenBimbinganDetails(dosenId);
            setDetailData(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingDetail(false);
        }
    };

    const filteredData = useMemo(() => {
        const q = search.toLowerCase();
        return (data || []).filter(item =>
            (item.nama || "").toLowerCase().includes(q) ||
            (item.nip || "").toLowerCase().includes(q)
        );
    }, [data, search]);

    const columns: ColumnDef<MonitorBimbinganData>[] = useMemo(() => [
        {
            id: "no",
            header: "No",
            cell: ({ row, table }) => {
                return (table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + row.index + 1;
            }
        },
        {
            accessorKey: "nama",
            header: "Nama Dosen",
            cell: ({ row }) => (
                <div
                    className="flex flex-col gap-0.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 p-2 -m-2 rounded-md transition-colors group"
                    onClick={() => handleViewDetail(row.original.id)}
                >
                    <span className="font-medium text-sm text-blue-600 dark:text-blue-400 group-hover:underline decoration-blue-600/30 underline-offset-2">
                        {row.original.nama}
                    </span>
                    <span className="text-xs text-muted-foreground">{row.original.nip}</span>
                </div>
            )
        },
        {
            accessorKey: "total_bimbingan",
            header: () => <div className="text-center">Total Bimbingan</div>,
            cell: ({ row }) => <div className="text-center font-bold px-4">{row.original.total_bimbingan}</div>
        },
        {
            id: "actions",
            header: () => <div className="text-center">Aksi</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-primary hover:text-primary/80 hover:bg-primary/10"
                        onClick={() => handleViewDetail(row.original.id)}
                    >
                        <Eye size={18} />
                    </Button>
                </div>
            )
        }
    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    });

    return (
        <>
            <DataCard>
                <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari Dosen..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
                <TableGlobal table={table} cols={columns} />
            </DataCard>

            <DosenBimbinganDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={detailData}
                loading={loadingDetail}
            />
        </>
    );
}
