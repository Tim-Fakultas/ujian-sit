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
  X,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchInput from "@/components/common/Search";
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
import { Dosen } from "@/types/Dosen";
import { User } from "@/types/Auth";
import {
  deleteDosenById,
  getDosen,
  updateDosen,
} from "@/actions/data-master/dosen";
import { showToast } from "@/components/ui/custom-toast";
import { useUrlSearch } from "@/hooks/use-url-search";

import TableGlobal from "@/components/tableGlobal";
import Image from "next/image";

interface DosenTableProps {
  dosen: Dosen[];
  user?: User | null;
}

export function DosenTable({ dosen, user }: DosenTableProps) {
  const [dosenData, setDosenData] = React.useState<Dosen[]>(dosen ?? []);

  const refreshDosen = React.useCallback(async () => {
    const prodiId = user?.prodi?.id;
    const newData = await getDosen(prodiId);
    setDosenData(newData.length > 0 ? newData : []);
  }, [user]);

  const data = React.useMemo(() => dosenData ?? [], [dosenData]);

  const { search, setSearch } = useUrlSearch();

  const filteredData = React.useMemo(() => {
    if (!search) return data;
    const lowerSearch = search.toLowerCase();
    return data.filter((item) =>
      item.nama?.toLowerCase().includes(lowerSearch) ||
      item.nidn?.toLowerCase().includes(lowerSearch) ||
      item.nip?.toLowerCase().includes(lowerSearch)
    );
  }, [data, search]);

  // State untuk mode tampilan
  const [viewMode, setViewMode] = React.useState<"table" | "card">("table");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [editDosen, setEditDosen] = React.useState<Dosen | null>(null);

  const [deleteDosen, setDeleteDosen] = React.useState<Dosen | null>(null);

  const [detailDosen, setDetailDosen] = React.useState<Dosen | null>(null);

  const [editForm, setEditForm] = React.useState<{
    nama?: string;
    noHp?: string;
    alamat?: string;
    tempatTanggalLahir?: string;
    pangkat?: string;
    golongan?: string;
    tmtFst?: string;
    jabatan?: string;
    foto?: string | null;
  }>({});

  React.useEffect(() => {
    if (editDosen) {
      setEditForm({
        nama: editDosen.nama ?? "",
        noHp: editDosen.noHp ?? "",
        alamat: editDosen.alamat ?? "",
        tempatTanggalLahir: editDosen.tempatTanggalLahir ?? "",
        pangkat: editDosen.pangkat ?? "",
        golongan: editDosen.golongan ?? "",
        tmtFst: editDosen.tmtFst ? editDosen.tmtFst.slice(0, 10) : "",
        jabatan: editDosen.jabatan ?? "",
        foto: editDosen.foto ?? "",
      });
    }
  }, [editDosen]);

  function handleEditFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setEditForm((prev) => ({
        ...prev,
        foto: files && files[0] ? URL.createObjectURL(files[0]) : null,
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleRemoveFoto() {
    setEditForm((prev) => ({
      ...prev,
      foto: "",
    }));
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editDosen) return;

    // Handle foto upload jika ada perubahan file
    let fotoUrl = editForm.foto;
    if (editForm.foto && typeof editForm.foto !== "string") {
      // Implement upload logic here if needed, or skip if not required
      // Example: fotoUrl = await uploadFoto(editForm.foto);
      fotoUrl = ""; // Placeholder, adjust as needed
    }

    await handleUpdateDosen(editDosen.id, {
      nama: editForm.nama,
      noHp: editForm.noHp === null ? undefined : editForm.noHp,
      alamat: editForm.alamat,
      tempatTanggalLahir: editForm.tempatTanggalLahir,
      pangkat: editForm.pangkat,
      golongan: editForm.golongan,
      tmtFst: editForm.tmtFst,
      jabatan: editForm.jabatan,
      foto: fotoUrl,
    });
    setEditDosen(null);
  }

  const cols: ColumnDef<Dosen>[] = React.useMemo(
    () => [
      {
        id: "no",
        header: () => <div className="text-left w-8">No</div>,
        cell: ({ row }) => <div className="text-left w-8">{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
        size: 32,
      },
      {
        accessorKey: "nama",
        header: () => <span className="text-left">Nama</span>,
        cell: ({ row }) => (
          <div className="text-left">{row.getValue("nama") as string}</div>
        ),
      },
      {
        accessorKey: "nidn",
        header: "NIDN",
        cell: ({ row }) => (
          <div className="">{row.getValue("nidn") ?? "-"}</div>
        ),
      },
      {
        accessorKey: "nip",
        header: "NIP",
        cell: ({ row }) => <div className="">{row.getValue("nip") ?? "-"}</div>,
      },
      {
        id: "prodi",
        accessorFn: (row) => row.prodi?.nama ?? "-",
        header: "Program Studi",
        cell: ({ row }) => (
          <div className="">{row.getValue("prodi") as string}</div>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const dosen = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setDetailDosen(dosen)}>
                  <Info size={14} className="mr-2" />
                  Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditDosen(dosen)}>
                  <Pencil size={14} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteDosen(dosen)}
                  className="text-red-600"
                >
                  <Trash2 size={14} className="mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns: cols,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Fungsi update dosen (async)
  async function handleUpdateDosen(
    id: number,
    payload: {
      nama?: string;
      noHp?: string;
      alamat?: string;
      tempatTanggalLahir?: string;
      pangkat?: string;
      golongan?: string;
      tmtFst?: string;
      jabatan?: string;
      foto?: string | null;
    }
  ) {
    try {
      const result = await updateDosen(id, payload);
      showToast.success("Data dosen berhasil diubah");
      await refreshDosen();
      return result;
    } catch (err) {
      console.error("Error updating dosen:", err);
      return null;
    }
  }

  // Fungsi delete dosen (async)
  async function handleDeleteDosen(id: number) {
    try {
      await deleteDosenById(id);
      showToast.success("Data dosen berhasil dihapus");
      await refreshDosen(); // refresh data setelah delete
    } catch (err) {
      console.error("Error deleting dosen:", err);
    }
  }

  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-md border border-gray-200 dark:border-neutral-700 p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2 w-full">
          <SearchInput
            placeholder="Search"
            className="max-w-full"
          />
        </div>
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "table" | "card")}
        >
          <TabsList>
            <TabsTrigger value="table">
              <LayoutGrid />
            </TabsTrigger>
            <TabsTrigger value="card">
              <List />
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
            {filteredData.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                Tidak ada data dosen.
              </div>
            )}
            {filteredData.map((dosen) => (
              <div
                key={dosen.id}
                className="group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-gray-100 dark:border-neutral-800 shadow-sm">
                      <AvatarImage
                        src={dosen.foto || undefined}
                        alt={dosen.nama}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                        {dosen.nama
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        {dosen.nama}
                      </h3>
                      <span className="text-xs text-muted-foreground mt-1 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full w-fit">
                        {dosen.jabatan || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-y-2 mt-2">
                    <div className="flex flex-col text-sm border-b border-gray-50 dark:border-neutral-800 pb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">NIDN</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{dosen.nidn || "-"}</span>
                    </div>
                    <div className="flex flex-col text-sm border-b border-gray-50 dark:border-neutral-800 pb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">NIP</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{dosen.nip || "-"}</span>
                    </div>
                    <div className="flex flex-col text-sm border-b border-gray-50 dark:border-neutral-800 pb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Prodi</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300 line-clamp-1">{dosen.prodi?.nama || "-"}</span>
                    </div>
                    <div className="flex flex-col text-sm">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">No HP</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{dosen.noHp || "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-neutral-800">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-8"
                    onClick={() => setDetailDosen(dosen)}
                  >
                    <Info size={14} className="mr-1.5" /> Detail
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-8"
                    onClick={() => setEditDosen(dosen)}
                  >
                    <Pencil size={14} className="mr-1.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setDeleteDosen(dosen)}
                  >
                    <Trash2 size={14} className="mr-1.5" /> Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Detail Dosen */}
      <Dialog
        open={!!detailDosen}
        onOpenChange={(open) => !open && setDetailDosen(null)}
      >
        <DialogContent className="w-full max-w-lg p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-neutral-900 rounded-2xl">
          <DialogHeader className="px-6 py-5 border-b border-gray-100 dark:border-neutral-800 flex flex-row items-center justify-between bg-white dark:bg-neutral-900">
            <DialogTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Detail Dosen
            </DialogTitle>
          </DialogHeader>

          {detailDosen && (
            <div className="p-0">
              {/* Profile Header */}
              <div className="px-6 py-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-neutral-800 shadow-lg ring-1 ring-gray-100 dark:ring-neutral-700">
                  <AvatarImage
                    src={detailDosen.foto || undefined}
                    alt={detailDosen.nama}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                    {detailDosen.nama
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1 text-center sm:text-left mt-2 flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {detailDosen.nama}
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    {detailDosen.jabatan || "-"}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200">
                      {detailDosen.nidn ? `NIDN. ${detailDosen.nidn}` : 'NIDN -'}
                    </span>
                    {detailDosen.prodi?.nama && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                        {detailDosen.prodi.nama}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="px-6 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">NIP</label>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200 break-words">
                      {detailDosen.nip || "-"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Pangkat / Golongan</label>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {detailDosen.pangkat || "-"} {detailDosen.golongan ? `(${detailDosen.golongan})` : ""}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Tempat, Tgl Lahir</label>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {detailDosen.tempatTanggalLahir || "-"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">TMT FST</label>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {detailDosen.tmtFst
                        ? new Date(detailDosen.tmtFst).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        })
                        : "-"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">No HP</label>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {detailDosen.noHp || "-"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Alamat</label>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {detailDosen.alamat || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="p-6 bg-gray-50 dark:bg-neutral-800/50 border-t border-gray-100 dark:border-neutral-800">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Dosen */}
      <Dialog
        open={!!editDosen}
        onOpenChange={(open) => !open && setEditDosen(null)}
      >
        <DialogContent className="w-full  max-w-lg p-0 border-none shadow-2xl bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <DialogTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Edit Dosen
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit}>
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nama Lengkap</Label>
                  <Input
                    name="nama"
                    value={editForm.nama ?? ""}
                    onChange={handleEditFormChange}
                    required
                    className="h-10 rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Nama lengkap dosen"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No HP</Label>
                  <Input
                    name="noHp"
                    value={editForm.noHp ?? ""}
                    onChange={handleEditFormChange}
                    className="h-10 rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-primary focus:border-primary"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Alamat</Label>
                  <Input
                    name="alamat"
                    value={editForm.alamat ?? ""}
                    onChange={handleEditFormChange}
                    className="h-10 rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-primary focus:border-primary"
                    placeholder="Alamat domisili"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tempat, Tanggal Lahir</Label>
                  <Input
                    name="tempatTanggalLahir"
                    value={editForm.tempatTanggalLahir ?? ""}
                    onChange={handleEditFormChange}
                    placeholder="Contoh: Maninjau, 01-08-1975"
                    className="h-10 rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Jabatan</Label>
                  <Input
                    name="jabatan"
                    value={editForm.jabatan ?? ""}
                    onChange={handleEditFormChange}
                    className="h-10 rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-primary focus:border-primary"
                    placeholder="Contoh: Lektor"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pangkat</Label>
                  <Input
                    name="pangkat"
                    value={editForm.pangkat ?? ""}
                    onChange={handleEditFormChange}
                    className="h-10 rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-primary focus:border-primary"
                    placeholder="Contoh: Penata Tk."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Golongan</Label>
                  <Input
                    name="golongan"
                    value={editForm.golongan ?? ""}
                    onChange={handleEditFormChange}
                    className="h-10 rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-primary focus:border-primary"
                    placeholder="Contoh: III.d"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">TMT FST</Label>
                  <Input
                    name="tmtFst"
                    type="date"
                    value={editForm.tmtFst ?? ""}
                    onChange={handleEditFormChange}
                    className="h-10 rounded-lg border-gray-300 dark:border-neutral-700 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Foto Profil</Label>

                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-dashed border-gray-200 dark:border-neutral-700">
                    {editForm.foto && typeof editForm.foto === "string" ? (
                      <div className="relative group shrink-0">
                        <Image
                          src={editForm.foto}
                          alt="Foto Dosen"
                          width={80}
                          height={80}
                          className="rounded-full h-16 w-16 object-cover border-2 border-white shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveFoto}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Hapus foto"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-gray-400 shrink-0">
                        <span className="text-xs">No Img</span>
                      </div>
                    )}

                    <div className="flex-1">
                      <Input
                        name="foto"
                        type="file"
                        accept="image/*"
                        onChange={handleEditFormChange}
                        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: JPG, PNG, GIF. Maks 2MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 bg-gray-50 dark:bg-neutral-800/50 border-t border-gray-100 dark:border-neutral-800 flex gap-2 justify-end">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="px-6 rounded-lg">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" variant="default" className="px-6 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Delete Dosen */}
      {deleteDosen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 min-w-[320px] max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setDeleteDosen(null)}
            >
              ×
            </button>
            <div className="font-semibold text-lg mb-4 text-red-600">
              Hapus Dosen
            </div>
            <div className="mb-4">
              Apakah Anda yakin ingin menghapus dosen{" "}
              <span className="font-semibold">{deleteDosen.nama}</span>?
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDeleteDosen(null)}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={async () => {
                  await handleDeleteDosen(deleteDosen.id);
                  setDeleteDosen(null);
                }}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
