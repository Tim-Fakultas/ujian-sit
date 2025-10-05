"use client";

import { useState, useEffect } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Eye, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Mahasiswa } from "@/types/Mahasiswa";
import {
  getMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/actions/mahasiswaAction";
import { getDosen } from "@/actions/dosenAction";

interface Dosen {
  id: number;
  nama: string;
  nip: string;
  email: string;
  prodi: string;
}

export default function DaftarMahasiswaPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selected, setSelected] = useState<Mahasiswa | null>(null);
  const [editData, setEditData] = useState<Mahasiswa | null>(null);
  const [mahasiswaData, setMahasiswaData] = useState<Mahasiswa[]>([]);
  const [dosenData, setDosenData] = useState<Dosen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mahasiswaResult, dosenResult] = await Promise.all([
        getMahasiswa(),
        getDosen(),
      ]);
      setMahasiswaData(mahasiswaResult);
      setDosenData(dosenResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdd = async (formData: FormData) => {
    const result = await createMahasiswa(formData);
    if (result.success) {
      setIsAddDialogOpen(false);
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const handleSubmitEdit = async (formData: FormData) => {
    if (!editData) return;
    const result = await updateMahasiswa(editData.id, formData);
    if (result.success) {
      setIsEditDialogOpen(false);
      setEditData(null);
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
      const result = await deleteMahasiswa(id);
      if (result.success) {
        fetchData();
      } else {
        alert(result.message);
      }
    }
  };

  const filteredData = mahasiswaData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nim.toLowerCase().includes(search.toLowerCase()) ||
      item.prodi.nama.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
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
              Data Master Mahasiswa
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola data mahasiswa dalam sistem
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Mahasiswa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
              <DialogHeader>
                <DialogTitle>Form Tambah Mahasiswa</DialogTitle>
              </DialogHeader>
              <form action={handleSubmitAdd} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <Input
                      name="nama"
                      placeholder="Nama lengkap mahasiswa"
                      className="mt-1 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">NIM</label>
                    <Input
                      name="nim"
                      placeholder="Nomor Induk Mahasiswa"
                      className="mt-1 rounded"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">No. HP</label>
                    <Input
                      name="noHp"
                      placeholder="Nomor HP"
                      className="mt-1 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Semester</label>
                    <Select name="semester" required>
                      <SelectTrigger className="rounded">
                        <SelectValue placeholder="Pilih semester" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                          (sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                              {sem}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Alamat</label>
                  <Textarea
                    name="alamat"
                    placeholder="Alamat lengkap"
                    className="mt-1 rounded"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Dosen PA</label>
                    <Select name="dosenPaId" required>
                      <SelectTrigger className="rounded">
                        <SelectValue placeholder="Pilih dosen PA" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        {dosenData.map((dosen) => (
                          <SelectItem
                            key={dosen.id}
                            value={dosen.id.toString()}
                          >
                            {dosen.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Prodi</label>
                    <Select name="prodiId" required>
                      <SelectTrigger className="rounded">
                        <SelectValue placeholder="Pilih prodi" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        <SelectItem value="1">Sistem Informasi</SelectItem>
                        <SelectItem value="2">Teknik Informatika</SelectItem>
                        <SelectItem value="3">Sistem Komputer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded">
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nama, NIM, atau prodi"
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>NIM</TableHead>
                <TableHead>Prodi</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Dosen PA</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="max-w-md truncate text-gray-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">{item.nama}</span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            <p>{item.nama}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{item.nim}</TableCell>
                    <TableCell>{item.prodi.nama}</TableCell>
                    <TableCell>{item.semester}</TableCell>
                    <TableCell>{item.dosenPa.nama}</TableCell>
                    <TableCell>{item.noHp}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelected(item)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditData(item);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 focus:text-red-600"
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
                  <TableCell colSpan={8} className="text-center py-8">
                    Tidak ada data mahasiswa
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

        {/* Detail Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Detail Mahasiswa</DialogTitle>
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
                      <label className="text-sm font-medium">Nama</label>
                      <Input
                        value={selected.nama}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">No. HP</label>
                      <Input
                        value={selected.noHp}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Semester</label>
                      <Input
                        value={selected.semester.toString()}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Alamat</label>
                    <Textarea
                      value={selected.alamat}
                      readOnly
                      rows={3}
                      className="mt-1 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Prodi</label>
                      <Input
                        value={selected.prodi.nama}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Dosen PA</label>
                      <Input
                        value={selected.dosenPa.nama}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
            {editData && (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Mahasiswa</DialogTitle>
                </DialogHeader>
                <form action={handleSubmitEdit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Nama Lengkap
                      </label>
                      <Input
                        name="nama"
                        defaultValue={editData.nama}
                        placeholder="Nama lengkap mahasiswa"
                        className="mt-1 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">NIM</label>
                      <Input
                        name="nim"
                        defaultValue={editData.nim}
                        placeholder="Nomor Induk Mahasiswa"
                        className="mt-1 rounded"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">No. HP</label>
                      <Input
                        name="noHp"
                        defaultValue={editData.noHp}
                        placeholder="Nomor HP"
                        className="mt-1 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Semester</label>
                      <Select
                        name="semester"
                        defaultValue={editData.semester.toString()}
                        required
                      >
                        <SelectTrigger className="rounded">
                          <SelectValue placeholder="Pilih semester" />
                        </SelectTrigger>
                        <SelectContent className="rounded">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                            (sem) => (
                              <SelectItem key={sem} value={sem.toString()}>
                                {sem}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Alamat</label>
                    <Textarea
                      name="alamat"
                      defaultValue={editData.alamat}
                      placeholder="Alamat lengkap"
                      className="mt-1 rounded"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Dosen PA</label>
                      <Select
                        name="dosenPaId"
                        defaultValue={editData.dosenPaId.toString()}
                        required
                      >
                        <SelectTrigger className="rounded">
                          <SelectValue placeholder="Pilih dosen PA" />
                        </SelectTrigger>
                        <SelectContent className="rounded">
                          {dosenData.map((dosen) => (
                            <SelectItem
                              key={dosen.id}
                              value={dosen.id.toString()}
                            >
                              {dosen.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Prodi</label>
                      <Select
                        name="prodiId"
                        defaultValue={editData.prodi.id.toString()}
                        required
                      >
                        <SelectTrigger className="rounded">
                          <SelectValue placeholder="Pilih prodi" />
                        </SelectTrigger>
                        <SelectContent className="rounded">
                          <SelectItem value="1">Sistem Informasi</SelectItem>
                          <SelectItem value="2">Teknik Informatika</SelectItem>
                          <SelectItem value="3">Sistem Komputer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button type="submit" className="rounded">
                      Simpan
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
