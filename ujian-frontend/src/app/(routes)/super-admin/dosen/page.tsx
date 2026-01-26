"use client";

import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Users } from "lucide-react"; // Users icon for Dosen
import { DataCard } from "@/components/common/DataCard";
import PageHeader from "@/components/common/PageHeader";
import TableGlobal from "@/components/tableGlobal";
import {
  getAllDosen,
  createDosen,
  updateDosen,
  deleteDosenById,
} from "@/actions/data-master/dosen";
import { getAllProdi } from "@/actions/data-master/prodi";
import { Dosen } from "@/types/Dosen";
import { toast } from "sonner";

export default function DosenPage() {
  const [data, setData] = useState<Dosen[]>([]);
  const [prodiList, setProdiList] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Dosen | null>(null);

  // Stats
  const [formData, setFormData] = useState({
    nidn: "",
    nama: "",
    noHp: "",
    email: "",
    prodiId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dosenData, prodiData] = await Promise.all([
        getAllDosen(),
        getAllProdi(),
      ]);
      setData(dosenData || []);
      setProdiList(prodiData || []);
    } catch (error) {
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createDosen({
        ...formData,
        prodiId: parseInt(formData.prodiId),
      });
      toast.success("Dosen berhasil ditambahkan");
      setIsAddOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Gagal menambahkan dosen");
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      await updateDosen(selectedItem.id, {
        ...formData,
        // prodiId: parseInt(formData.prodiId), // Api might handle update differently related to relation
        // Checking updateDosen signature: it takes specific fields. 
        // We might need to adjust action if we want to update prodi relation.
        // For now adhering to existing action signature if possible, or assumed expansion.
        // Only expanding standard fields:
        nama: formData.nama,
        noHp: formData.noHp,
      });
      toast.success("Dosen berhasil diupdate");
      setIsEditOpen(false);
      setSelectedItem(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Gagal update dosen");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await deleteDosenById(id);
      toast.success("Dosen berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus dosen");
    }
  };

  const openEdit = (dosen: Dosen) => {
    setSelectedItem(dosen);
    setFormData({
      nidn: dosen.nidn,
      nama: dosen.nama,
      noHp: dosen.noHp || "",
      email: "", // Dosen type doesn't have email at root? check User
      prodiId: dosen.prodi?.id?.toString() || "",
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nidn: "",
      nama: "",
      noHp: "",
      email: "",
      prodiId: "",
    });
  };

  const columnHelper = createColumnHelper<Dosen>();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row, index) => index + 1, {
        id: "no",
        header: "No",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("nidn", {
        header: "NIDN",
        cell: (info) => <span className="font-mono">{info.getValue()}</span>,
      }),
      columnHelper.accessor("nama", {
        header: "Nama",
      }),
      columnHelper.accessor("prodi.nama", {
        header: "Prodi",
      }),
      columnHelper.accessor("noHp", {
        header: "No HP",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.display({
        id: "actions",
        header: "Aksi",
        cell: (info) => (
          <div className="flex gap-2 justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEdit(info.row.original)}
            >
              <Edit className="h-4 w-4 text-orange-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(info.row.original.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Data Master Dosen"
        description="Kelola data dosen dan staf pengajar"
        iconName="Users"
      />

      <DataCard>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari dosen..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Dosen
          </Button>
        </div>

        <TableGlobal table={table} cols={columns} />
      </DataCard>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Dosen Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">NIDN</label>
                <Input
                  value={formData.nidn}
                  onChange={(e) =>
                    setFormData({ ...formData, nidn: e.target.value })
                  }
                  placeholder="NIDN"
                />
              </div>
              <div>
                 <label className="text-sm font-medium">Prodi</label>
                 <Select
                    value={formData.prodiId}
                    onValueChange={(v) => setFormData({...formData, prodiId: v})}
                 >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Prodi" />
                    </SelectTrigger>
                    <SelectContent>
                        {prodiList.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                                {p.nama}
                            </SelectItem>
                        ))}
                    </SelectContent>
                 </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                placeholder="Nama Dosen"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">No HP</label>
                    <Input
                        value={formData.noHp}
                        onChange={(e) => setFormData({...formData, noHp: e.target.value})}
                        placeholder="08..."
                    />
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreate}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Dosen</DialogTitle>
          </DialogHeader>
           <div className="grid gap-4 py-4">
             {/* Simplified Edit Form: UpdateDosen action assumes some fields */}
             {/* Usually NIDN is unchangeable? */}
             <div>
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
              />
            </div>
            <div>
                <label className="text-sm font-medium">No HP</label>
                <Input
                    value={formData.noHp}
                    onChange={(e) => setFormData({...formData, noHp: e.target.value})}
                />
            </div>
           </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
