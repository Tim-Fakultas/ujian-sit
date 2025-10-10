"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Eye, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type untuk data peminatan
interface Peminatan {
  id: string;
  nama: string;
  kode: string;
  deskripsi: string;
  status: "aktif" | "nonaktif";
  totalMahasiswa: number;
  tanggalDibuat: string;
  tanggalDiperbarui: string;
}

// Mock data peminatan
const peminatanData: Peminatan[] = [
  {
    id: "1",
    nama: "Pengembangan Sistem Informasi",
    kode: "PSI",
    deskripsi: "Peminatan yang fokus pada pengembangan sistem informasi ",
    status: "aktif",
    totalMahasiswa: 45,
    tanggalDibuat: "2023-01-15",
    tanggalDiperbarui: "2024-01-10",
  },
  {
    id: "2",
    nama: "Sistem Informasi Analisis",
    kode: "SIA",
    deskripsi:
      "Peminatan yang fokus pada analisis sistem informasi dan pengambilan keputusan berbasis data",
    status: "aktif",
    totalMahasiswa: 38,
    tanggalDibuat: "2023-01-15",
    tanggalDiperbarui: "2024-01-05",
  },
  {
    id: "3",
    nama: "Data Analis",
    kode: "DTA",
    deskripsi:
      "Peminatan yang fokus pada pengelolaan dan analisis data besar (big data)",
    status: "aktif",
    totalMahasiswa: 32,
    tanggalDibuat: "2023-01-15",
    tanggalDiperbarui: "2023-12-20",
  },
];

const statusColors = {
  aktif: "bg-green-100 text-green-700",
  nonaktif: "bg-red-100 text-red-700",
};

const statusLabels = {
  aktif: "Aktif",
  nonaktif: "Non-aktif",
};

export default function DaftarPeminatanPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selected, setSelected] = useState<Peminatan | null>(null);
  const [editData, setEditData] = useState<Peminatan | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredData = peminatanData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeTab === "all" ? true : item.status === activeTab;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (item: Peminatan) => {
    setEditData(item);
  };

  const handleDelete = (item: Peminatan) => {
    if (
      confirm(`Apakah Anda yakin ingin menghapus peminatan "${item.nama}"?`)
    ) {
      // Handle delete logic here
      console.log("Delete:", item.id);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Daftar Peminatan
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola peminatan dan konsentrasi program studi
            </p>
          </div>
          <Button className="rounded" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Peminatan
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama atau kode peminatan..."
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              Semua ({peminatanData.length})
            </button>
            <button
              onClick={() => setActiveTab("aktif")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "aktif"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Aktif ({peminatanData.filter((i) => i.status === "aktif").length})
            </button>
            <button
              onClick={() => setActiveTab("nonaktif")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "nonaktif"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Non-aktif (
              {peminatanData.filter((i) => i.status === "nonaktif").length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead >Nama Peminatan</TableHead>
                <TableHead className="text-center">Total Mahasiswa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
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
                    <TableCell className="font-mono font-medium">
                      {item.kode}
                    </TableCell>
                    <TableCell className="max-w-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <div className="font-medium">{item.nama}</div>
                              <TooltipContent className="max-w-xs">
                                {item.nama}
                              </TooltipContent>
                            </div>
                          </TooltipTrigger>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.totalMahasiswa}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[item.status]} border-0`}
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.tanggalDibuat}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-md">
                          <DropdownMenuItem
                            onClick={() => setSelected(item)}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(item)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Tidak ada data peminatan
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

        {/* Create/Edit Dialog */}
        <Dialog
          open={isCreateOpen || !!editData}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditData(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
            <DialogHeader>
              <DialogTitle>
                {editData ? "Edit Peminatan" : "Tambah Peminatan Baru"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Kode Peminatan *
                  </label>
                  <Input
                    placeholder="Contoh: SI, RPL, JK"
                    defaultValue={editData?.kode}
                    className="mt-1 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status *</label>
                  <Select defaultValue={editData?.status || "aktif"}>
                    <SelectTrigger className="mt-1 rounded">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="nonaktif">Non-aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Nama Peminatan *</label>
                <Input
                  placeholder="Nama lengkap peminatan"
                  defaultValue={editData?.nama}
                  className="mt-1 rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <p className="text-xs text-gray-500 mb-2">
                  Jelaskan fokus pembelajaran dan kompetensi yang akan dicapai
                  dalam peminatan ini.
                </p>
                <Textarea
                  placeholder="Deskripsi peminatan..."
                  defaultValue={editData?.deskripsi}
                  className="mt-1 rounded"
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditData(null);
                  }}
                >
                  Batal
                </Button>
                <Button className="rounded">
                  {editData ? "Simpan Perubahan" : "Tambah Peminatan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Detail Peminatan</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Kode</label>
                      <Input
                        value={selected.kode}
                        readOnly
                        className="mt-1 rounded font-mono"
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
                    <label className="text-sm font-medium">
                      Nama Peminatan
                    </label>
                    <Input
                      value={selected.nama}
                      readOnly
                      className="mt-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deskripsi</label>
                    <Textarea
                      value={selected.deskripsi}
                      readOnly
                      className="mt-1 rounded"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Total Mahasiswa
                      </label>
                      <Input
                        value={selected.totalMahasiswa.toString()}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Tanggal Dibuat
                      </label>
                      <Input
                        value={selected.tanggalDibuat}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Terakhir Diperbarui
                    </label>
                    <Input
                      value={selected.tanggalDiperbarui}
                      readOnly
                      className="mt-1 rounded"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Tutup
                  </Button>
                  <Button
                    onClick={() => {
                      setSelected(null);
                      handleEdit(selected);
                    }}
                  >
                    Edit Peminatan
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
