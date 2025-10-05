"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
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
import { Search, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KomponenPenilaian } from "@/types/KomponenPenilaian";
import {
  getKomponenPenilaian,
  createKomponenPenilaian,
  updateKomponenPenilaian,
  deleteKomponenPenilaian,
} from "@/actions/komponenPenilaianAction";
import { getJenisUjian } from "@/actions/jenisUjianAction";

interface JenisUjian {
  id: number;
  namaJenis: string;
}

export default function DaftarKomponenPenilaianPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [editData, setEditData] = useState<KomponenPenilaian | null>(null);
  const [komponenPenilaianData, setKomponenPenilaianData] = useState<
    KomponenPenilaian[]
  >([]);
  const [jenisUjianData, setJenisUjianData] = useState<JenisUjian[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [komponenResult, jenisUjianResult] = await Promise.all([
        getKomponenPenilaian(),
        getJenisUjian(),
      ]);
      setKomponenPenilaianData(komponenResult);
      setJenisUjianData(jenisUjianResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdd = async (formData: FormData) => {
    const result = await createKomponenPenilaian(formData);
    if (result.success) {
      setIsAddDialogOpen(false);
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const handleSubmitEdit = async (formData: FormData) => {
    if (!editData) return;
    const result = await updateKomponenPenilaian(editData.id, formData);
    if (result.success) {
      setIsEditDialogOpen(false);
      setEditData(null);
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus komponen penilaian ini?")) {
      const result = await deleteKomponenPenilaian(id);
      if (result.success) {
        fetchData();
      } else {
        alert(result.message);
      }
    }
  };

  const filteredData = komponenPenilaianData.filter((item) => {
    const matchSearch =
      item.namaKomponen.toLowerCase().includes(search.toLowerCase()) ||
      item.jenisUjian.namaJenis.toLowerCase().includes(search.toLowerCase());
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
              Data Master Komponen Penilaian
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola komponen penilaian untuk setiap jenis ujian
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Komponen Penilaian
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
              <DialogHeader>
                <DialogTitle>Form Tambah Komponen Penilaian</DialogTitle>
              </DialogHeader>
              <form action={handleSubmitAdd} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Jenis Ujian</label>
                  <Select name="jenisUjianId" required>
                    <SelectTrigger className="rounded mt-1">
                      <SelectValue placeholder="Pilih jenis ujian" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
                      {jenisUjianData.map((jenis) => (
                        <SelectItem key={jenis.id} value={jenis.id.toString()}>
                          {jenis.namaJenis}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Nama Komponen</label>
                  <Input
                    name="namaKomponen"
                    placeholder="Nama komponen penilaian"
                    className="mt-1 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bobot (%)</label>
                  <Input
                    name="bobot"
                    type="number"
                    placeholder="Bobot penilaian dalam persen"
                    className="mt-1 rounded"
                    min="0"
                    max="100"
                    required
                  />
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
              placeholder="Cari berdasarkan nama komponen atau jenis ujian"
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Jenis Ujian</TableHead>
                <TableHead>Nama Komponen</TableHead>
                <TableHead>Bobot (%)</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {item.jenisUjian.namaJenis}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {item.namaKomponen}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-blue-600">
                        {item.bobot}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                  <TableCell colSpan={5} className="text-center py-8">
                    Tidak ada data komponen penilaian
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
            {editData && (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Komponen Penilaian</DialogTitle>
                </DialogHeader>
                <form action={handleSubmitEdit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">Jenis Ujian</label>
                    <Select
                      name="jenisUjianId"
                      defaultValue={editData.jenisUjianId.toString()}
                      required
                    >
                      <SelectTrigger className="rounded mt-1">
                        <SelectValue placeholder="Pilih jenis ujian" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        {jenisUjianData.map((jenis) => (
                          <SelectItem
                            key={jenis.id}
                            value={jenis.id.toString()}
                          >
                            {jenis.namaJenis}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nama Komponen</label>
                    <Input
                      name="namaKomponen"
                      defaultValue={editData.namaKomponen}
                      placeholder="Nama komponen penilaian"
                      className="mt-1 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bobot (%)</label>
                    <Input
                      name="bobot"
                      type="number"
                      defaultValue={editData.bobot}
                      placeholder="Bobot penilaian dalam persen"
                      className="mt-1 rounded"
                      min="0"
                      max="100"
                      required
                    />
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
