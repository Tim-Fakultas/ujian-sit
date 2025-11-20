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
  MoreHorizontal,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
      <div className="overflow-x-auto bg-white p-6 rounded-lg dark:bg-[#1f1f1f]">
        {/* Judul dan Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <span className="font-bold text-lg">Rancangan Penelitian</span>
          <div className="flex gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-56">
              <Input
                placeholder="Search"
                value={filterNama}
                onChange={(e) => setFilterNama(e.target.value)}
                className="pl-10  text-sm  rounded-lg bg-white shadow-none focus:ring-0 focus:border-primary placeholder:text-sm"
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
                  className="h-9 px-4 flex items-center gap-2  rounded-lg text-sm font-normal shadow-none min-w-[110px] justify-between"
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
                className="w-52 p-0 rounded-lg  shadow"
                sideOffset={8}
              >
                <div className="p-4">
                  <div className="font-semibold text-sm mb-2 ">Status</div>
                  <div className="flex flex-col gap-1">
                    {statusOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant={
                          filterStatus === opt.value ? "secondary" : "ghost"
                        }
                        size="sm"
                        className={`justify-start w-full text-sm rounded-lg `}
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
            <Button
              className="bg-blue-500 hover:bg-blue-500 text-white text-sm px-5 flex items-center gap-2 rounded-lg min-w-[160px] shadow-none font-medium"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} />
              Pengajuan Ujian
            </Button>
          </div>
        </div>

        <div className="rounded-lg border overflow-auto bg-white dark:bg-[#1f1f1f]">
          {/* Table */}
          <Table>
            <TableHeader className="bg-sidebar-accent">
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
                  (pengajuan: PengajuanRanpel, index: number) => {
                    const judul = pengajuan.ranpel.judulPenelitian || "";
                    const maxLen = 50;
                    const firstLine = judul.slice(0, maxLen);
                    const secondLine =
                      judul.length > maxLen ? judul.slice(maxLen) : "";
                    return (
                      <TableRow
                        key={pengajuan.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <TableCell className="text-center">
                          {(page - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell>{pengajuan.mahasiswa.nama}</TableCell>
                        <TableCell>
                          <div className="break-words max-w-xs ">
                            {firstLine}
                            {secondLine && (
                              <span className="block">{secondLine}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(pengajuan.tanggalPengajuan)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              "px-2 py-1 rounded text-sm " +
                              (pengajuan.status === "menunggu"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : pengajuan.status === "diterima"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : pengajuan.status === "ditolak"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200")
                            }
                          >
                            {pengajuan.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 flex items-center justify-center"
                                aria-label="Aksi"
                              >
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              sideOffset={6}
                              className="w-40"
                            >
                              <DropdownMenuItem
                                onClick={() => handleLihatClick(pengajuan)}
                                className="flex items-center gap-2 text-sm"
                              >
                                <Eye size={14} />
                                Preview
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  }
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

      {/* Card Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
          <div className="max-w-3xl w-full bg-white dark:bg-[#232323] rounded-xl shadow-2xl relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={handleCloseModal}
            >
              ✕
            </Button>
            <div className="p-6 h-[90vh] overflow-y-auto w-full">
              <div className="text-lg font-medium mb-4 ">
                Form Rancangan Penelitian
              </div>
              {user && (
                <Form mahasiswaId={user?.id} onSuccess={handleCloseModal} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
