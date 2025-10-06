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
import { Search, Plus, Edit, Trash2, MoreVertical, Eye } from "lucide-react";

// Type for Prodi
interface Prodi {
  id: number;
  nama: string;
  kode: string;
  deskripsi: string;
  jenjang: string;
  akreditasi: string;
  totalMahasiswa: number;
  totalDosen: number;
}

// Mock data - replace with actual API calls
const mockProdiData: Prodi[] = [
  {
    id: 1,
    nama: "Sistem Informasi",
    kode: "SI",
    deskripsi:
      "Program studi yang mempelajari sistem informasi dan teknologi komputer",
    jenjang: "S1",
    akreditasi: "A",
    totalMahasiswa: 245,
    totalDosen: 12,
  },
  {
    id: 2,
    nama: "Teknik Informatika",
    kode: "TI",
    deskripsi:
      "Program studi yang mempelajari teknologi informasi dan pemrograman",
    jenjang: "S1",
    akreditasi: "B",
    totalMahasiswa: 198,
    totalDosen: 10,
  },
  {
    id: 3,
    nama: "Sistem Komputer",
    kode: "SK",
    deskripsi: "Program studi yang mempelajari sistem komputer dan jaringan",
    jenjang: "S1",
    akreditasi: "B",
    totalMahasiswa: 156,
    totalDosen: 8,
  },
];

export default function DaftarProdiPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selected, setSelected] = useState<Prodi | null>(null);
  const [editData, setEditData] = useState<Prodi | null>(null);
  const [prodiData, setProdiData] = useState<Prodi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      setTimeout(() => {
        setProdiData(mockProdiData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSubmitAdd = async (formData: FormData) => {
    // Simulate API call for create
    const newProdi: Prodi = {
      id: Date.now(),
      nama: formData.get("nama") as string,
      kode: formData.get("kode") as string,
      deskripsi: formData.get("deskripsi") as string,
      jenjang: formData.get("jenjang") as string,
      akreditasi: formData.get("akreditasi") as string,
      totalMahasiswa: 0,
      totalDosen: 0,
    };

    setProdiData((prev) => [...prev, newProdi]);
    setIsAddDialogOpen(false);
  };

  const handleSubmitEdit = async (formData: FormData) => {
    if (!editData) return;

    // Simulate API call for update
    const updatedProdi: Prodi = {
      ...editData,
      nama: formData.get("nama") as string,
      kode: formData.get("kode") as string,
      deskripsi: formData.get("deskripsi") as string,
      jenjang: formData.get("jenjang") as string,
      akreditasi: formData.get("akreditasi") as string,
    };

    setProdiData((prev) =>
      prev.map((item) => (item.id === editData.id ? updatedProdi : item))
    );
    setIsEditDialogOpen(false);
    setEditData(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus prodi ini?")) {
      // Simulate API call for delete
      setProdiData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredData = prodiData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase()) ||
      item.jenjang.toLowerCase().includes(search.toLowerCase());
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
              Data Master Program Studi
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola data program studi dalam sistem
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Prodi
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
              <DialogHeader>
                <DialogTitle>Form Tambah Program Studi</DialogTitle>
              </DialogHeader>
              <form action={handleSubmitAdd} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Kode Prodi</label>
                    <Input
                      name="kode"
                      placeholder="Kode program studi"
                      className="mt-1 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Nama Program Studi
                    </label>
                    <Input
                      name="nama"
                      placeholder="Nama lengkap program studi"
                      className="mt-1 rounded"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Jenjang</label>
                    <Select name="jenjang" required>
                      <SelectTrigger className="rounded">
                        <SelectValue placeholder="Pilih jenjang" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        <SelectItem value="D3">D3</SelectItem>
                        <SelectItem value="S1">S1</SelectItem>
                        <SelectItem value="S2">S2</SelectItem>
                        <SelectItem value="S3">S3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Akreditasi</label>
                    <Select name="akreditasi" required>
                      <SelectTrigger className="rounded">
                        <SelectValue placeholder="Pilih akreditasi" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="Unggul">Unggul</SelectItem>
                        <SelectItem value="Baik Sekali">Baik Sekali</SelectItem>
                        <SelectItem value="Baik">Baik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Deskripsi</label>
                  <Textarea
                    name="deskripsi"
                    placeholder="Deskripsi program studi"
                    className="mt-1 rounded"
                    rows={3}
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
              placeholder="Cari berdasarkan nama, kode, atau jenjang"
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
                <TableHead>Kode</TableHead>
                <TableHead>Nama Program Studi</TableHead>
                <TableHead>Jenjang</TableHead>
                <TableHead>Akreditasi</TableHead>
                <TableHead>Total Mahasiswa</TableHead>
                <TableHead>Total Dosen</TableHead>
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
                    <TableCell className="font-mono font-semibold text-blue-600">
                      {item.kode}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.nama}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {item.deskripsi}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            <p>{item.deskripsi}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {item.jenjang}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          item.akreditasi === "A" ||
                          item.akreditasi === "Unggul"
                            ? "bg-green-100 text-green-800"
                            : item.akreditasi === "B" ||
                              item.akreditasi === "Baik Sekali"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.akreditasi}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.totalMahasiswa}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.totalDosen}
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
                    Tidak ada data program studi
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
                  <DialogTitle>Detail Program Studi</DialogTitle>
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
                      <label className="text-sm font-medium">Jenjang</label>
                      <Input
                        value={selected.jenjang}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Akreditasi</label>
                      <Input
                        value={selected.akreditasi}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deskripsi</label>
                    <Textarea
                      value={selected.deskripsi}
                      readOnly
                      rows={3}
                      className="mt-1 rounded"
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
                      <label className="text-sm font-medium">Total Dosen</label>
                      <Input
                        value={selected.totalDosen.toString()}
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
                  <DialogTitle>Edit Program Studi</DialogTitle>
                </DialogHeader>
                <form action={handleSubmitEdit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Kode Prodi</label>
                      <Input
                        name="kode"
                        defaultValue={editData.kode}
                        placeholder="Kode program studi"
                        className="mt-1 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Nama Program Studi
                      </label>
                      <Input
                        name="nama"
                        defaultValue={editData.nama}
                        placeholder="Nama lengkap program studi"
                        className="mt-1 rounded"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Jenjang</label>
                      <Select
                        name="jenjang"
                        defaultValue={editData.jenjang}
                        required
                      >
                        <SelectTrigger className="rounded">
                          <SelectValue placeholder="Pilih jenjang" />
                        </SelectTrigger>
                        <SelectContent className="rounded">
                          <SelectItem value="D3">D3</SelectItem>
                          <SelectItem value="S1">S1</SelectItem>
                          <SelectItem value="S2">S2</SelectItem>
                          <SelectItem value="S3">S3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Akreditasi</label>
                      <Select
                        name="akreditasi"
                        defaultValue={editData.akreditasi}
                        required
                      >
                        <SelectTrigger className="rounded">
                          <SelectValue placeholder="Pilih akreditasi" />
                        </SelectTrigger>
                        <SelectContent className="rounded">
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="Unggul">Unggul</SelectItem>
                          <SelectItem value="Baik Sekali">
                            Baik Sekali
                          </SelectItem>
                          <SelectItem value="Baik">Baik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deskripsi</label>
                    <Textarea
                      name="deskripsi"
                      defaultValue={editData.deskripsi}
                      placeholder="Deskripsi program studi"
                      className="mt-1 rounded"
                      rows={3}
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
