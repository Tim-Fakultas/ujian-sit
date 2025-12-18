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
  MoreHorizontal,
  Pencil,
  Trash2,
  Info,
  LayoutGrid,
  List,
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
import { Dosen } from "@/types/Dosen";
import { User } from "@/types/Auth";
import {
  deleteDosenById,
  getDosen,
  updateDosen,
} from "@/actions/data-master/dosen";
import { showToast } from "@/components/ui/custom-toast";

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

  const [search, setSearch] = React.useState("");

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
    data,
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
          <Input
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-full bg-white dark:bg-neutral-800"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8">
                Tidak ada data dosen.
              </div>
            )}
            {data.map((dosen) => (
              <div
                key={dosen.id}
                className="bg-white dark:bg-neutral-900 border rounded-lg p-4 flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={dosen.foto || undefined}
                      alt={dosen.nama}
                    />
                    <AvatarFallback>
                      {dosen.nama
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{dosen.nama}</div>
                    <div className="text-xs text-muted-foreground">
                      {dosen.jabatan || "-"}
                    </div>
                  </div>
                </div>
                <div className="text-xs">
                  <div>
                    <span className="font-medium">NIDN:</span>{" "}
                    {dosen.nidn || "-"}
                  </div>
                  <div>
                    <span className="font-medium">NIP:</span> {dosen.nip || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Prodi:</span>{" "}
                    {dosen.prodi?.nama || "-"}
                  </div>
                  <div>
                    <span className="font-medium">No HP:</span>{" "}
                    {dosen.noHp || "-"}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDetailDosen(dosen)}
                  >
                    <Info size={14} className="mr-1" /> Detail
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditDosen(dosen)}
                  >
                    <Pencil size={14} className="mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteDosen(dosen)}
                  >
                    <Trash2 size={14} className="mr-1" /> Hapus
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
        <DialogContent className="w-full max-w-sm sm:max-w-lg p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2 border-b">
            <DialogTitle className="text-xl font-bold">
              Detail Dosen
            </DialogTitle>
          </DialogHeader>
          {detailDosen && (
            <div className="p-6 pt-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={detailDosen.foto || undefined}
                    alt={detailDosen.nama}
                  />
                  <AvatarFallback>
                    {detailDosen.nama
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">
                    {detailDosen.nama}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {detailDosen.jabatan || "-"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">NIDN</div>
                  <div className="font-medium">{detailDosen.nidn || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">NIP</div>
                  <div className="font-medium">{detailDosen.nip || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">No HP</div>
                  <div className="font-medium">{detailDosen.noHp || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Alamat</div>
                  <div className="font-medium">{detailDosen.alamat || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Tempat/Tgl Lahir
                  </div>
                  <div className="font-medium">
                    {detailDosen.tempatTanggalLahir || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Pangkat</div>
                  <div className="font-medium">
                    {detailDosen.pangkat || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Golongan</div>
                  <div className="font-medium">
                    {detailDosen.golongan || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">TMT FST</div>
                  <div className="font-medium">
                    {detailDosen.tmtFst
                      ? new Date(detailDosen.tmtFst).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Program Studi
                  </div>
                  <div className="font-medium">
                    {detailDosen.prodi?.nama || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="bg-muted px-6 py-3">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Dosen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium mb-1">Nama</Label>
                <Input
                  name="nama"
                  value={editForm.nama ?? ""}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">No HP</Label>
                <Input
                  name="noHp"
                  value={editForm.noHp ?? ""}
                  onChange={handleEditFormChange}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">Alamat</Label>
                <Input
                  name="alamat"
                  value={editForm.alamat ?? ""}
                  onChange={handleEditFormChange}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">
                  Tempat/Tgl Lahir
                </Label>
                <Input
                  name="tempatTanggalLahir"
                  value={editForm.tempatTanggalLahir ?? ""}
                  onChange={handleEditFormChange}
                  placeholder="Contoh: Maninjau, 01-08-1975"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">
                  Pangkat
                </Label>
                <Input
                  name="pangkat"
                  value={editForm.pangkat ?? ""}
                  onChange={handleEditFormChange}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">
                  Golongan
                </Label>
                <Input
                  name="golongan"
                  value={editForm.golongan ?? ""}
                  onChange={handleEditFormChange}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">
                  TMT FST
                </Label>
                <Input
                  name="tmtFst"
                  type="date"
                  value={editForm.tmtFst ?? ""}
                  onChange={handleEditFormChange}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">
                  Jabatan
                </Label>
                <Input
                  name="jabatan"
                  value={editForm.jabatan ?? ""}
                  onChange={handleEditFormChange}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">Foto</Label>
                <Input
                  name="foto"
                  type="file"
                  accept="image/*"
                  onChange={handleEditFormChange}
                />
                {editForm.foto && typeof editForm.foto === "string" && (
                  <div className="mt-2 flex items-center gap-2">
                    <Image
                      src={editForm.foto}
                      alt="Foto Dosen"
                      width={80}
                      height={80}
                      className="rounded h-16 w-16 object-cover"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={handleRemoveFoto}
                    >
                      Hapus Foto
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" variant="default">
                Simpan
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
