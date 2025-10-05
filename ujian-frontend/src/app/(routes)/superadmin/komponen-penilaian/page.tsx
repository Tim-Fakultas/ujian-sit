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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Edit, Trash2, MoreVertical, Eye } from "lucide-react";
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
  const [selected, setSelected] = useState<KomponenPenilaian | null>(null);
  const [komponenPenilaianData, setKomponenPenilaianData] = useState<
    KomponenPenilaian[]
  >([]);
  const [jenisUjianData, setJenisUjianData] = useState<JenisUjian[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
      setIsCreateOpen(false);
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const handleSubmitEdit = async (formData: FormData) => {
    if (!editData) return;
    const result = await updateKomponenPenilaian(editData.id, formData);
    if (result.success) {
      setEditData(null);
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const handleEdit = (item: KomponenPenilaian) => {
    setEditData(item);
  };

  const handleDelete = async (item: KomponenPenilaian) => {
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus komponen penilaian "${item.namaKomponen}"?`
      )
    ) {
      const result = await deleteKomponenPenilaian(item.id);
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
              Komponen Penilaian
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola komponen penilaian untuk setiap jenis ujian
            </p>
          </div>
          <Button className="rounded" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Komponen Penilaian
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama komponen atau jenis ujian..."
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
                {editData
                  ? "Edit Komponen Penilaian"
                  : "Tambah Komponen Penilaian Baru"}
              </DialogTitle>
            </DialogHeader>
            <form
              action={editData ? handleSubmitEdit : handleSubmitAdd}
              className="space-y-6"
            >
              <div>
                <label className="text-sm font-medium">Jenis Ujian *</label>
                <Select
                  name="jenisUjianId"
                  defaultValue={editData?.jenisUjianId.toString()}
                  required
                >
                  <SelectTrigger className="mt-1 rounded">
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
                <label className="text-sm font-medium">Nama Komponen *</label>
                <Input
                  name="namaKomponen"
                  placeholder="Nama komponen penilaian"
                  defaultValue={editData?.namaKomponen}
                  className="mt-1 rounded"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bobot (%) *</label>
                <Input
                  name="bobot"
                  type="number"
                  placeholder="Bobot penilaian dalam persen"
                  defaultValue={editData?.bobot}
                  className="mt-1 rounded"
                  min="0"
                  max="100"
                  required
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
                <Button type="submit" className="rounded">
                  {editData ? "Simpan Perubahan" : "Tambah Komponen"}
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
                  <DialogTitle>Detail Komponen Penilaian</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <label className="text-sm font-medium">Jenis Ujian</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="font-medium">
                        {selected.jenisUjian.namaJenis}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nama Komponen</label>
                    <Input
                      value={selected.namaKomponen}
                      readOnly
                      className="mt-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bobot</label>
                    <Input
                      value={`${selected.bobot}%`}
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
                    Edit Komponen
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
