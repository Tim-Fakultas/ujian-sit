"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import { formatDate, truncateTitle } from "@/lib/utils";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { useEffect, useState } from "react";
import PDFPreviewModal from "../dosen/PDFPreviewModal";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ListFilter } from "lucide-react";
import { Input } from "../ui/input";

const STATUS_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "diterima", label: "Diterima" },
  { value: "diverifikasi", label: "Diverifikasi" },
];

export default function PengajuanTableClient({
  pengajuanRanpel,
}: {
  pengajuanRanpel: PengajuanRanpel[];
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false); // default: terbaru (desc)
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<
    "nama" | "judul" | "tanggal" | null
  >("tanggal");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // default: terbaru

  // Filter & sort
  const filteredData = pengajuanRanpel
    .filter((p) => (filterStatus === "all" ? true : p.status === filterStatus))
    .filter((p) =>
      search.trim() === ""
        ? true
        : p.mahasiswa.nama.toLowerCase().includes(search.toLowerCase())
    );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === "nama") {
      const namaA = a.mahasiswa.nama.toLowerCase();
      const namaB = b.mahasiswa.nama.toLowerCase();
      if (namaA < namaB) return sortOrder === "asc" ? -1 : 1;
      if (namaA > namaB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
    if (sortField === "judul") {
      const judulA = (a.ranpel.judulPenelitian || "").toLowerCase();
      const judulB = (b.ranpel.judulPenelitian || "").toLowerCase();
      if (judulA < judulB) return sortOrder === "asc" ? -1 : 1;
      if (judulA > judulB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
    // tanggal
    const dateA = new Date(a.tanggalPengajuan).getTime();
    const dateB = new Date(b.tanggalPengajuan).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Pagination
  const total = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginatedData = sortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [filterStatus, search, sortAsc]);

  // Modal handlers
  const handleLihatClick = (pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPengajuan(null);
  };

  // Pagination logic with ellipsis
  function getPaginationItems(current: number, total: number) {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    }
    if (current >= total - 2) {
      return [1, "...", total - 3, total - 2, total - 1, total];
    }
    return [1, "...", current - 1, current, current + 1, "...", total];
  }

  const paginationItems = getPaginationItems(page, totalPages);

  // Sort handler
  function handleSort(field: "nama" | "judul" | "tanggal") {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "tanggal" ? "desc" : "asc");
    }
  }

  return (
    <div className="bg-white p-6 dark:bg-[#1f1f1f] rounded-lg">
      {/* Filter Status & Search */}

      <div className="flex  items-center justify-between gap-4 mb-6">
        <span className="text-lg font-semibold">Rancangan Penelitian</span>
        <div className="flex w-full md:w-auto gap-2 md:justify-end ">
          {/* Search */}
          <div className="relative w-full md:w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search size={16} />
            </span>
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full  rounded-md px-3 py-2 pl-9 text-sm "
            />
          </div>
          {/* Filter Status Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 flex items-center gap-2  rounded-lg text-xs font-normal shadow-none min-w-[110px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={15} />
                  Filter
                </span>
                <ChevronDown size={15} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-44 p-0 rounded-md  shadow"
              sideOffset={8}
            >
              <div className="p-3">
                <div className="font-semibold text-xs mb-2 ">Status</div>
                <div className="flex flex-col gap-1">
                  {STATUS_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={
                        filterStatus === opt.value ? "secondary" : "ghost"
                      }
                      size="sm"
                      className={`justify-start w-full text-xs rounded-md`}
                      onClick={() => setFilterStatus(opt.value)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">No</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  Nama Mahasiswa
                  <button
                    type="button"
                    className="ml-1 p-0.5"
                    onClick={() => handleSort("nama")}
                    aria-label="Urutkan Nama"
                  >
                    {sortField === "nama" ? (
                      sortOrder === "asc" ? (
                        <ChevronUp size={13} />
                      ) : (
                        <ChevronDown size={13} />
                      )
                    ) : (
                      <ChevronDown size={13} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  Judul Rancangan Penelitian
                  <button
                    type="button"
                    className="ml-1 p-0.5"
                    onClick={() => handleSort("judul")}
                    aria-label="Urutkan Judul"
                  >
                    {sortField === "judul" ? (
                      sortOrder === "asc" ? (
                        <ChevronUp size={13} />
                      ) : (
                        <ChevronDown size={13} />
                      )
                    ) : (
                      <ChevronDown size={13} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  <span>Tanggal Pengajuan</span>
                  <button
                    type="button"
                    className="ml-1 p-0.5"
                    onClick={() => handleSort("tanggal")}
                    aria-label="Urutkan Tanggal"
                  >
                    {sortField === "tanggal" ? (
                      sortOrder === "asc" ? (
                        <ChevronUp size={13} />
                      ) : (
                        <ChevronDown size={13} />
                      )
                    ) : (
                      <ChevronDown size={13} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((pengajuan, index) => (
                <TableRow
                  key={pengajuan.id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell className="text-center font-medium">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {pengajuan.mahasiswa.nama}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {truncateTitle(pengajuan.ranpel.judulPenelitian)}
                  </TableCell>
                  <TableCell>
                    {formatDate(pengajuan.tanggalPengajuan)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        `px-2 py-1 rounded text-xs font-semibold shadow-sm ` +
                        (pengajuan.status === "menunggu"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : pengajuan.status === "diterima"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : pengajuan.status === "diverifikasi"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : pengajuan.status === "ditolak"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200")
                      }
                    >
                      {pengajuan.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="" // border-gray-300 dihapus
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-32 p-2 rounded-md shadow" //  dihapus
                        sideOffset={8}
                      >
                        <Button
                          onClick={() => handleLihatClick(pengajuan)}
                          variant="ghost"
                          size="sm"
                          className="w-full flex items-center gap-2 justify-start text-xs"
                        >
                          <Eye size={13} />
                          Preview
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-400 py-8"
                >
                  Tidak ada data pengajuan rancangan penelitian.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          {paginationItems.map((item, idx) =>
            item === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-gray-400 select-none"
              >
                ...
              </span>
            ) : (
              <Button
                key={item}
                variant={page === item ? "default" : "outline"}
                size="sm"
                className={`border-gray-300 ${
                  page === item ? "font-bold bg-primary " : ""
                }`}
                onClick={() => setPage(Number(item))}
              >
                {item}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
      {/* PDF Preview Modal */}
      {selectedPengajuan && (
        <PDFPreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pengajuan={selectedPengajuan}
        />
      )}
    </div>
  );
}
