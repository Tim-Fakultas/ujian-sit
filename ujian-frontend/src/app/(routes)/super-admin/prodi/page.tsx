"use client"
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
import { Search, Plus, Edit, Trash2, MoreVertical, Eye, University } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import PageHeader from "@/components/common/PageHeader";

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
    <div className="min-h-screen p-6 space-y-6">
      <PageHeader
        title="Data Master Program Studi"
        description="Kelola data program studi dalam sistem"
        iconName="University"
      />

      <DataCard>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nama, kode, atau jenjang"
              className="pl-10 border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-lg gap-2">
                <Plus className="h-4 w-4" />
                Tambah Prodi
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
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
                      className="mt-1 rounded-lg"
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
                      className="mt-1 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Jenjang</label>
                    <Select name="jenjang" required>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Pilih jenjang" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
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
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Pilih akreditasi" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
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
                    className="mt-1 rounded-lg"
                    rows={3}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded-lg">
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="rounded-lg border dark:border-neutral-800 overflow-hidden">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-gray-50 dark:bg-neutral-800">
              <TableRow>
                <TableHead className="text-center font-semibold text-gray-900 dark:text-gray-100">No</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Kode</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Nama Program Studi</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Jenjang</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Akreditasi</TableHead>
                <TableHead className="text-center font-semibold text-gray-900 dark:text-gray-100">Total Mahasiswa</TableHead>
                <TableHead className="text-center font-semibold text-gray-900 dark:text-gray-100">Total Dosen</TableHead>
                <TableHead className="text-center font-semibold text-gray-900 dark:text-gray-100">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {item.kode}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-pointer">
                              <div className="font-medium text-gray-900 dark:text-gray-100">
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
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                        {item.jenjang}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          item.akreditasi === "A" ||
                          item.akreditasi === "Unggul"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : item.akreditasi === "B" ||
                              item.akreditasi === "Baik Sekali"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
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
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-lg">
                          <DropdownMenuItem onClick={() => setSelected(item)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
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
                            className="text-red-600 focus:text-red-600 cursor-pointer"
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
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Tidak ada data program studi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Halaman {currentPage} dari {totalPages}</span>
            </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Tampil:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(v) => {
                setItemsPerPage(parseInt(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-16 h-8 rounded-lg text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {totalPages > 1 && (
            <Pagination className="w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className="h-8 w-8 p-0 rounded-lg flex items-center justify-center"
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
                        className={`h-8 w-8 p-0 rounded-lg flex items-center justify-center ${currentPage === page ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
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
                    className="h-8 w-8 p-0 rounded-lg flex items-center justify-center"
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
      </DataCard>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
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
                      className="mt-1 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nama</label>
                    <Input
                      value={selected.nama}
                      readOnly
                      className="mt-1 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Jenjang</label>
                    <Input
                      value={selected.jenjang}
                      readOnly
                      className="mt-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Akreditasi</label>
                    <Input
                      value={selected.akreditasi}
                      readOnly
                      className="mt-1 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Deskripsi</label>
                  <Textarea
                    value={selected.deskripsi}
                    readOnly
                    rows={3}
                    className="mt-1 rounded-lg"
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
                      className="mt-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Dosen</label>
                    <Input
                      value={selected.totalDosen.toString()}
                      readOnly
                      className="mt-1 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)} className="rounded-lg">
                  Tutup
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
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
                      className="mt-1 rounded-lg"
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
                      className="mt-1 rounded-lg"
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
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Pilih jenjang" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
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
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Pilih akreditasi" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
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
                    className="mt-1 rounded-lg"
                    rows={3}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="rounded-lg"
                  >
                    Batal
                  </Button>
                  <Button type="submit" className="rounded-lg">
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
