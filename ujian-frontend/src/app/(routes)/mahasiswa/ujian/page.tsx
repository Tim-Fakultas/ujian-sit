"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, FileText, Filter, Send } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ujianData, statusColors, statusLabels } from "@/lib/constants";
import { Ujian } from "@/types/Ujian";
import { IconFilter2 } from "@tabler/icons-react";
import TrackingStep from "@/components/tracking";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function HalamanSemuaUjian() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [examTypeFilter, setExamTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selected, setSelected] = useState<Ujian | null>(null);

  const filteredData = ujianData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nim.toLowerCase().includes(search.toLowerCase()) ||
      item.judul.toLowerCase().includes(search.toLowerCase());

    const matchStatus = activeTab === "all" ? true : item.status === activeTab;
    const matchExamType =
      examTypeFilter === "all" ? true : item.jenis === examTypeFilter;

    return matchSearch && matchStatus && matchExamType;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Daftar Ujian
            </h1>
            <p className="text-gray-600 mt-1">
              Lihat semua jadwal dan hasil ujian Anda
            </p>
          </div>

          {/* Tombol Pengajuan Seminar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className=" rounded">
                <Send className="mr-2 h-4 w-4" />
                Pengajuan Seminar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => alert("Form Seminar Proposal dibuka")}
              >
                Seminar Proposal
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => alert("Form Seminar Hasil dibuka")}
              >
                Seminar Hasil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => alert("Form Ujian Skripsi dibuka")}
              >
                Seminar/Ujian Skripsi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Pencarian */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 " />
            <Input
              placeholder="Search"
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
            <SelectTrigger className="w-42 bg-white rounded">
              <IconFilter2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter jenis ujian" />
            </SelectTrigger>
            <SelectContent className="rounded">
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="Seminar Proposal">Seminar Proposal</SelectItem>
              <SelectItem value="Seminar Hasil">Seminar Hasil</SelectItem>
              <SelectItem value="Seminar Skripsi">Seminar Skripsi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "all"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Semua ({ujianData.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "pending"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Menunggu ({ujianData.filter((i) => i.status === "pending").length}
              )
            </button>
            <button
              onClick={() => setActiveTab("dijadwalkan")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "dijadwalkan"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Dijadwalkan (
              {ujianData.filter((i) => i.status === "dijadwalkan").length})
            </button>
            <button
              onClick={() => setActiveTab("selesai")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "selesai"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Selesai ({ujianData.filter((i) => i.status === "selesai").length})
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Nama Mahasiswa</TableHead>
                <TableHead>Jenis Ujian</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.nama}</div>
                        <div className="text-sm text-gray-500">{item.nim}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.jenis}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {item.waktu.split(' ')[0]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[item.status]} border-0`}
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelected(item)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Tidak ada data ujian
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Footer Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm ">Tampil per halaman:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(v) => {
                  setItemsPerPage(parseInt(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 rounded">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          className="rounded"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>

        {/* Dialog Detail */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-2xl rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Detail Ujian</DialogTitle>
                  <DialogDescription>
                    Informasi lengkap mengenai ujian Anda
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">NIM</label>
                      <Input
                        value={selected.nim}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nama Mahasiswa</label>
                      <Input
                        value={selected.nama}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Judul Skripsi</label>
                    <Textarea
                      value={selected.judul}
                      readOnly
                      rows={3}
                      className="mt-1 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Jenis Ujian</label>
                      <Input
                        value={selected.jenis}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <div className="mt-1">
                        <Badge
                          className={`${statusColors[selected.status]} border-0`}
                        >
                          {statusLabels[selected.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Waktu Ujian</label>
                      <Input
                        value={selected.waktu}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ruang</label>
                      <Input
                        value={selected.ruang}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nilai</label>
                    <Input
                      value={selected.nilai || "Belum ada nilai"}
                      readOnly
                      className="mt-1 rounded"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Tutup
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
  
