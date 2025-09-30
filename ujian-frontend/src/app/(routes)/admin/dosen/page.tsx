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

// Type untuk data dosen
type Dosen = {
  id: string;
  nidn: string;
  nama: string;
  email: string;
  telepon: string;
  bidangKeahlian: string;
  pendidikanTerakhir: string;
  jabatanAkademik: string;
  status: "aktif" | "nonaktif";
};

// Dummy data dosen
const dosenData: Dosen[] = [
  {
    id: "1",
    nidn: "1234567890",
    nama: "Dr. Budi Santoso, M.Kom",
    email: "budi.santoso@university.ac.id",
    telepon: "081234567890",
    bidangKeahlian: "Machine Learning",
    pendidikanTerakhir: "S3 Teknik Informatika",
    jabatanAkademik: "Lektor",
    status: "aktif",
  },
  {
    id: "2",
    nidn: "2345678901",
    nama: "Dr. Siti Aminah, M.T",
    email: "siti.aminah@university.ac.id",
    telepon: "081234567891",
    bidangKeahlian: "Software Engineering",
    pendidikanTerakhir: "S3 Teknik Informatika",
    jabatanAkademik: "Lektor Kepala",
    status: "aktif",
  },
  {
    id: "3",
    nidn: "3456789012",
    nama: "Andi Wijaya, S.Kom, M.Kom",
    email: "andi.wijaya@university.ac.id",
    telepon: "081234567892",
    bidangKeahlian: "Database Systems",
    pendidikanTerakhir: "S2 Sistem Informasi",
    jabatanAkademik: "Asisten Ahli",
    status: "nonaktif",
  },
];

const statusColors = {
  aktif: "bg-green-100 text-green-800",
  nonaktif: "bg-red-100 text-red-800",
};

const statusLabels = {
  aktif: "Aktif",
  nonaktif: "Non Aktif",
};

