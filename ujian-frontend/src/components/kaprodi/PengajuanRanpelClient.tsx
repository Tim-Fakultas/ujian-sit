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
import { Eye } from "lucide-react";
import { formatDate, truncateTitle } from "@/lib/utils";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import {  useEffect, useState } from "react";
import PDFPreviewModal from "../dosen/PDFPreviewModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
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
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter & sort
  const filteredData =
    filterStatus === "all"
      ? pengajuanRanpel
      : pengajuanRanpel.filter((p) => p.status === filterStatus);
  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.tanggalPengajuan).getTime();
    const dateB = new Date(b.tanggalPengajuan).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
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
  }, [filterStatus, sortAsc]);

  // Modal handlers
  const handleLihatClick = (pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPengajuan(null);
  };


  return (
    <>
      {/* Filter & Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-6">
        <div className="flex items-center gap-2 ">
          <Label className="font-semibold text-sm text-gray-700">
            Filter Status:
          </Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px] border rounded-md px-2 py-1 text-sm focus:outline-none bg-white shadow-sm">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-700">Urutkan:</span>
          <Button
            variant="outline"
            size="sm"
            className="px-2 py-1 text-xs border-gray-300"
            onClick={() => setSortAsc((v) => !v)}
            aria-label="Urutkan Tanggal Pengajuan"
          >
            <span className="mr-1">Tanggal Pengajuan</span>
            <span className="">{sortAsc ? "↑" : "↓"}</span>
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead className="text-center w-12">No</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead>Judul Rancangan Penelitian</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span>Tanggal Pengajuan</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1"
                    onClick={() => setSortAsc((v) => !v)}
                    aria-label="Urutkan Tanggal"
                  >
                    {sortAsc ? (
                      <span className="text-xs">↑</span>
                    ) : (
                      <span className="text-xs">↓</span>
                    )}
                  </Button>
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
                      className={`px-2 py-1 rounded text-xs font-semibold shadow-sm ${
                        pengajuan.status === "menunggu"
                          ? "bg-yellow-100 text-yellow-800"
                          : pengajuan.status === "diterima"
                          ? "bg-green-100 text-green-800"
                          : pengajuan.status === "diverifikasi"
                          ? "bg-blue-100 text-blue-800"
                          : pengajuan.status === "ditolak"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {pengajuan.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() => handleLihatClick(pengajuan)}
                      className="text-xs border-gray-300"
                      variant="outline"
                    >
                      <Eye size={16} className="mr-1" />
                      Preview
                    </Button>
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
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              size="sm"
              className={`border-gray-300 ${
                page === i + 1 ? "font-bold bg-primary text-white" : ""
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
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
    </>
  );
}
