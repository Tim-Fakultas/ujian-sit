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
            cell: ({ row }) => <div className="font-medium text-left">{row.original.nama}</div>
        },
        {
            accessorKey: "nip",
            header: "NIP / NIDN",
        },
        {
            accessorKey: "total_bimbingan",
            header: () => <div className="text-center">Total Bimbingan</div>,
            cell: ({ row }) => <div className="text-center font-bold px-4">{row.original.total_bimbingan}</div>
        },
        {
            accessorKey: "selesai",
            header: () => <div className="text-center">Lulus/Selesai</div>,
            cell: ({ row }) => <div className="text-center text-green-600 font-medium px-4">{row.original.selesai}</div>
        },
        {
            accessorKey: "belum_selesai",
            header: () => <div className="text-center">Belum Selesai</div>,
            cell: ({ row }) => <div className="text-center text-orange-600 font-medium px-4">{row.original.belum_selesai}</div>
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
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
