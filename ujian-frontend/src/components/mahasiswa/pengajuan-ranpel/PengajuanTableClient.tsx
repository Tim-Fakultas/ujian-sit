"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import PDFPreviewModal from "./PDFPreviewModal";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  ListFilter,
} from "lucide-react";
import { truncateTitle } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Form from "./Form";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type SortKey = "no" | "nama" | "judul" | "tanggal";
type SortOrder = "asc" | "desc";

export default function PengajuanTableClient({
  data,
}: {
  data: PengajuanRanpel[];
}) {
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter & Pagination State
  const [filterNama, setFilterNama] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Sort State
  const [sortKey, setSortKey] = useState<SortKey>("no");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Status options
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "diverifikasi", label: "Diverifikasi" },
  ];

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((pengajuan) => {
      const matchNama = pengajuan.mahasiswa.nama
        .toLowerCase()
        .includes(filterNama.toLowerCase());
      const matchStatus =
        filterStatus === "all" ? true : pengajuan.status === filterStatus;
      return matchNama && matchStatus;
    });
  }, [data, filterNama, filterStatus]);

  // Sorted data
  const sortedData = useMemo(() => {
    const arr = [...filteredData];
    arr.sort((a, b) => {
      if (sortKey === "no") {
        // No = urutan, default by id
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      }
      if (sortKey === "nama") {
        return sortOrder === "asc"
          ? a.mahasiswa.nama.localeCompare(b.mahasiswa.nama)
          : b.mahasiswa.nama.localeCompare(a.mahasiswa.nama);
      }
      if (sortKey === "judul") {
        return sortOrder === "asc"
          ? a.ranpel.judulPenelitian.localeCompare(b.ranpel.judulPenelitian)
          : b.ranpel.judulPenelitian.localeCompare(a.ranpel.judulPenelitian);
      }
      if (sortKey === "tanggal") {
        return sortOrder === "asc"
          ? new Date(a.tanggalPengajuan).getTime() -
              new Date(b.tanggalPengajuan).getTime()
          : new Date(b.tanggalPengajuan).getTime() -
              new Date(a.tanggalPengajuan).getTime();
      }
      return 0;
    });
    return arr;
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPage = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  // Reset page ke 1 jika filter berubah
  useEffect(() => {
    setPage(1);
  }, [filterNama, filterStatus]);

  // Sort handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID");
    } catch {
      return dateString;
    }
  };

  const handleLihatClick = (pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPengajuan(null);
  };

  const { user } = useAuthStore();

  return (
    <>
      <div className="overflow-x-auto">
        {/* Search & Filter Bar */}
        <div className="flex justify-end mb-4">
          <div className="flex gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Search"
                value={filterNama}
                onChange={(e) => setFilterNama(e.target.value)}
                className="pl-10 h-9 text-xs border border-gray-200 rounded-lg bg-white shadow-none focus:ring-0 focus:border-primary placeholder:text-xs"
                style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,.05)" }}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search size={16} />
              </span>
            </div>
            {/* Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4 flex items-center gap-2 border border-gray-200 rounded-lg text-xs font-normal shadow-none min-w-[110px] justify-between"
                  style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,.05)" }}
                >
                  <span className="flex items-center gap-2">
                    <ListFilter size={16} />
                    Filter
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-56 p-0 rounded-lg border border-gray-200 shadow"
                sideOffset={8}
              >
                <div className="p-4">
                  <div className="font-semibold text-xs mb-2 text-gray-700">
                    Status
                  </div>
                  <div className="flex flex-col gap-1">
                    {statusOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant={
                          filterStatus === opt.value ? "default" : "ghost"
                        }
                        size="sm"
                        className={`justify-start w-full text-xs rounded-lg ${
                          filterStatus === opt.value
                            ? "bg-violet-100 text-violet-700 border-violet-400"
                            : ""
                        }`}
                        onClick={() => setFilterStatus(opt.value)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {/* Add Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-400 hover:bg-blue-500 text-white text-xs h-9 px-5 flex items-center gap-2 rounded-lg min-w-[160px] shadow-none font-medium">
                  <Plus size={16} />
                  Pengajuan Ujian
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogTitle className="text-lg font-medium mb-4">
                  Form Rancangan Penelitian
                </DialogTitle>
                {user && <Form mahasiswaId={user?.id} />}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="rounded-sm border overflow-auto">
          {/* Table */}
          <Table>
            <TableHeader className="bg-white border-b border-gray-200">
              <TableRow>
                <TableHead
                  className="text-center font-semibold cursor-pointer select-none whitespace-nowrap pr-2"
                  onClick={() => handleSort("no")}
                >
                  <div className="flex items-center justify-center gap-1">
                    No
                    <span>
                      {sortKey === "no" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={10} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={10} className="text-gray-500" />
                        )
                      ) : (
                        <ChevronDown size={10} className="opacity-30" />
                      )}
                    </span>
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold cursor-pointer select-none whitespace-nowrap pr-2"
                  onClick={() => handleSort("nama")}
                >
                  <div className="flex items-center gap-1">
                    Nama Mahasiswa
                    <span>
                      {sortKey === "nama" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={10} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={10} className="text-gray-500" />
                        )
                      ) : (
                        <ChevronDown size={10} className="opacity-30" />
                      )}
                    </span>
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold cursor-pointer select-none whitespace-nowrap pr-2"
                  onClick={() => handleSort("judul")}
                >
                  <div className="flex items-center gap-1">
                    Judul Penelitian
                    <span>
                      {sortKey === "judul" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={10} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={10} className="text-gray-500" />
                        )
                      ) : (
                        <ChevronDown size={10} className="opacity-30" />
                      )}
                    </span>
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold cursor-pointer select-none whitespace-nowrap pr-2"
                  onClick={() => handleSort("tanggal")}
                >
                  <div className="flex items-center gap-1">
                    Tanggal Pengajuan
                    <span>
                      {sortKey === "tanggal" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp size={10} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={10} className="text-gray-500" />
                        )
                      ) : (
                        <ChevronDown size={10} className="opacity-30" />
                      )}
                    </span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-center font-semibold">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map(
                  (pengajuan: PengajuanRanpel, index: number) => (
                    <TableRow
                      key={pengajuan.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <TableCell className="text-center">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell>{pengajuan.mahasiswa.nama}</TableCell>
                      <TableCell
                        title={pengajuan.ranpel.judulPenelitian}
                        className="max-w-xs truncate"
                      >
                        {truncateTitle(pengajuan.ranpel.judulPenelitian)}
                      </TableCell>
                      <TableCell>
                        {formatDate(pengajuan.tanggalPengajuan)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            pengajuan.status === "menunggu"
                              ? "bg-yellow-100 text-yellow-800"
                              : pengajuan.status === "diterima"
                              ? "bg-green-100 text-green-800"
                              : pengajuan.status === "ditolak"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {pengajuan.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          onClick={() => handleLihatClick(pengajuan)}
                          className="text-xs"
                        >
                          <Eye className="mr-1" size={14} />
                          Preview
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-400 italic"
                  >
                    Tidak ada data pengajuan rancangan penelitian.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        {totalPage > 1 && (
          <div className="mt-4 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={page === 1}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPage }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                    aria-disabled={page === totalPage}
                    className={
                      page === totalPage ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      {/* PDF Preview Modal */}
      {selectedPengajuan && (
        <PDFPreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pengajuan={selectedPengajuan}
        />
      )}
    </>
  );
}
