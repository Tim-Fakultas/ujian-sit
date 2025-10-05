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
import { Search, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { JenisUjian } from "@/types/JenisUjian";
import {
  getJenisUjian,
  createJenisUjian,
  updateJenisUjian,
  deleteJenisUjian,
} from "@/actions/jenisUjianAction";

export default function DaftarJenisUjianPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [editData, setEditData] = useState<JenisUjian | null>(null);
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
      const result = await getJenisUjian();
      setJenisUjianData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdd = async (formData: FormData) => {
    const result = await createJenisUjian(formData);
    if (result.success) {
      setIsAddDialogOpen(false);
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const handleSubmitEdit = async (formData: FormData) => {
    if (!editData) return;
    const result = await updateJenisUjian(editData.id, formData);
    if (result.success) {
      setIsEditDialogOpen(false);
      setEditData(null);
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus jenis ujian ini?")) {
      const result = await deleteJenisUjian(id);
      if (result.success) {
        fetchData();
      } else {
        alert(result.message);
      }
    }
  };

  const filteredData = jenisUjianData.filter((item) => {
    const matchSearch =
      item.namaJenis.toLowerCase().includes(search.toLowerCase()) ||
      (item.deskripsi &&
        item.deskripsi.toLowerCase().includes(search.toLowerCase()));
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
              Data Master Jenis Ujian
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola jenis ujian dalam sistem
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Jenis Ujian
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
              <DialogHeader>
                <DialogTitle>Form Tambah Jenis Ujian</DialogTitle>
              </DialogHeader>
              <form action={handleSubmitAdd} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">
                    Nama Jenis Ujian
                  </label>
                  <Input
                    name="namaJenis"
                    placeholder="Nama jenis ujian"
                    className="mt-1 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Deskripsi</label>
                  <Textarea
                    name="deskripsi"
                    placeholder="Deskripsi jenis ujian"
                    className="mt-1 rounded"
                    rows={4}
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
              placeholder="Cari berdasarkan nama atau deskripsi"
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Nama Jenis Ujian</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {item.namaJenis}
                    </TableCell>
                    <TableCell className="max-w-md">
                      {item.deskripsi ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help line-clamp-2">
                                {item.deskripsi}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-sm">
                              <p>{item.deskripsi}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-gray-400 italic">
                          Tidak ada deskripsi
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
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
                  <TableCell colSpan={4} className="text-center py-8">
                    Tidak ada data jenis ujian
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
                  <DialogTitle>Edit Jenis Ujian</DialogTitle>
                </DialogHeader>
                <form action={handleSubmitEdit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">
                      Nama Jenis Ujian
                    </label>
                    <Input
                      name="namaJenis"
                      defaultValue={editData.namaJenis}
                      placeholder="Nama jenis ujian"
                      className="mt-1 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deskripsi</label>
                    <Textarea
                      name="deskripsi"
                      defaultValue={editData.deskripsi || ""}
                      placeholder="Deskripsi jenis ujian"
                      className="mt-1 rounded"
                      rows={4}
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
