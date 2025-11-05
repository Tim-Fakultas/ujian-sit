"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Eye,
  MoreVertical,
  X,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { getJenisUjianColor, getStatusColor } from "@/lib/utils";
import React, { useState, useTransition, useMemo } from "react";
import { updateStatusPendaftaranUjian } from "@/actions/pendaftaranUjian";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Input } from "../ui/input";
import revalidateAction from "@/actions/revalidateAction";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function PendaftaranUjianTable({
  pendaftaranUjian,
}: {
  pendaftaranUjian: PendaftaranUjian[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<PendaftaranUjian | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter & Pagination State
  const [filterJenis, setFilterJenis] = useState<
    "all" | "proposal" | "hasil" | "skripsi"
  >("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Jenis ujian statis
  const jenisUjianOptions = [
    { label: "Semua", value: "all" },
    { label: "Proposal", value: "proposal" },
    { label: "Hasil", value: "hasil" },
    { label: "Skripsi", value: "skripsi" },
  ];

  // Tambah state untuk sorting tanggal pengajuan
  const [sortTanggal, setSortTanggal] = useState<"desc" | "asc">("desc");

  // Filtered & Sorted data
  const filteredData = useMemo(() => {
    let data = pendaftaranUjian.filter((item) => {
      const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
      const judul = item.ranpel?.judulPenelitian?.toLowerCase() ?? "";
      const jenis = item.jenisUjian?.namaJenis?.toLowerCase() ?? "";
      const q = search.toLowerCase();
      const matchSearch = nama.includes(q) || judul.includes(q);
      let matchJenis = true;
      if (filterJenis !== "all") {
        matchJenis = jenis.includes(filterJenis);
      }
      return matchSearch && matchJenis;
    });
    // Sorting tanggal pengajuan (pastikan field tanggalPengajuan dipakai)
    data = data.sort((a, b) => {
      // Gunakan replace(" ", "T") agar format "YYYY-MM-DD HH:mm:ss" valid untuk Date
      const tglA = new Date(a.tanggalPengajuan.replace(" ", "T")).getTime();
      const tglB = new Date(b.tanggalPengajuan.replace(" ", "T")).getTime();
      return sortTanggal === "asc" ? tglA - tglB : tglB - tglA;
    });
    return data;
  }, [pendaftaranUjian, search, filterJenis, sortTanggal]);

  // Pagination
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Reset page ke 1 jika filter berubah
  React.useEffect(() => {
    setPage(1);
  }, [search, filterJenis]);

  function handleDetail(pendaftaran: PendaftaranUjian) {
    setSelected(pendaftaran);
    setShowModal(true);
  }

  async function handleAccept(id: number) {
    try {
      await updateStatusPendaftaranUjian(id, "diterima");
      setShowModal(false);
      const { toast } = await import("sonner");
      toast.success("Successfully!");
      revalidateAction("admin/pendaftaran-ujian");
    } catch (err) {
      alert("Gagal memperbarui status pendaftaran ujian.");
      console.error(err);
    }
  }

  return (
    <div className="rounded-lg overflow-x-auto bg-white shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-4">
        <div className="flex gap-2 w-full sm:w-auto items-center">
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          {/* Filter jenis ujian pakai Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="px-4 py-1 rounded-lg text-xs font-medium border transition flex items-center gap-2"
              >
                <span>
                  {
                    jenisUjianOptions.find((opt) => opt.value === filterJenis)
                      ?.label
                  }
                </span>
                <ChevronDown size={14} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0" align="end">
              <div className="flex flex-col">
                {jenisUjianOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition ${
                      filterJenis === opt.value
                        ? opt.value === "proposal"
                          ? "bg-blue-100 text-blue-700"
                          : opt.value === "hasil"
                          ? "bg-yellow-100 text-yellow-700"
                          : opt.value === "skripsi"
                          ? "bg-green-100 text-green-700"
                          : "bg-violet-50 text-violet-600"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() =>
                      setFilterJenis(opt.value as typeof filterJenis)
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* ...existing code for sort dropdown if any... */}
      </div>

      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead className="text-center w-10">No</TableHead>
            <TableHead>Nama Mahasiswa</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Tanggal Pengajuan
                <button
                  type="button"
                  className="ml-1 p-0.5 rounded hover:bg-gray-100"
                  onClick={() =>
                    setSortTanggal((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  aria-label="Urutkan tanggal"
                >
                  {sortTanggal === "asc" ? (
                    <ChevronUp size={10} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={10} className="text-gray-500" />
                  )}
                </button>
              </div>
            </TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((pendaftaran, index) => (
              <TableRow
                key={pendaftaran.id}
                className="hover:bg-gray-50 transition"
              >
                <TableCell className="text-center">
                  {(page - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell>{pendaftaran.mahasiswa.nama}</TableCell>
                <TableCell
                  className="whitespace-normal break-words max-w-xs"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {pendaftaran.ranpel.judulPenelitian}
                </TableCell>
                <TableCell>
                  {new Date(pendaftaran.tanggalPengajuan).toLocaleDateString(
                    "id-ID"
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getJenisUjianColor(
                      pendaftaran.jenisUjian.namaJenis
                    )}`}
                  >
                    {pendaftaran.jenisUjian.namaJenis}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(
                      pendaftaran.status
                    )}`}
                  >
                    {pendaftaran.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="p-2">
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleDetail(pendaftaran)}
                      >
                        <Eye size={16} />
                        Lihat Detail
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-gray-500 italic py-6"
              >
                Tidak ada data pendaftaran ujian
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {/* Custom Pagination with Dots */}
              {(() => {
                const pages = [];
                const maxShown = 5;
                let start = Math.max(1, page - 2);
                let end = Math.min(totalPage, page + 2);

                if (end - start < maxShown - 1) {
                  if (start === 1) {
                    end = Math.min(totalPage, start + maxShown - 1);
                  } else if (end === totalPage) {
                    start = Math.max(1, end - maxShown + 1);
                  }
                }

                // First page
                if (start > 1) {
                  pages.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        isActive={page === 1}
                        onClick={() => setPage(1)}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                  if (start > 2) {
                    pages.push(
                      <PaginationItem key="start-ellipsis">
                        <span className="px-2 text-gray-400">...</span>
                      </PaginationItem>
                    );
                  }
                }

                // Middle pages
                for (let i = start; i <= end; i++) {
                  pages.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i}
                        onClick={() => setPage(i)}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Last page
                if (end < totalPage) {
                  if (end < totalPage - 1) {
                    pages.push(
                      <PaginationItem key="end-ellipsis">
                        <span className="px-2 text-gray-400">...</span>
                      </PaginationItem>
                    );
                  }
                  pages.push(
                    <PaginationItem key={totalPage}>
                      <PaginationLink
                        isActive={page === totalPage}
                        onClick={() => setPage(totalPage)}
                      >
                        {totalPage}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                return pages;
              })()}
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

      {/* Modal Detail */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800 mb-2">
              Detail Pendaftaran Ujian
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6">
              {/* Info utama */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">
                    Nama Mahasiswa
                  </div>
                  <div className="font-semibold text-gray-900">
                    {selected.mahasiswa?.nama}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">NIM</div>
                  <div className="font-semibold text-gray-900">
                    {selected.mahasiswa?.nim}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-gray-500 mb-0.5">
                    Judul Penelitian
                  </div>
                  <div className="font-medium text-gray-800 leading-snug border rounded px-3 py-2 bg-gray-50">
                    {selected.ranpel?.judulPenelitian}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">
                    Jenis Ujian
                  </div>
                  <div className="text-gray-800">
                    {selected.jenisUjian?.namaJenis}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">
                    Tanggal Pengajuan
                  </div>
                  <div className="text-gray-800">
                    {new Date(selected.tanggalPengajuan).toLocaleDateString(
                      "id-ID"
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Status</div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      selected.status
                    )}`}
                  >
                    {selected.status}
                  </span>
                </div>
              </div>
              {/* Berkas Persyaratan */}
              {selected.berkas && selected.berkas.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-2 font-semibold">
                    Berkas Persyaratan
                  </div>

                  <div className="divide-y rounded-lg border bg-white">
                    {selected.berkas.map((file, idx) => {
                      const fileUrl = `http://localhost:8000/storage/${file.filePath}`;

                      let label = "";
                      if (idx === 0) label = "Transkrip Nilai";
                      else if (idx === 1) label = "Pengesahan Proposal";
                      else if (idx === 2)
                        label = "Surat Keterangan Lulus Plagiasi";
                      else if (idx === 3) label = "Proposal Skripsi";
                      else
                        label =
                          file.namaBerkas ?? fileUrl.split("/").pop() ?? "";

                      return (
                        <div
                          key={idx}
                          className="flex flex-col px-4 py-3 bg-white hover:bg-gray-50 transition"
                        >
                          {/* Baris utama */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Eye
                                size={16}
                                className="text-blue-500 shrink-0"
                              />
                              <span className="font-semibold text-gray-800 shrink-0">
                                {label}
                              </span>
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm font-medium truncate max-w-[250px] hover:text-blue-800 transition"
                                title={
                                  file.namaBerkas || fileUrl.split("/").pop()
                                }
                              >
                                {file.namaBerkas || fileUrl.split("/").pop()}
                              </a>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(fileUrl, "_blank")}
                            >
                              Lihat
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tombol ACC */}
              {selected.status === "menunggu" && (
                <div className="flex justify-end pt-2">
                  <Button
                    variant="default"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() => handleAccept(selected.id))
                    }
                    className="px-6"
                  >
                    {isPending ? "Menyimpan..." : "ACC"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
