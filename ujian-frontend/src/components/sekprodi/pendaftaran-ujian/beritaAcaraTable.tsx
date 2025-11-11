"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { BeritaUjian } from "@/types/BeritaUjian";
import { Button } from "../../ui/button";
import {
  Eye,
  X,
  FileText,
  ArrowLeft,
  Search,
  MoreHorizontal,
  ListFilter,
  ChevronDown,
} from "lucide-react";
import { truncateTitle } from "@/lib/utils";
import { daftarKehadiran } from "@/types/DaftarKehadiran";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "../../ui/pagination";
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";

export default function BeritaAcaraUjianTable({
  beritaUjian,
  daftarKehadiran,
}: {
  beritaUjian: BeritaUjian[];
  daftarKehadiran: daftarKehadiran[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openLampiran, setOpenLampiran] = useState(false);
  const [selected, setSelected] = useState<BeritaUjian | null>(null);
  // Tambah state untuk search
  const [search, setSearch] = useState("");
  // Tambah state untuk filter jenis ujian
  const [jenisFilter, setJenisFilter] = useState<
    "all" | "proposal" | "hasil" | "skripsi"
  >("all");
  // Tambah state untuk filter hasil
  const [hasilFilter, setHasilFilter] = useState<
    "all" | "lulus" | "tidak lulus"
  >("all");

  // Filter data berdasarkan search, jenis ujian, dan hasil
  const filteredData = beritaUjian.filter((item) => {
    const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
    const judul = item.judulPenelitian?.toLowerCase() ?? "";
    const q = search.toLowerCase();
    const matchSearch = nama.includes(q) || judul.includes(q);

    let matchJenis = true;
    if (jenisFilter !== "all") {
      const jenis = item.jenisUjian?.namaJenis?.toLowerCase() ?? "";
      matchJenis = jenis.includes(jenisFilter);
    }

    let matchHasil = true;
    if (hasilFilter !== "all") {
      matchHasil = (item.hasil?.toLowerCase() ?? "") === hasilFilter;
    }

    return matchSearch && matchJenis && matchHasil;
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Reset page ke 1 saat search atau filter berubah
  React.useEffect(() => {
    setPage(1);
  }, [search, jenisFilter, hasilFilter]);

  const handleDetail = (ujian: BeritaUjian) => {
    setSelected(ujian);
    setOpenDialog(true);
  };

  const getStatusHadir = (dosenId?: number) => {
    if (!dosenId) return null;
    const kehadiran = daftarKehadiran.find((d) => d.dosenId === dosenId);
    return kehadiran?.statusKehadiran ?? null;
  };

  /** 🔹 Modal Wrapper */
  const Modal = ({
    open,
    onClose,
    children,
    title,
    width = "max-w-3xl",
  }: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    width?: string;
  }) => {
    if (!open) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className={`bg-white w-full ${width} mx-4 rounded-xl shadow-xl border animate-in slide-in-from-bottom duration-200 overflow-y-auto max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
          <div className="p-6 space-y-6">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Filter nav & Search input in one row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-4">
        <div className="flex w-full sm:w-auto items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari nama mahasiswa atau judul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg pl-10 pr-3 py-2 w-full text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          {/* Filter jenis ujian dan hasil dengan Popover */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-xs font-medium w-full justify-between"
                >
                  <span className="flex items-center">
                    <ListFilter size={16} className="mr-1" />
                    Filter
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="py-2 px-3 border-b font-semibold text-xs text-muted-foreground">
                  Jenis Ujian
                </div>
                <div className="flex flex-col">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      jenisFilter === "all" ? "bg-accent font-semibold" : ""
                    }`}
                    onClick={() => setJenisFilter("all")}
                  >
                    Semua
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      jenisFilter === "proposal"
                        ? "bg-accent font-semibold"
                        : ""
                    }`}
                    onClick={() => setJenisFilter("proposal")}
                  >
                    Proposal
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      jenisFilter === "hasil" ? "bg-accent font-semibold" : ""
                    }`}
                    onClick={() => setJenisFilter("hasil")}
                  >
                    Hasil
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      jenisFilter === "skripsi" ? "bg-accent font-semibold" : ""
                    }`}
                    onClick={() => setJenisFilter("skripsi")}
                  >
                    Skripsi
                  </Button>
                </div>
                <div className="py-2 px-3 border-b font-semibold text-xs text-muted-foreground mt-2">
                  Hasil
                </div>
                <div className="flex flex-col">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      hasilFilter === "all" ? "bg-accent font-semibold" : ""
                    }`}
                    onClick={() => setHasilFilter("all")}
                  >
                    Semua
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      hasilFilter === "lulus" ? "bg-accent font-semibold" : ""
                    }`}
                    onClick={() => setHasilFilter("lulus")}
                  >
                    Lulus
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      hasilFilter === "tidak lulus"
                        ? "bg-accent font-semibold"
                        : ""
                    }`}
                    onClick={() => setHasilFilter("tidak lulus")}
                  >
                    Tidak Lulus
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="border rounded-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-center">No</TableHead>
              <TableHead>Mahasiswa</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead className="text-center">Nilai Akhir</TableHead>
              <TableHead className="text-center">Hasil</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((ujian, idx) => (
                <TableRow
                  key={ujian.id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell className="text-center">
                    {(page - 1) * pageSize + idx + 1}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">
                      {ujian.mahasiswa?.nama ?? "-"} <br />
                    </span>
                    <span className="text-xs text-gray-500">
                      {ujian.mahasiswa.nim ?? "-"}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {truncateTitle(ujian.judulPenelitian ?? "-", 50)}
                  </TableCell>
                  <TableCell>
                    {/* Badge style for jenis ujian */}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        ujian.jenisUjian?.namaJenis
                          ?.toLowerCase()
                          .includes("proposal")
                          ? "bg-blue-100 text-blue-700"
                          : ujian.jenisUjian?.namaJenis
                              ?.toLowerCase()
                              .includes("hasil")
                          ? "bg-yellow-100 text-yellow-700"
                          : ujian.jenisUjian?.namaJenis
                              ?.toLowerCase()
                              .includes("skripsi")
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    `}
                    >
                      {ujian.jenisUjian?.namaJenis ?? "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {ujian.nilaiAkhir ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {/* Status style for hasil */}
                    {ujian.hasil ? (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          ujian.hasil.toLowerCase() === "lulus"
                            ? "bg-green-100 text-green-700"
                            : ujian.hasil.toLowerCase() === "tidak lulus"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ujian.hasil}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDetail(ujian)}
                      className="hover:bg-gray-200"
                    >
                      <MoreHorizontal size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 italic py-6"
                >
                  Tidak ada berita acara ujian
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
      {/* ========== MODAL DETAIL ========== */}
      <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Detail Berita Acara Ujian"
      >
        {selected && (
          <div className="space-y-6">
            <div className="bg-gray-50 border rounded-lg p-4 text-xs text-gray-800">
              Pada hari{" "}
              <span className="font-semibold underline">
                {selected.hariUjian ?? "Senin"}
              </span>
              , tanggal{" "}
              <span className="font-semibold underline">
                {selected.jadwalUjian
                  ? new Date(selected.jadwalUjian).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "[tanggal]"}
              </span>{" "}
              telah dilaksanakan{" "}
              {selected.jenisUjian?.namaJenis?.toLowerCase() ?? "ujian skripsi"}
              .
            </div>

            {/* Info Mahasiswa */}
            <div className="border rounded-lg p-4 space-y-2 bg-white">
              <div>
                <span className="text-xs text-gray-600">Nama Mahasiswa</span>
                <p className="font-medium text-gray-900">
                  {selected.mahasiswa?.nama ?? "-"}
                </p>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-600">Judul Penelitian</span>
                <p className="font-medium text-gray-900 leading-relaxed">
                  {selected.judulPenelitian ?? "-"}
                </p>
              </div>
            </div>

            {/* Kehadiran Penguji */}
            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-center w-10">No</TableHead>
                    <TableHead>Nama Dosen</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead className="text-center">Kehadiran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { label: "Ketua Penguji", dosen: selected.ketuaPenguji },
                    {
                      label: "Sekretaris Penguji",
                      dosen: selected.sekretarisPenguji,
                    },
                    { label: "Penguji I", dosen: selected.penguji1 },
                    { label: "Penguji II", dosen: selected.penguji2 },
                  ].map((row, i) => {
                    const status = getStatusHadir(row.dosen?.id);
                    let color = "bg-gray-100 text-gray-700";
                    let text = "Tidak Hadir";
                    if (status === "hadir") {
                      color = "bg-green-100 text-green-700";
                      text = "Hadir";
                    } else if (status === "izin") {
                      color = "bg-yellow-100 text-yellow-700";
                      text = "Izin";
                    }
                    return (
                      <TableRow key={i}>
                        <TableCell className="text-center">{i + 1}</TableCell>
                        <TableCell>{row.dosen?.nama ?? "-"}</TableCell>
                        <TableCell>{row.label}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${color}`}
                          >
                            {text}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Keputusan */}
            <div className="border-t pt-4 text-gray-800 leading-relaxed">
              <span className="font-bold">MEMUTUSKAN:</span> Proposal saudara
              dinyatakan{" "}
              <span
                className={`font-semibold underline px-2 py-1 rounded text-xs ml-1 ${
                  selected?.hasil?.toLowerCase() === "lulus"
                    ? "bg-green-100 text-green-700"
                    : selected?.hasil?.toLowerCase() === "tidak lulus"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {selected?.hasil?.toUpperCase() || "DITERIMA / DITOLAK"}
              </span>{" "}
              dengan catatan terlampir.
            </div>

            {/* Tombol bawah */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => {
                  setOpenDialog(false);
                  setOpenLampiran(true);
                }}
              >
                <FileText size={16} />
                Lihat Lampiran
              </Button>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========== MODAL LAMPIRAN ========== */}
      <Modal
        open={openLampiran}
        onClose={() => setOpenLampiran(false)}
        title="Lampiran: Berita Acara Pelaksanaan Ujian"
        width="max-w-4xl"
      >
        {selected && (
          <div className="space-y-4 text-gray-800">
            <div className="mt-2 space-y-1 text-xs">
              <p>
                <span className="text-gray-600">Nama Mahasiswa :</span>{" "}
                <span className="font-medium">
                  {selected.mahasiswa?.nama ?? "-"}
                </span>
              </p>
              <p>
                <span className="text-gray-600">NIM :</span>{" "}
                <span className="font-medium">
                  {selected.mahasiswa?.nim ?? "-"}
                </span>
              </p>
            </div>

            <p className="text-xs font-medium mt-4">
              Catatan/Daftar Revisi Penguji:
            </p>

            <div className="overflow-x-auto border rounded-lg bg-white">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="border p-2 w-10 text-center">
                      No.
                    </TableHead>
                    <TableHead className="border p-2 text-left">
                      Nama Penguji
                    </TableHead>
                    <TableHead className="border p-2 text-left">
                      Uraian
                    </TableHead>
                    <TableHead className="border p-2 text-center">
                      Tanda Tangan
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4].map((i) => (
                    <TableRow key={i}>
                      <TableCell className="border p-2 text-center">
                        {i}.
                      </TableCell>
                      <TableCell className="border p-2"></TableCell>
                      <TableCell className="border p-2"></TableCell>
                      <TableCell className="border p-2"></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end pt-6 border-t mt-6">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  setOpenLampiran(false);
                  setOpenDialog(true);
                }}
              >
                <ArrowLeft size={16} />
                Kembali
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
