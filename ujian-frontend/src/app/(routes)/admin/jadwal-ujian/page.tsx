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
import {
  Search,
  FileText,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconFilter2 } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";

// Dummy data ujian
const ujianData = [
  {
    id: "1",
    nim: "2024001",
    nama: "Ahmad Fajar Setiawan",
    judul:
      "Implementasi Machine Learning untuk Prediksi Harga Saham dengan Algoritma LSTM",
    waktu: "2024-03-15T09:00", // format datetime-local
    ruang: "Lab A101",
    jenis: "Seminar Proposal",
    nilai: "",
    status: "pending" as const,
  },
  {
    id: "2",
    nim: "2024002",
    nama: "Siti Nurhaliza",
    judul: "Pengembangan Sistem Informasi Manajemen Perpustakaan Berbasis Web",
    waktu: "2024-03-18T14:00",
    ruang: "Lab B202",
    jenis: "Seminar Hasil",
    nilai: "",
    status: "dijadwalkan" as const,
  },
  {
    id: "3",
    nim: "2024003",
    nama: "Budi Santoso",
    judul:
      "Analisis Keamanan Jaringan Wireless menggunakan Penetration Testing",
    waktu: "2024-03-12T10:30",
    ruang: "Lab C303",
    jenis: "Seminar Skripsi",
    nilai: "85",
    status: "selesai" as const,
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  dijadwalkan: "bg-blue-100 text-blue-800",
  selesai: "bg-green-100 text-green-800",
};

const statusLabels = {
  pending: "Menunggu",
  dijadwalkan: "Dijadwalkan",
  selesai: "Selesai",
};

type Ujian = {
  id: string;
  nim: string;
  nama: string;
  judul: string;
  waktu: string;
  ruang: string;
  jenis: string;
  nilai?: string;
  status: "pending" | "dijadwalkan" | "selesai";
};

export default function HalamanJadwalUjianAdmin() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [examTypeFilter, setExamTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selected, setSelected] = useState<Ujian | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Ujian | null>(null);
  const [ujianList, setUjianList] = useState(ujianData);

  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    judul: "",
    waktu: "",
    ruang: "",
    jenis: "",
    nilai: "",
    status: "pending" as "pending" | "dijadwalkan" | "selesai",
  });

  const resetForm = () => {
    setFormData({
      nim: "",
      nama: "",
      judul: "",
      waktu: "",
      ruang: "",
      jenis: "",
      nilai: "",
      status: "pending",
    });
  };

  const handleCreate = () => {
    const newUjian: Ujian = {
      id: Date.now().toString(),
      ...formData,
      nilai: formData.nilai || undefined,
    };
    setUjianList([newUjian, ...ujianList]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selected) return;
    setUjianList(
      ujianList.map((item) =>
        item.id === selected.id ? { ...item, ...formData } : item
      )
    );
    setShowEditModal(false);
    setSelected(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    setUjianList(ujianList.filter((item) => item.id !== itemToDelete.id));
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const openEditModal = (item: Ujian) => {
    setSelected(item);
    setFormData({
      nim: item.nim,
      nama: item.nama,
      judul: item.judul,
      waktu: item.waktu,
      ruang: item.ruang,
      jenis: item.jenis,
      nilai: item.nilai || "",
      status: item.status,
    });
    setShowEditModal(true);
  };

  const openDeleteDialog = (item: Ujian) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const filteredData = ujianList.filter((item) => {
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Kelola Jadwal Ujian
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola jadwal dan data ujian mahasiswa
            </p>
          </div>

          <Button onClick={() => setShowCreateModal(true)} className="rounded">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jadwal Ujian
          </Button>
        </div>

        {/* Filter & Search */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama, NIM, atau judul..."
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
        <div className="mb-6 flex gap-2 text-xs">
          {["all", "pending", "dijadwalkan", "selesai"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-3 py-1.5 rounded border ${
                activeTab === status
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status === "all"
                ? `Semua (${ujianList.length})`
                : `${statusLabels[status as keyof typeof statusLabels]} (${
                    ujianList.filter((i) => i.status === status).length
                  })`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>NIM</TableHead>
                <TableHead>Nama Mahasiswa</TableHead>
                <TableHead>Judul Skripsi</TableHead>
                <TableHead>Waktu Ujian</TableHead>
                <TableHead>Ruang</TableHead>
                <TableHead>Jenis Ujian</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>{item.nim}</TableCell>
                    <TableCell>{item.nama}</TableCell>
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
                    <TableCell>
                      {new Date(item.waktu).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell>{item.ruang}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.jenis}</Badge>
                    </TableCell>
                    <TableCell>{item.nilai || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[item.status]} border-0`}
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(item);
                              setShowDetailModal(true);
                            }}
                            className="cursor-pointer"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditModal(item)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(item)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    Tidak ada data ujian
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
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

        {/* Dialog Detail */}
        <Dialog
          open={showDetailModal}
          onOpenChange={() => {
            setShowDetailModal(false);
            setSelected(null);
          }}
        >
          <DialogContent className="sm:max-w-lg rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Detail Ujian</DialogTitle>
                  <DialogDescription>
                    Informasi lengkap mengenai ujian
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">NIM</Label>
                      <Input value={selected.nim} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm">Nama Mahasiswa</Label>
                      <Input value={selected.nama} readOnly className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Judul Skripsi</Label>
                    <Textarea
                      value={selected.judul}
                      readOnly
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Waktu Ujian</Label>
                      <Input
                        value={new Date(selected.waktu).toLocaleString(
                          "id-ID",
                          {
                            dateStyle: "full",
                            timeStyle: "short",
                          }
                        )}
                        readOnly
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Ruang</Label>
                      <Input value={selected.ruang} readOnly className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Jenis Ujian</Label>
                      <Input value={selected.jenis} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm">Nilai</Label>
                      <Input
                        value={selected.nilai || "-"}
                        readOnly
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelected(null);
                    }}
                  >
                    Tutup
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog Tambah */}
        <Dialog
          open={showCreateModal}
          onOpenChange={(open) => {
            setShowCreateModal(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="sm:max-w-lg rounded">
            <DialogHeader>
              <DialogTitle>Tambah Jadwal Ujian</DialogTitle>
              <DialogDescription>
                Tambah jadwal ujian baru untuk mahasiswa
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">NIM</Label>
                  <Input
                    value={formData.nim}
                    onChange={(e) =>
                      setFormData({ ...formData, nim: e.target.value })
                    }
                    className="mt-1"
                    placeholder="Masukkan NIM"
                  />
                </div>
                <div>
                  <Label className="text-sm">Nama Mahasiswa</Label>
                  <Input
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    className="mt-1"
                    placeholder="Masukkan nama"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Judul Skripsi</Label>
                <Textarea
                  value={formData.judul}
                  onChange={(e) =>
                    setFormData({ ...formData, judul: e.target.value })
                  }
                  rows={3}
                  className="mt-1"
                  placeholder="Masukkan judul skripsi"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Waktu Ujian</Label>
                  <Input
                    type="datetime-local"
                    value={formData.waktu}
                    onChange={(e) =>
                      setFormData({ ...formData, waktu: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Ruang</Label>
                  <Input
                    value={formData.ruang}
                    onChange={(e) =>
                      setFormData({ ...formData, ruang: e.target.value })
                    }
                    className="mt-1"
                    placeholder="Masukkan ruang"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Jenis Ujian</Label>
                  <Select
                    value={formData.jenis}
                    onValueChange={(value) =>
                      setFormData({ ...formData, jenis: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih jenis ujian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Seminar Proposal">
                        Seminar Proposal
                      </SelectItem>
                      <SelectItem value="Seminar Hasil">
                        Seminar Hasil
                      </SelectItem>
                      <SelectItem value="Seminar Skripsi">
                        Seminar Skripsi
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(
                      value: "pending" | "dijadwalkan" | "selesai"
                    ) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formData.status === "selesai" && (
                <div>
                  <Label className="text-sm">Nilai</Label>
                  <Input
                    value={formData.nilai}
                    onChange={(e) =>
                      setFormData({ ...formData, nilai: e.target.value })
                    }
                    className="mt-1"
                    placeholder="Masukkan nilai"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formData.nim || !formData.nama || !formData.judul}
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Edit */}
        <Dialog
          open={showEditModal}
          onOpenChange={(open) => {
            setShowEditModal(open);
            if (!open) {
              setSelected(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="sm:max-w-lg rounded">
            <DialogHeader>
              <DialogTitle>Edit Jadwal Ujian</DialogTitle>
              <DialogDescription>Ubah informasi jadwal ujian</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">NIM</Label>
                  <Input
                    value={formData.nim}
                    onChange={(e) =>
                      setFormData({ ...formData, nim: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Nama Mahasiswa</Label>
                  <Input
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Judul Skripsi</Label>
                <Textarea
                  value={formData.judul}
                  onChange={(e) =>
                    setFormData({ ...formData, judul: e.target.value })
                  }
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Waktu Ujian</Label>
                  <Input
                    type="datetime-local"
                    value={formData.waktu}
                    onChange={(e) =>
                      setFormData({ ...formData, waktu: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Ruang</Label>
                  <Input
                    value={formData.ruang}
                    onChange={(e) =>
                      setFormData({ ...formData, ruang: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Jenis Ujian</Label>
                  <Select
                    value={formData.jenis}
                    onValueChange={(value) =>
                      setFormData({ ...formData, jenis: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Seminar Proposal">
                        Seminar Proposal
                      </SelectItem>
                      <SelectItem value="Seminar Hasil">
                        Seminar Hasil
                      </SelectItem>
                      <SelectItem value="Seminar Skripsi">
                        Seminar Skripsi
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(
                      value: "pending" | "dijadwalkan" | "selesai"
                    ) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formData.status === "selesai" && (
                <div>
                  <Label className="text-sm">Nilai</Label>
                  <Input
                    value={formData.nilai}
                    onChange={(e) =>
                      setFormData({ ...formData, nilai: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelected(null);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button onClick={handleEdit}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Konfirmasi Hapus */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="rounded">
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Jadwal Ujian</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus jadwal ujian untuk{" "}
                <strong>{itemToDelete?.nama}</strong> ({itemToDelete?.nim})?
                Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowDeleteDialog(false);
                  setItemToDelete(null);
                }}
              >
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
