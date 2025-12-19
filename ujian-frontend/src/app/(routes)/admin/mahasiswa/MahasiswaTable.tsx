"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Pencil,
  Trash2,
  Info,
  LayoutGrid,
  List,
  Plus,
  MoreHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mahasiswa } from "@/types/Mahasiswa";
import { Dosen } from "@/types/Dosen";
import { User } from "@/types/Auth";
import {
  createMahasiswa,
  deleteMahasiswa,
  getAllMahasiswa,
  updateMahasiswa,
} from "@/actions/data-master/mahasiswa";
import { showToast } from "@/components/ui/custom-toast";

import TableGlobal from "@/components/tableGlobal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MahasiswaTableProps {
  mahasiswa: Mahasiswa[];
  dosenList: Dosen[];
  user?: User | null;
}

export function MahasiswaTable({ mahasiswa, dosenList, user }: MahasiswaTableProps) {
  const [mahasiswaData, setMahasiswaData] = React.useState<Mahasiswa[]>(
    mahasiswa ?? []
  );

  const refreshMahasiswa = React.useCallback(async () => {
    const newData = await getAllMahasiswa();
    // Filter if needed based on user prodi, but for now we fetch all
    // If the API doesn't filter by prodi, we might want to do it here
    // But typically the API should handle it or we show all to admin
    if (user?.prodi?.id) {
       setMahasiswaData(newData.filter((m: Mahasiswa) => m.prodi?.id === user.prodi?.id));
    } else {
       setMahasiswaData(newData);
    }
  }, [user]);

  React.useEffect(() => {
    // Initial filter if needed
    if (mahasiswa && user?.prodi?.id) {
        setMahasiswaData(mahasiswa.filter((m) => m.prodi?.id === user.prodi?.id));
    } else {
        setMahasiswaData(mahasiswa ?? []);
    }
  }, [mahasiswa, user]);

  const data = React.useMemo(() => mahasiswaData ?? [], [mahasiswaData]);

  const [search, setSearch] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"table" | "card">("table");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editMahasiswa, setEditMahasiswa] = React.useState<Mahasiswa | null>(null);
  const [deleteMahasiswaState, setDeleteMahasiswaState] = React.useState<Mahasiswa | null>(null);
  const [detailMahasiswa, setDetailMahasiswa] = React.useState<Mahasiswa | null>(null);

  const [formData, setFormData] = React.useState<{
    nama: string;
    nim: string;
    noHp: string;
    alamat: string;
    semester: string;
    dosenPaId: string;
  }>({
    nama: "",
    nim: "",
    noHp: "",
    alamat: "",
    semester: "",
    dosenPaId: "",
  });

  React.useEffect(() => {
    if (editMahasiswa) {
      setFormData({
        nama: editMahasiswa.nama ?? "",
        nim: editMahasiswa.nim ?? "",
        noHp: editMahasiswa.noHp ?? "",
        alamat: editMahasiswa.alamat ?? "",
        semester: editMahasiswa.semester ? String(editMahasiswa.semester) : "",
        dosenPaId: editMahasiswa.dosenPaId ? String(editMahasiswa.dosenPaId) : "",
      });
    } else {
      setFormData({
        nama: "",
        nim: "",
        noHp: "",
        alamat: "",
        semester: "",
        dosenPaId: "",
      });
    }
  }, [editMahasiswa]);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!user?.prodi?.id) {
        showToast.error("Anda tidak memiliki prodi yang valid.");
        return;
      }

      await createMahasiswa({
        ...formData,
        semester: parseInt(formData.semester),
        dosenPaId: parseInt(formData.dosenPaId),
        prodiId: user.prodi.id,
        // Default password or backend handles it? Assuming backend handles or we send default
        password: "password123", // Example default if needed, or check backend requirement
      });
      showToast.success("Mahasiswa berhasil ditambahkan");
      setCreateOpen(false);
      await refreshMahasiswa();
    } catch (error) {
        showToast.error("Gagal menambahkan mahasiswa");
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editMahasiswa) return;

    try {
      await updateMahasiswa(editMahasiswa.id, {
        ...formData,
        semester: parseInt(formData.semester),
        dosenPaId: parseInt(formData.dosenPaId),
      });
      showToast.success("Data mahasiswa berhasil diubah");
      setEditMahasiswa(null);
      await refreshMahasiswa();
    } catch (err) {
      showToast.error("Gagal mengubah mahasiswa");
      console.error(err);
    }
  }

  async function handleDeleteSubmit() {
    if (!deleteMahasiswaState) return;
    try {
      await deleteMahasiswa(deleteMahasiswaState.id);
      showToast.success("Data mahasiswa berhasil dihapus");
      setDeleteMahasiswaState(null);
      await refreshMahasiswa();
    } catch (err) {
      showToast.error("Gagal menghapus mahasiswa");
    }
  }

  const cols: ColumnDef<Mahasiswa>[] = React.useMemo(
    () => [
      {
        id: "no",
        header: () => <div className="text-left w-8">No</div>,
        cell: ({ row }) => <div className="text-left w-8">{row.index + 1}</div>,
        enableSorting: false,
        size: 32,
      },
      {
        accessorKey: "nama",
        header: "Nama",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("nama")}</div>
        ),
      },
      {
        accessorKey: "nim",
        header: "NIM",
        cell: ({ row }) => <div>{row.getValue("nim") ?? "-"}</div>,
      },
      {
        accessorKey: "semester",
        header: "Semester",
        cell: ({ row }) => <div>{row.getValue("semester") ?? "-"}</div>,
      },
      {
        id: "dosenPa",
        accessorFn: (row) => row.dosenPa?.nama ?? "-",
        header: "Dosen PA",
      },
      {
        id: "prodi",
        accessorFn: (row) => row.prodi?.nama ?? "-",
        header: "Prodi",
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const m = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setDetailMahasiswa(m)}>
                  <Info size={14} className="mr-2" />
                  Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditMahasiswa(m)}>
                  <Pencil size={14} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteMahasiswaState(m)}
                  className="text-red-600"
                >
                  <Trash2 size={14} className="mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns: cols,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: search,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearch,
  });

  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-md border border-gray-200 dark:border-neutral-700 p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-full bg-white dark:bg-neutral-800"
          />
           <Button onClick={() => setCreateOpen(true)} className="whitespace-nowrap">
             <Plus className="mr-2 h-4 w-4" /> Tambah
           </Button>
        </div>
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "table" | "card")}
        >
          <TabsList>
            <TabsTrigger value="table">
              <LayoutGrid size={16} />
            </TabsTrigger>
            <TabsTrigger value="card">
              <List size={16} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={viewMode}>
        <TabsContent value="table">
          <TableGlobal cols={cols} table={table} />
        </TabsContent>
        <TabsContent value="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                Tidak ada data mahasiswa.
              </div>
            )}
            {data.map((m) => (
              <div
                key={m.id}
                className="group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-gray-100 dark:border-neutral-800 shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                        {m.nama
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        {m.nama}
                      </h3>
                      <span className="text-xs text-muted-foreground mt-1 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full w-fit">
                        {m.nim}
                      </span>
                    </div>
                  </div>
                   <div className="grid grid-cols-1 gap-y-2 mt-2">
                       <div className="flex flex-col text-sm border-b border-gray-50 dark:border-neutral-800 pb-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Semester</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{m.semester || "-"}</span>
                       </div>
                       <div className="flex flex-col text-sm">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dosen PA</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{m.dosenPa?.nama || "-"}</span>
                       </div>
                   </div>
                </div>
                 <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-neutral-800">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs h-8"
                      onClick={() => setDetailMahasiswa(m)}
                    >
                      <Info size={14} className="mr-1.5" /> Detail
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs h-8"
                      onClick={() => setEditMahasiswa(m)}
                    >
                      <Pencil size={14} className="mr-1.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost" 
                      className="w-full text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => setDeleteMahasiswaState(m)}
                    >
                      <Trash2 size={14} className="mr-1.5" /> Hapus
                    </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Detail */}
      <Dialog
        open={!!detailMahasiswa}
        onOpenChange={(open) => !open && setDetailMahasiswa(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Mahasiswa</DialogTitle>
          </DialogHeader>
          {detailMahasiswa && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <Label className="text-xs text-muted-foreground">Nama</Label>
                   <div className="font-medium">{detailMahasiswa.nama}</div>
                </div>
                <div>
                   <Label className="text-xs text-muted-foreground">NIM</Label>
                   <div className="font-medium">{detailMahasiswa.nim}</div>
                </div>
                <div>
                   <Label className="text-xs text-muted-foreground">Semester</Label>
                   <div className="font-medium">{detailMahasiswa.semester}</div>
                </div>
                <div>
                   <Label className="text-xs text-muted-foreground">No HP</Label>
                   <div className="font-medium">{detailMahasiswa.noHp || "-"}</div>
                </div>
                <div className="col-span-2">
                   <Label className="text-xs text-muted-foreground">Alamat</Label>
                   <div className="font-medium">{detailMahasiswa.alamat || "-"}</div>
                </div>
                <div className="col-span-2">
                   <Label className="text-xs text-muted-foreground">Dosen PA</Label>
                   <div className="font-medium">{detailMahasiswa.dosenPa?.nama || "-"}</div>
                </div>
                <div className="col-span-2">
                   <Label className="text-xs text-muted-foreground">Prodi</Label>
                   <div className="font-medium">{detailMahasiswa.prodi?.nama || "-"}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
             <DialogClose asChild><Button variant="outline">Tutup</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Mahasiswa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Nama</Label>
                 <Input name="nama" value={formData.nama} onChange={handleFormChange} required />
               </div>
               <div className="space-y-2">
                 <Label>NIM</Label>
                 <Input name="nim" value={formData.nim} onChange={handleFormChange} required />
               </div>
               <div className="space-y-2">
                 <Label>No HP</Label>
                 <Input name="noHp" value={formData.noHp} onChange={handleFormChange} />
               </div>
               <div className="space-y-2">
                 <Label>Semester</Label>
                 <Input name="semester" type="number" value={formData.semester} onChange={handleFormChange} required />
               </div>
               <div className="col-span-2 space-y-2">
                 <Label>Alamat</Label>
                 <Input name="alamat" value={formData.alamat} onChange={handleFormChange} />
               </div>
               <div className="col-span-2 space-y-2">
                 <Label>Dosen PA</Label>
                 <Select value={formData.dosenPaId} onValueChange={(val) => handleSelectChange('dosenPaId', val)}>
                    <SelectTrigger>
                       <SelectValue placeholder="Pilih Dosen PA" />
                    </SelectTrigger>
                    <SelectContent>
                      {dosenList.map(d => (
                        <SelectItem key={d.id} value={String(d.id)}>{d.nama}</SelectItem>
                      ))}
                    </SelectContent>
                 </Select>
               </div>
            </div>
            <DialogFooter>
               <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
               <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Edit */}
      <Dialog open={!!editMahasiswa} onOpenChange={(val) => !val && setEditMahasiswa(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Mahasiswa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Nama</Label>
                 <Input name="nama" value={formData.nama} onChange={handleFormChange} required />
               </div>
               <div className="space-y-2">
                 <Label>NIM</Label>
                 <Input name="nim" value={formData.nim} onChange={handleFormChange} required />
               </div>
               <div className="space-y-2">
                 <Label>No HP</Label>
                 <Input name="noHp" value={formData.noHp} onChange={handleFormChange} />
               </div>
               <div className="space-y-2">
                 <Label>Semester</Label>
                 <Input name="semester" type="number" value={formData.semester} onChange={handleFormChange} required />
               </div>
               <div className="col-span-2 space-y-2">
                 <Label>Alamat</Label>
                 <Input name="alamat" value={formData.alamat} onChange={handleFormChange} />
               </div>
               <div className="col-span-2 space-y-2">
                 <Label>Dosen PA</Label>
                 <Select value={formData.dosenPaId} onValueChange={(val) => handleSelectChange('dosenPaId', val)}>
                    <SelectTrigger>
                       <SelectValue placeholder="Pilih Dosen PA" />
                    </SelectTrigger>
                    <SelectContent>
                      {dosenList.map(d => (
                        <SelectItem key={d.id} value={String(d.id)}>{d.nama}</SelectItem>
                      ))}
                    </SelectContent>
                 </Select>
               </div>
            </div>
            <DialogFooter>
               <Button type="button" variant="outline" onClick={() => setEditMahasiswa(null)}>Batal</Button>
               <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Delete */}
      <Dialog open={!!deleteMahasiswaState} onOpenChange={(val) => !val && setDeleteMahasiswaState(null)}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Hapus Mahasiswa</DialogTitle>
            </DialogHeader>
            <p>Apakah Anda yakin ingin menghapus mahasiswa <strong>{deleteMahasiswaState?.nama}</strong>?</p>
            <DialogFooter>
               <Button variant="outline" onClick={() => setDeleteMahasiswaState(null)}>Batal</Button>
               <Button variant="destructive" onClick={handleDeleteSubmit}>Hapus</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}
