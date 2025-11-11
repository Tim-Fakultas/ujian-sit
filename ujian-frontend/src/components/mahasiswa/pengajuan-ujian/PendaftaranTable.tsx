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
import { Plus, Search, ChevronDown, ChevronUp } from "lucide-react";
import { getJenisUjianColor, getStatusColor, truncateTitle } from "@/lib/utils";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PengajuanUjianForm from "./PengajuanUjianForm";
import { JenisUjian } from "@/types/JenisUjian";

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

  return (
    <div className="">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mb-4">
        <div className="flex gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search size={14} />
            </span>
            <Input
              placeholder="Search"
              value={filterJudul}
              onChange={(e) => setFilterJudul(e.target.value)}
              className="pl-9 w-full h-8 text-xs placeholder:text-xs"
            />
          </div>

          {/* Filter status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 flex items-center gap-2 border border-gray-200 rounded-md text-xs font-normal shadow-none min-w-[90px] justify-between"
                style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,.05)" }}
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={13} />
                  Status
                </span>
                <ChevronDown size={13} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-44 p-0 rounded-md border border-gray-200 shadow"
              sideOffset={8}
            >
              <div className="p-3">
                <div className="font-semibold text-xs mb-2 text-gray-700">
                  Status
                </div>
                <div className="flex flex-col gap-1">
                  {statusOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={filterStatus === opt.value ? "default" : "ghost"}
                      size="sm"
                      className={`justify-start w-full text-xs rounded-md ${
                        filterStatus === opt.value
                          ? "bg-blue-100 text-blue-400 border-blue-400"
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
          {/* Filter jenis ujian */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 flex items-center gap-2 border border-gray-200 rounded-md text-xs font-normal shadow-none min-w-[90px] justify-between"
                style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,.05)" }}
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
              className="w-44 p-0 rounded-md border border-gray-200 shadow"
              sideOffset={8}
            >
              <div className="p-3">
                <div className="font-semibold text-xs mb-2 text-gray-700">
                  Jenis Ujian
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant={filterJenisUjian === "all" ? "default" : "ghost"}
                    size="sm"
                    className={`justify-start w-full text-xs rounded-md ${
                      filterJenisUjian === "all"
                        ? "bg-blue-100 text-blue-400 border-blue-400"
                        : ""
                    }`}
                    onClick={() => setFilterJenisUjian("all")}
                  >
                    Semua
                  </Button>
                  {jenisUjianList.map((jenis) => (
                    <Button
                      key={jenis.id}
                      variant={
                        filterJenisUjian === String(jenis.id)
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      className={`justify-start w-full text-xs rounded-md ${
                        filterJenisUjian === String(jenis.id)
                          ? "bg-blue-100 text-blue-400 border-blue-400"
                          : ""
                      }`}
                      onClick={() => setFilterJenisUjian(String(jenis.id))}
                    >
                      {jenis.namaJenis}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* Tambah Pengajuan Ujian */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-400 hover:bg-blue-500 text-white text-xs h-8 px-4 flex items-center gap-2 rounded-md min-w-[90px] shadow-none">
                <Plus size={13} />
                Pengajuan Ujian
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogTitle className="text-lg font-medium mb-4">
                Form Pengajuan Ujian
              </DialogTitle>
              {user && (
                <PengajuanUjianForm
                  user={user}
                  jenisUjianList={jenisUjianList}
                  pengajuanRanpel={pengajuanRanpel}
                  ujian={ujian}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="border overflow-auto rounded-sm">
        <Table className="text-xs">
          <TableHeader>
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
                      className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getJenisUjianColor(
                        pendaftaran.jenisUjian.namaJenis
                      )}`}
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
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        pendaftaran.status
                      )}`}
                    >
                      {pendaftaran.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
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
