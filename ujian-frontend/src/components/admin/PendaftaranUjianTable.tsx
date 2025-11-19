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
  Search,
  ChevronDown,
  ChevronUp,
  ListFilter,
  CheckCircle2,
  X,
  MoreHorizontal,
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
import React, { useState, useTransition, useMemo, useEffect } from "react";
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
import revalidateAction from "@/actions/revalidate";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

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
  useEffect(() => {
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
      // custom sonner toast dengan icon dan teks
      toast(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-emerald-500" size={18} />
          <div>
            <div className="font-semibold">Berhasil</div>
            <div className="">Pendaftaran ujian berhasil diterima.</div>
          </div>
        </div>
      );
      revalidateAction("admin/pendaftaran-ujian");
    } catch (err) {
      alert("Gagal memperbarui status pendaftaran ujian.");
      console.error(err);
    }
  }

  async function handleReject(id: number) {
    try {
      await updateStatusPendaftaranUjian(id, "ditolak");
      setShowModal(false);
      toast(
        <div className="flex items-center gap-2">
          <X className="text-rose-500" size={18} />
          <div>
            <div className="font-semibold">Ditolak</div>
            <div className="">Pendaftaran ujian telah ditolak.</div>
          </div>
        </div>
      );
      revalidateAction("admin/pendaftaran-ujian");
    } catch (err) {
      alert("Gagal memperbarui status pendaftaran ujian.");
      console.error(err);
    }
  }

  // State untuk dialog konfirmasi
  const [confirmType, setConfirmType] = useState<null | "accept" | "reject">(
    null
  );

  // Handler tombol ACC/Tolak
  function handleConfirm(type: "accept" | "reject") {
    setConfirmType(type);
  }

  // Handler submit konfirmasi
  function handleConfirmSubmit() {
    if (!selected) return;
    if (confirmType === "accept") {
      startTransition(() => handleAccept(selected.id));
    } else if (confirmType === "reject") {
      startTransition(() => handleReject(selected.id));
    }
    setConfirmType(null);
  }

  return (
    <div className=" dark:bg-[#1f1f1f] p-6 rounded-lg bg-white">
      <div className="flex items-center gap-2 justify-between mb-4">
        <span className="font-semibold text-lg mb-2">Pendaftaran Ujian</span>
        <div className="flex items-center gap-3">
          {/* search */}
          <div className="relative w-full max-w-56 flex items-center gap-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-[#2a2a2a] "
            />
          </div>
          {/* filter jenis */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-4 py-1 rounded-lg  font-medium border transition flex items-center gap-2"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={16} />
                  {
                    jenisUjianOptions.find((opt) => opt.value === filterJenis)
                      ?.label
                  }
                </span>
                <ChevronDown size={14} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-52 p-0 rounded-lg  shadow"
              sideOffset={8}
            >
              <div className="p-2">
                <div className="font-semibold  mb-2 ">Jenis Ujian</div>
                <div className="flex flex-col gap-1">
                  {jenisUjianOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={
                        filterJenis === opt.value ? "secondary" : "ghost"
                      }
                      size="sm"
                      className={`justify-start w-full  rounded-lg`}
                      onClick={() =>
                        setFilterJenis(opt.value as typeof filterJenis)
                      }
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

      {/* Table container */}
      <div className="overflow-auto rounded-lg  dark:bg-[#1f1f1f] border">
        <Table>
          <TableHeader className="bg-sidebar-accent">
            <TableRow>
              <TableHead className="text-center w-10">No</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Tanggal Pengajuan
                  <button
                    type="button"
                    className="ml-1 p-0.5 rounded "
                    onClick={() =>
                      setSortTanggal((prev) =>
                        prev === "asc" ? "desc" : "asc"
                      )
                    }
                    aria-label="Urutkan tanggal"
                  >
                    {sortTanggal === "asc" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
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
                <TableRow key={pendaftaran.id} className="hover: transition">
                  <TableCell className="text-center">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>{pendaftaran.mahasiswa.nama}</TableCell>
                  <TableCell className="whitespace-normal break-words max-w-sm">
                    {pendaftaran.ranpel.judulPenelitian}
                  </TableCell>
                  <TableCell>
                    {new Date(pendaftaran.tanggalPengajuan).toLocaleDateString(
                      "id-ID"
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded font-semibold inline-block
      ${getJenisUjianColor(pendaftaran.jenisUjian.namaJenis)}
      ${
        // Tambahan style untuk dark mode
        "dark:bg-[#23272f] dark:text-blue-300"
      }
    `}
                    >
                      {pendaftaran.jenisUjian.namaJenis}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded font-medium
      ${getStatusColor(pendaftaran.status)}
      ${
        // Tambahan style untuk dark mode
        pendaftaran.status === "menunggu"
          ? "dark:bg-yellow-900 dark:text-yellow-200"
          : pendaftaran.status === "diterima"
          ? "dark:bg-emerald-900 dark:text-emerald-200"
          : pendaftaran.status === "ditolak"
          ? "dark:bg-rose-900 dark:text-rose-200"
          : ""
      }
    `}
                    >
                      {pendaftaran.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="p-2">
                          <MoreHorizontal size={16} />
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
                <TableCell colSpan={7} className="text-center  italic py-6">
                  Tidak ada data pendaftaran ujian
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

      {/* Pop Up Card Detail */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-2xl mx-auto shadow-lg dark:bg-[#1f1f1f] relative overflow-auto h-[90vh] flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-bold mb-2">
                Detail Pendaftaran Ujian
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-between min-h-[350px]">
              <div className="space-y-6">
                {/* Info utama */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <div className="mb-0.5">Nama Mahasiswa</div>
                    <div className="font-semibold text-sm">
                      {selected.mahasiswa?.nama}
                    </div>
                  </div>
                  <div>
                    <div className="mb-0.5">NIM</div>
                    <div className="font-semibold text-sm">
                      {selected.mahasiswa?.nim}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="mb-0.5">Judul Penelitian</div>
                    <div className="font-medium text-sm leading-snug border rounded px-3 py-2 ">
                      {selected.ranpel?.judulPenelitian}
                    </div>
                  </div>
                  <div>
                    <div className="mb-0.5">Jenis Ujian</div>
                    <div className="">{selected.jenisUjian?.namaJenis}</div>
                  </div>
                  <div>
                    <div className="mb-0.5">Tanggal Pengajuan</div>
                    <div className="">
                      {new Date(selected.tanggalPengajuan).toLocaleDateString(
                        "id-ID"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-0.5">Status</div>
                    <span
                      className={`px-2 py-1 rounded font-medium
                        ${getStatusColor(selected.status)}
                        ${
                          selected.status === "menunggu"
                            ? "dark:bg-yellow-900 dark:text-yellow-200"
                            : selected.status === "diterima"
                            ? "dark:bg-emerald-900 dark:text-emerald-200"
                            : selected.status === "ditolak"
                            ? "dark:bg-rose-900 dark:text-rose-200"
                            : ""
                        }
                      `}
                    >
                      {selected.status}
                    </span>
                  </div>
                </div>
                {/* Berkas Persyaratan */}
                {selected.berkas && selected.berkas.length > 0 && (
                  <div>
                    <div className="mb-2 font-semibold">Berkas Persyaratan</div>
                    <div className="divide-y rounded-lg border ">
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
                            className="flex flex-col px-4 py-3 hover:transition"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Eye
                                  size={16}
                                  className="text-blue-500 shrink-0"
                                />
                                <span className="font-semibold shrink-0">
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
              </div>
              {/* Tombol ACC/Tutup selalu di bawah */}
              <div className="flex justify-end gap-3 pt-6 mt-auto">
                {selected.status === "menunggu" && (
                  <>
                    <Button
                      variant="destructive"
                      disabled={isPending}
                      onClick={() => handleConfirm("reject")}
                      className="px-4"
                    >
                      Tolak
                    </Button>
                    <Button
                      variant="default"
                      disabled={isPending}
                      onClick={() => handleConfirm("accept")}
                      className="px-6 bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500"
                    >
                      {isPending ? "Menyimpan..." : "terima"}
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowModal(false);
                    setSelected(null);
                  }}
                  
                  className="px-4"
                >
                  Tutup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialog Konfirmasi ACC/Tolak */}
      <Dialog
        open={!!confirmType}
        onOpenChange={(open) => !open && setConfirmType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmType === "accept"
                ? "Konfirmasi Terima Pendaftaran"
                : "Konfirmasi Tolak Pendaftaran"}
            </DialogTitle>
          </DialogHeader>
          <div>
            {confirmType === "accept"
              ? "Apakah Anda yakin ingin menerima pendaftaran ujian ini?"
              : "Apakah Anda yakin ingin menolak pendaftaran ujian ini?"}
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setConfirmType(null)}>
              Batal
            </Button>
            <Button
              variant={confirmType === "accept" ? "default" : "destructive"}
              onClick={handleConfirmSubmit}
              disabled={isPending}
              className="bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500"
            >
              {confirmType === "accept"
                ? isPending
                  ? "Menyimpan..."
                  : "Terima"
                : isPending
                ? "Menyimpan..."
                : "Tolak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
