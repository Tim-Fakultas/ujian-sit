"use client";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  ArrowRight,
  X,
} from "lucide-react";
import { getJenisUjianColor, getStatusColor } from "@/lib/utils";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { User } from "@/types/Auth";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
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
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ListFilter } from "lucide-react";
import { Ujian } from "@/types/Ujian";
import PengajuanUjianForm from "./PengajuanUjianForm";
import { JenisUjian } from "@/types/JenisUjian";
import Link from "next/link";

export default function PendaftaranTable({
  pendaftaranUjian,
  user,
  jenisUjianList,
  pengajuanRanpel,
  ujian,
}: {
  pendaftaranUjian: PendaftaranUjian[];
  user: User | null;
  jenisUjianList: JenisUjian[];
  pengajuanRanpel: PengajuanRanpel[];
  ujian: Ujian[];
}) {
  //* Filter & Pagination State
  const [filterJudul, setFilterJudul] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJenisUjian, setFilterJenisUjian] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  //* Status options
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "dijadwalkan", label: "Dijadwalkan" },
    { value: "selesai", label: "Selesai" },
  ];

  // SORT STATE
  const [sortField, setSortField] = useState<"judul" | "tanggal" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // SORT HANDLER
  function handleSort(field: "judul" | "tanggal") {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  // FILTERED & SORTED DATA
  const filteredData = useMemo(() => {
    let data = (pendaftaranUjian || []).filter((pendaftaran) => {
      const matchJudul = pendaftaran.ranpel.judulPenelitian
        .toLowerCase()
        .includes(filterJudul.toLowerCase());
      const matchStatus =
        filterStatus === "all" ? true : pendaftaran.status === filterStatus;
      const matchJenis =
        filterJenisUjian === "all"
          ? true
          : String(pendaftaran.jenisUjian.id) === filterJenisUjian;
      return matchJudul && matchStatus && matchJenis;
    });

    // SORTING
    if (sortField) {
      data = [...data].sort((a, b) => {
        if (sortField === "judul") {
          const judulA = a.ranpel.judulPenelitian.toLowerCase();
          const judulB = b.ranpel.judulPenelitian.toLowerCase();
          if (judulA < judulB) return sortOrder === "asc" ? -1 : 1;
          if (judulA > judulB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
        if (sortField === "tanggal") {
          const tglA = new Date(a.tanggalPengajuan).getTime();
          const tglB = new Date(b.tanggalPengajuan).getTime();
          if (tglA < tglB) return sortOrder === "asc" ? -1 : 1;
          if (tglA > tglB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
        return 0;
      });
    }

    return data;
  }, [
    pendaftaranUjian,
    filterJudul,
    filterStatus,
    filterJenisUjian,
    sortField,
    sortOrder,
  ]);

  //* Pagination
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Reset page ke 1 jika filter berubah
  useEffect(() => {
    setPage(1);
  }, [filterJudul, filterStatus, filterJenisUjian]);

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-lg shadow-sm">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mb-4">
        <div className="flex gap-2 w-full justify-between">
          <h1 className="font-semibold text-lg">Pendaftaran Ujian</h1>

          <div className="flex gap-2">
            {/* Search */}
            <div className="relative w-full md:w-56">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search size={16} />
              </span>
              <Input
                placeholder="Search"
                value={filterJudul}
                onChange={(e) => setFilterJudul(e.target.value)}
                className="pl-9 w-full text-sm bg-white"
              />
            </div>

            {/* Filter status */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 flex items-center gap-2  rounded-md text-sm font-normal shadow-none min-w-[90px] justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ListFilter size={16} />
                    Status
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-44 p-0 rounded-md  shadow"
                sideOffset={8}
              >
                <div className="p-3">
                  <div className="font-semibold text-sm mb-2 ">Status</div>
                  <div className="flex flex-col gap-1">
                    {statusOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        variant={
                          filterStatus === opt.value ? "secondary" : "ghost"
                        }
                        size="sm"
                        className={`justify-start w-full text-sm rounded-md`}
                        onClick={() => setFilterStatus(opt.value)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 flex items-center gap-2  rounded-md text-sm font-normal shadow-none min-w-[90px] justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ListFilter size={13} />
                    Ujian
                  </span>
                  <ChevronDown size={13} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-44 p-0 rounded-md  shadow"
                sideOffset={8}
              >
                <div className="p-3">
                  <div className="font-semibold text-sm mb-2 ">Jenis Ujian</div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant={
                        filterJenisUjian === "all" ? "secondary" : "ghost"
                      }
                      size="sm"
                      className={`justify-start w-full text-sm rounded-md`}
                      onClick={() => setFilterJenisUjian("all")}
                    >
                      Semua
                    </Button>
                    {jenisUjianList.map((jenis) => (
                      <Button
                        key={jenis.id}
                        variant={
                          filterJenisUjian === String(jenis.id)
                            ? "secondary"
                            : "ghost"
                        }
                        size="sm"
                        className={`justify-start w-full text-sm rounded-md `}
                        onClick={() => setFilterJenisUjian(String(jenis.id))}
                      >
                        {jenis.namaJenis}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm  px-4 flex items-center gap-2 rounded-md min-w-[90px] shadow-none"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Ajukan Ujian
            </Button>
          </div>
        </div>
      </div>
      {/* Popup Modal Form Pengajuan Ujian */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative max-w-2xl w-full bg-white dark:bg-[#232323] rounded-xl shadow-2xl overflow-auto">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setShowForm(false)}
              aria-label="Tutup Form"
            >
              <X size={16} />
            </button>
            <div className="p-6">
              <div className="text-lg font-medium mb-4">
                Form Pengajuan Ujian
              </div>
              {user && (
                <PengajuanUjianForm
                  user={user}
                  jenisUjianList={jenisUjianList}
                  pengajuanRanpel={pengajuanRanpel}
                  ujian={ujian}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="border  overflow-auto rounded-lg bg-white dark:bg-[#1f1f1f]">
        <Table className="text-sm">
          <TableHeader className="bg-sidebar-accent">
            <TableRow>
              <TableHead className="text-center w-10">No</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  Judul
                  <button
                    type="button"
                    className="ml-1 p-0.5"
                    onClick={() => handleSort("judul")}
                    aria-label="Urutkan Judul"
                  >
                    {sortField === "judul" ? (
                      sortOrder === "asc" ? (
                        <ChevronUp size={13} className="inline" />
                      ) : (
                        <ChevronDown size={13} className="inline" />
                      )
                    ) : (
                      <ChevronDown size={13} className="inline text-gray-400" />
                    )}
                  </button>
                </div>
              </TableHead>
              <TableHead>Jenis Ujian</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  Tanggal Pengajuan
                  <button
                    type="button"
                    className="ml-1 p-0.5"
                    onClick={() => handleSort("tanggal")}
                    aria-label="Urutkan Tanggal Pengajuan"
                  >
                    {sortField === "tanggal" ? (
                      sortOrder === "asc" ? (
                        <ChevronUp size={13} className="inline" />
                      ) : (
                        <ChevronDown size={13} className="inline" />
                      )
                    ) : (
                      <ChevronDown size={13} className="inline text-gray-400" />
                    )}
                  </button>
                </div>
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((pendaftaran, index: number) => (
                <TableRow
                  key={pendaftaran.id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell className="text-center">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="whitespace-pre-line break-words max-w-xs">
                      {pendaftaran.ranpel.judulPenelitian}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold inline-block
                        ${getJenisUjianColor(pendaftaran.jenisUjian.namaJenis)}
                        ${
                          pendaftaran.jenisUjian.namaJenis === "Ujian Proposal"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                            : pendaftaran.jenisUjian.namaJenis === "Ujian Hasil"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
                        }
                      `}
                    >
                      {pendaftaran.jenisUjian.namaJenis}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(pendaftaran.tanggalPengajuan).toLocaleDateString(
                      "id-ID"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-sm
                        ${getStatusColor(pendaftaran.status)}
                        ${
                          pendaftaran.status === "menunggu"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : pendaftaran.status === "diterima"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : pendaftaran.status === "ditolak"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : pendaftaran.status === "dijadwalkan"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : pendaftaran.status === "selesai"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                            : ""
                        }
                      `}
                    >
                      {pendaftaran.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {/* MoreHorizontal popover aksi */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-1 h-7 w-7"
                          aria-label="Aksi"
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-48 p-3 rounded-lg border border-blue-100 shadow-lg"
                        sideOffset={8}
                      >
                        <Link href={`/mahasiswa/jadwal-ujian`} passHref>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full flex items-center justify-between gap-2 text-sm px-3 py-2 rounded-lg  font-medium transition"
                          >
                            <span className="flex items-center gap-2">
                              Lihat Jadwal Ujian
                            </span>
                            <ArrowRight size={16} />
                          </Button>
                        </Link>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
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
  );
}
