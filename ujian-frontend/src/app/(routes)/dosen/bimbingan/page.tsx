"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Search, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Bimbingan } from "@/types/Bimbingan";
import { bimbinganData } from "@/lib/constants";

// Warna status
const statusColors = {
  menunggu: "bg-orange-100 text-orange-700",
  diterima: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

const statusLabels = {
  menunggu: "Menunggu",
  diterima: "Diterima",
  ditolak: "Ditolak",
};

export default function BimbinganDosenPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState<Bimbingan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter data
  const filteredData = bimbinganData.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeTab === "all" ? true : item.status === activeTab;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Bimbingan Mahasiswa
          </h1>
          <p className="text-gray-600 mt-1">
            Pantau dan verifikasi pengajuan bimbingan mahasiswa
          </p>
        </div>

        {/* Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-300 rounded">
          <AlertTitle className="font-semibold text-blue-800">
            Info Dosen
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            Silakan cek setiap pengajuan bimbingan mahasiswa. Dosen dapat
            menerima atau menolak sesuai kebijakan.
          </AlertDescription>
        </Alert>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
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
              Semua ({bimbinganData.length})
            </button>
            <button
              onClick={() => setActiveTab("menunggu")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "menunggu"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Menunggu (
              {bimbinganData.filter((i) => i.status === "menunggu").length})
            </button>
            <button
              onClick={() => setActiveTab("diterima")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "diterima"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Diterima (
              {bimbinganData.filter((i) => i.status === "diterima").length})
            </button>
            <button
              onClick={() => setActiveTab("ditolak")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "ditolak"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Ditolak (
              {bimbinganData.filter((i) => i.status === "ditolak").length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Jenis Bimbingan</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Dosen Pembimbing 1</TableHead>
                <TableHead>Dosen Pembimbing 2</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
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
                      <Badge variant="outline">{item.jenis}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md truncate text-gray-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate cursor-help">
                              {item.judul}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            {item.judul}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{item.dospem1}</TableCell>
                    <TableCell>{item.dospem2}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[item.status]} border-0`}
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.tanggal}</TableCell>
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
                  <TableCell colSpan={8} className="text-center py-8">
                    Tidak ada data bimbingan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Footer Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm">Tampil per halaman:</span>
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
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
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
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>

        {/* Dialog Detail */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Detail Bimbingan</DialogTitle>
                  <DialogDescription>
                    Informasi lengkap pengajuan bimbingan.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Jenis Bimbingan
                      </label>
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
                          className={`${
                            statusColors[selected.status]
                          } border-0`}
                        >
                          {statusLabels[selected.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Judul</label>
                    <Textarea
                      value={selected.judul}
                      readOnly
                      className="mt-1 rounded"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Dosen Pembimbing 1
                      </label>
                      <Input
                        value={selected.dospem1}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Dosen Pembimbing 2
                      </label>
                      <Input
                        value={selected.dospem2}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tanggal</label>
                    <Input
                      value={selected.tanggal}
                      readOnly
                      className="mt-1 rounded"
                    />
                  </div>
                </div>

                <DialogFooter className="flex justify-between sm:justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Tutup
                  </Button>
                  {selected.status === "menunggu" && (
                    <>
                      <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Terima
                      </Button>
                      <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded">
                        <XCircle className="h-4 w-4 mr-1" />
                        Tolak
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
