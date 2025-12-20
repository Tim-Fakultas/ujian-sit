"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Eye,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { updateStatusPerbaikanJudul } from "@/actions/perbaikanJudul";
import { showToast } from "@/components/ui/custom-toast";
import revalidateAction from "@/actions/revalidate";

import TableGlobal from "@/components/tableGlobal";
import { DataTableFilter } from "@/components/common/DataTableFilter";
import { DataCard } from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { PerbaikanJudul } from "@/types/PerbaikanJudul";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import PDFPreviewModal from "@/components/mahasiswa/pengajuan-ranpel/PDFPreviewModal";
import { getStatusColor } from "@/lib/utils";

interface PerbaikanJudulTableProps {
  perbaikanJudulList: PerbaikanJudul[];
}

export default function PerbaikanJudulTable({
  perbaikanJudulList,
}: PerbaikanJudulTableProps) {
  const router = useRouter();
  const [data] = useState<PerbaikanJudul[]>(perbaikanJudulList);
  
  // Table States
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Filter States
  const [filterNama, setFilterNama] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal States
  const [selectedPengajuan, setSelectedPengajuan] = useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailPerbaikan, setDetailPerbaikan] = useState<PerbaikanJudul | null>(null);

  // Filter Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter by Name/NIM/Title
      const lowerSearch = filterNama.toLowerCase();
      const matchSearch =
        item.mahasiswa?.nama?.toLowerCase().includes(lowerSearch) ||
        item.mahasiswa?.nim?.toLowerCase().includes(lowerSearch) ||
        item.ranpel?.judulPenelitian?.toLowerCase().includes(lowerSearch) ||
        item.judulBaru?.toLowerCase().includes(lowerSearch);

      // Filter by Status
      const matchStatus =
        filterStatus === "all" ? true : item.status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [data, filterNama, filterStatus]);

  // Actions
  const handlePreview = (item: PerbaikanJudul) => {
    // Map PerbaikanJudul to PengajuanRanpel for the preview modal
    // Note: This is an approximation since PDFPreviewModal expects PengajuanRanpel
    // We assume fundamental fields are compatible or mapped here.
    const mapped: any = {
      ...item,
      tanggalPengajuan: item.tanggalPerbaikan,
      // Ensure specific fields required by PDFPreviewModal are present
    };
    setSelectedPengajuan(mapped);
    setIsModalOpen(true);
  };

  const handleDetail = (item: PerbaikanJudul) => {
    setDetailPerbaikan(item);
  };

  // Columns
  const columns = useMemo<ColumnDef<PerbaikanJudul>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row, table }) =>
          (table.getState().pagination.pageIndex) *
            table.getState().pagination.pageSize +
          row.index +
          1,
        size: 50,
      },
      {
        accessorFn: (row) => row.tanggalPerbaikan,
        id: "tanggal",
        header: "Tanggal",
        cell: ({ getValue }) => {
          const val = getValue() as string;
          if (!val) return "-";
          return new Date(val).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        },
        size: 120,
      },
      {
        accessorFn: (row) => row.mahasiswa?.nama,
        id: "mahasiswa",
        header: "Mahasiswa",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.mahasiswa?.nama}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.mahasiswa?.nim}
            </div>
          </div>
        ),
        size: 200,
      },
      {
        accessorFn: (row) => row.judulBaru,
        id: "judul_baru",
        header: "Judul Baru",
        cell: ({ row }) => (
           <div className="min-w-[250px] whitespace-normal leading-relaxed py-1" title={row.original.judulBaru}>
                {row.original.judulBaru}
           </div>
        ),
        size: 300,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getStatusColor(
              row.original.status
            )}`}
          >
            {row.original.status}
          </span>
        ),
        size: 100,
      },
      {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {row.original.status === "menunggu" && (
                <Button
                    variant="default"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleDetail(row.original)}
                >
                    Lihat detail
                </Button>
            )}
          </div>
        ),
        size: 100,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "diverifikasi", label: "Diverifikasi" },
  ];

  return (
    <DataCard>
      {/* Filters */}
      <DataTableFilter
        searchValue={filterNama}
        onSearchChange={setFilterNama}
        searchPlaceholder="Cari Nama, NIM, atau Judul..."
        filterGroups={[
            { label: "Status", key: "status", options: statusOptions }
        ]}
        selectedFilterType="status" // Default showing single group selector behavior if needed, or customize DataTableFilter
        selectedFilterValue={filterStatus}
        onFilterChange={(_, value) => setFilterStatus(value)} // simplified for single filter group
      />

      {/* Table */}
      <TableGlobal table={table} cols={columns} />

      {/* Modal Preview PDF */}
      {selectedPengajuan && (
        <PDFPreviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPengajuan(null);
          }}
          pengajuan={selectedPengajuan}
        />
      )}

      {/* Modal Detail & Verifikasi */}
      <Dialog
        open={!!detailPerbaikan}
        onOpenChange={(open) => !open && setDetailPerbaikan(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Perbaikan Judul</DialogTitle>
          </DialogHeader>
          {detailPerbaikan && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Judul Lama</Label>
                <div className="text-sm font-medium mt-1 p-2 bg-muted/40 rounded border">
                  {detailPerbaikan.judulLama || "-"}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Judul Baru (Usulan)</Label>
                <div className="text-sm font-medium mt-1 p-2 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 rounded border border-blue-100 dark:border-blue-800">
                  {detailPerbaikan.judulBaru || "-"}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Surat Permohonan</Label>
                <div className="mt-1">
                {detailPerbaikan.berkas ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${detailPerbaikan.berkas}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <FileText size={14} />
                    Lihat Surat
                  </a>
                ) : (
                  <span className="text-muted-foreground text-sm italic">Tidak ada file</span>
                )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Tutup
              </Button>
            </DialogClose>
            {/* Implementasi tombol aksi verifikasi/tolak bisa ditambahkan di sini sesuai kebutuhan user nantinya */}
            <Button 
                type="button" 
                variant="default"
                onClick={async () => {
                    if (!detailPerbaikan) return;
                    const tId = showToast.loading("Memverifikasi...");
                    try {
                        await updateStatusPerbaikanJudul(detailPerbaikan.id, "diterima");
                        showToast.dismiss(tId);
                        showToast.success("Judul berhasil diterima");
                        await revalidateAction("/sekprodi/perbaikan-judul");
                        
                        setDetailPerbaikan(null);
                        router.refresh();
                    } catch (error) {
                         showToast.dismiss(tId);
                         showToast.error("Gagal memverifikasi");
                    }
                }}
            >
              Verifikasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataCard>
  );
}