export default function Page() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [keahlianFilter, setKeahlianFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selected, setSelected] = useState<Dosen | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Dosen | null>(null);
  const [dosenList, setDosenList] = useState(dosenData);

  const [formData, setFormData] = useState({
    nidn: "",
    nama: "",
    email: "",
    telepon: "",
    bidangKeahlian: "",
    pendidikanTerakhir: "",
    jabatanAkademik: "",
    status: "aktif" as "aktif" | "nonaktif",
  });

  const resetForm = () => {
    setFormData({
      nidn: "",
      nama: "",
      email: "",
      telepon: "",
      bidangKeahlian: "",
      pendidikanTerakhir: "",
      jabatanAkademik: "",
      status: "aktif",
    });
  };

  const handleCreate = () => {
    const newDosen: Dosen = {
      id: Date.now().toString(),
      ...formData,
    };
    setDosenList([newDosen, ...dosenList]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selected) return;
    setDosenList(
      dosenList.map((item) =>
        item.id === selected.id ? { ...item, ...formData } : item
      )
    );
    setShowEditModal(false);
    setSelected(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    setDosenList(dosenList.filter((item) => item.id !== itemToDelete.id));
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const openEditModal = (item: Dosen) => {
    setSelected(item);
    setFormData({
      nidn: item.nidn,
      nama: item.nama,
      email: item.email,
      telepon: item.telepon,
      bidangKeahlian: item.bidangKeahlian,
      pendidikanTerakhir: item.pendidikanTerakhir,
      jabatanAkademik: item.jabatanAkademik,
      status: item.status,
    });
    setShowEditModal(true);
  };

  const openDeleteDialog = (item: Dosen) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const filteredData = dosenList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nidn.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.bidangKeahlian.toLowerCase().includes(search.toLowerCase());

    const matchStatus = activeTab === "all" ? true : item.status === activeTab;
    const matchKeahlian =
      keahlianFilter === "all" ? true : item.bidangKeahlian === keahlianFilter;

    return matchSearch && matchStatus && matchKeahlian;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Get unique bidang keahlian for filter
  const uniqueKeahlian = Array.from(
    new Set(dosenList.map((item) => item.bidangKeahlian))
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Kelola Daftar Dosen
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola data dosen dan informasi akademik
            </p>
          </div>

          <Button onClick={() => setShowCreateModal(true)} className="rounded">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Dosen
          </Button>
        </div>

        {/* Pencarian dan Filter */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama, NIDN, atau keahlian..."
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={keahlianFilter} onValueChange={setKeahlianFilter}>
            <SelectTrigger className="w-48 bg-white rounded">
              <IconFilter2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter bidang keahlian" />
            </SelectTrigger>
            <SelectContent className="rounded">
              <SelectItem value="all">Semua Bidang</SelectItem>
              {uniqueKeahlian.map((keahlian) => (
                <SelectItem key={keahlian} value={keahlian}>
                  {keahlian}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2 text-xs">
          {["all", "aktif", "nonaktif"].map((status) => (
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
                ? `Semua (${dosenList.length})`
                : `${statusLabels[status as keyof typeof statusLabels]} (${
                    dosenList.filter((i) => i.status === status).length
                  })`}
            </button>
          ))}
        </div>

        {/* Tabel */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>NIDN</TableHead>
                <TableHead>Nama Dosen</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Bidang Keahlian</TableHead>
                <TableHead>Pendidikan</TableHead>
                <TableHead>Jabatan</TableHead>
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
                    <TableCell>{item.nidn}</TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell className="text-gray-600">
                      {item.email}
                    </TableCell>
                    <TableCell>{item.telepon}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.bidangKeahlian}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {item.pendidikanTerakhir}
                    </TableCell>
                    <TableCell>{item.jabatanAkademik}</TableCell>
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
                    Tidak ada data dosen
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
                  <DialogTitle>Detail Dosen</DialogTitle>
                  <DialogDescription>
                    Informasi lengkap mengenai dosen
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">NIDN</Label>
                      <Input value={selected.nidn} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm">Nama Lengkap</Label>
                      <Input value={selected.nama} readOnly className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Email</Label>
                    <Input value={selected.email} readOnly className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Telepon</Label>
                    <Input value={selected.telepon} readOnly className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Bidang Keahlian</Label>
                    <Input
                      value={selected.bidangKeahlian}
                      readOnly
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Pendidikan Terakhir</Label>
                      <Input
                        value={selected.pendidikanTerakhir}
                        readOnly
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Jabatan Akademik</Label>
                      <Input
                        value={selected.jabatanAkademik}
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
              <DialogTitle>Tambah Dosen</DialogTitle>
              <DialogDescription>
                Tambah data dosen baru ke sistem
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">NIDN</Label>
                  <Input
                    value={formData.nidn}
                    onChange={(e) =>
                      setFormData({ ...formData, nidn: e.target.value })
                    }
                    className="mt-1"
                    placeholder="Masukkan NIDN"
                  />
                </div>
                <div>
                  <Label className="text-sm">Nama Lengkap</Label>
                  <Input
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    className="mt-1"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1"
                  placeholder="Masukkan email"
                />
              </div>
              <div>
                <Label className="text-sm">Telepon</Label>
                <Input
                  value={formData.telepon}
                  onChange={(e) =>
                    setFormData({ ...formData, telepon: e.target.value })
                  }
                  className="mt-1"
                  placeholder="Masukkan nomor telepon"
                />
              </div>
              <div>
                <Label className="text-sm">Bidang Keahlian</Label>
                <Input
                  value={formData.bidangKeahlian}
                  onChange={(e) =>
                    setFormData({ ...formData, bidangKeahlian: e.target.value })
                  }
                  className="mt-1"
                  placeholder="Masukkan bidang keahlian"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Pendidikan Terakhir</Label>
                  <Input
                    value={formData.pendidikanTerakhir}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pendidikanTerakhir: e.target.value,
                      })
                    }
                    className="mt-1"
                    placeholder="S1/S2/S3"
                  />
                </div>
                <div>
                  <Label className="text-sm">Jabatan Akademik</Label>
                  <Select
                    value={formData.jabatanAkademik}
                    onValueChange={(value) =>
                      setFormData({ ...formData, jabatanAkademik: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih jabatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asisten Ahli">Asisten Ahli</SelectItem>
                      <SelectItem value="Lektor">Lektor</SelectItem>
                      <SelectItem value="Lektor Kepala">
                        Lektor Kepala
                      </SelectItem>
                      <SelectItem value="Guru Besar">Guru Besar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "aktif" | "nonaktif") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Non Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                disabled={!formData.nidn || !formData.nama || !formData.email}
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
              <DialogTitle>Edit Data Dosen</DialogTitle>
              <DialogDescription>Ubah informasi data dosen</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* ...existing form fields similar to create modal... */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">NIDN</Label>
                  <Input
                    value={formData.nidn}
                    onChange={(e) =>
                      setFormData({ ...formData, nidn: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Nama Lengkap</Label>
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
                <Label className="text-sm">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Telepon</Label>
                <Input
                  value={formData.telepon}
                  onChange={(e) =>
                    setFormData({ ...formData, telepon: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Bidang Keahlian</Label>
                <Input
                  value={formData.bidangKeahlian}
                  onChange={(e) =>
                    setFormData({ ...formData, bidangKeahlian: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Pendidikan Terakhir</Label>
                  <Input
                    value={formData.pendidikanTerakhir}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pendidikanTerakhir: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Jabatan Akademik</Label>
                  <Select
                    value={formData.jabatanAkademik}
                    onValueChange={(value) =>
                      setFormData({ ...formData, jabatanAkademik: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asisten Ahli">Asisten Ahli</SelectItem>
                      <SelectItem value="Lektor">Lektor</SelectItem>
                      <SelectItem value="Lektor Kepala">
                        Lektor Kepala
                      </SelectItem>
                      <SelectItem value="Guru Besar">Guru Besar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "aktif" | "nonaktif") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Non Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <AlertDialogTitle>Hapus Data Dosen</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus data dosen{" "}
                <strong>{itemToDelete?.nama}</strong> (NIDN:{" "}
                {itemToDelete?.nidn})? Tindakan ini tidak dapat dibatalkan.
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
