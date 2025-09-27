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
import { FileText, Search, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Bimbingan } from "@/types/Bimbingan";
import { bimbinganData } from "@/lib/constants";

// Warna status
const statusColors = {
  menunggu: "bg-yellow-100 text-yellow-700",
  diterima: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

export default function BimbinganDosenPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Bimbingan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data
  const filteredData = bimbinganData.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true : item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Judul & Deskripsi */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold ">
            Bimbingan Mahasiswa
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Halaman untuk memantau dan memverifikasi pengajuan bimbingan
            mahasiswa.
          </p>
        </div>

        {/* Peringatan */}
        <Alert className="mb-6 bg-blue-50 border-blue-300">
          <AlertTitle className="font-semibold text-blue-800">
            Info Dosen
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            Silakan cek setiap pengajuan bimbingan mahasiswa. Dosen dapat
            menerima atau menolak sesuai kebijakan.
          </AlertDescription>
        </Alert>

        {/* Search + Filter */}
        <div className="bg-white rounded-lg border mb-6 p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari judul..."
              className="pl-10 border-gray-200 w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="menunggu">Menunggu</SelectItem>
              <SelectItem value="diterima">Diterima</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block bg-white rounded-lg border overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Dospem 1</TableHead>
                <TableHead>Dospem 2</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{startIndex + idx + 1}</TableCell>
                    <TableCell>{item.jenis}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.judul}
                    </TableCell>
                    <TableCell>{item.dospem1}</TableCell>
                    <TableCell>{item.dospem2}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[item.status]} border-0`}
                      >
                        {item.status}
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
                  <TableCell colSpan={8} className="text-center py-6">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden space-y-4">
          {currentData.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-gray-900 text-sm">
                  {startIndex + idx + 1}. {item.jenis}
                </h2>
                <Badge
                  className={`${statusColors[item.status]} border-0 text-xs`}
                >
                  {item.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-medium">Judul:</span> {item.judul}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-medium">Dospem 1:</span> {item.dospem1}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-medium">Dospem 2:</span> {item.dospem2}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-medium">Tanggal:</span> {item.tanggal}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full"
                onClick={() => setSelected(item)}
              >
                <FileText className="h-4 w-4 mr-1" /> Detail
              </Button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
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
          </div>
        )}

        {/* Dialog Detail (Sisi Dosen) */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Detail Bimbingan</DialogTitle>
                  <DialogDescription>
                    Informasi lengkap pengajuan bimbingan.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Jenis Bimbingan
                    </label>
                    <Input value={selected.jenis} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Judul</label>
                    <Textarea value={selected.judul} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Dosen Pembimbing 1
                    </label>
                    <Input value={selected.dospem1} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Dosen Pembimbing 2
                    </label>
                    <Input value={selected.dospem2} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Input value={selected.status} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tanggal</label>
                    <Input value={selected.tanggal} disabled />
                  </div>
                </div>

                <DialogFooter className="flex justify-between sm:justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Tutup
                  </Button>
                  {selected.status === "menunggu" && (
                    <>
                      <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Terima
                      </Button>
                      <Button className="bg-rose-500 hover:bg-rose-600 text-white">
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
