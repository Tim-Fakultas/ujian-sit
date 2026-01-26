"use client";

import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, ListChecks } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import PageHeader from "@/components/common/PageHeader";
import TableGlobal from "@/components/tableGlobal";
import {
  getAllKomponenPenilaian,
  createKomponenPenilaian,
  updateKomponenPenilaian,
  deleteKomponenPenilaian,
} from "@/actions/data-master/komponenPenilaian";
import { getJenisUjian } from "@/actions/data-master/jenisUjian";
import { KomponenPenilaian } from "@/types/KomponenPenilaian";
import { toast } from "sonner";

export default function KomponenPenilaianPage() {
  const [data, setData] = useState<KomponenPenilaian[]>([]);
  const [jenisUjianList, setJenisUjianList] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KomponenPenilaian | null>(null);

  const [formData, setFormData] = useState({
    namaKomponen: "",
    bobot: "",
    jenisUjianId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [komponenData, jenisData] = await Promise.all([
        getAllKomponenPenilaian(),
        getJenisUjian(),
      ]);
      setData(komponenData || []);
      setJenisUjianList(jenisData || []);
    } catch (error) {
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createKomponenPenilaian({
        ...formData,
        bobot: parseFloat(formData.bobot),
        jenisUjianId: parseInt(formData.jenisUjianId),
      });
      toast.success("Komponen berhasil ditambahkan");
      setIsAddOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Gagal menambahkan komponen");
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      await updateKomponenPenilaian(selectedItem.id, {
        ...formData,
        bobot: parseFloat(formData.bobot),
        jenisUjianId: parseInt(formData.jenisUjianId),
      });
      toast.success("Komponen berhasil diupdate");
      setIsEditOpen(false);
      setSelectedItem(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Gagal update komponen");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await deleteKomponenPenilaian(id);
      toast.success("Komponen berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus komponen");
    }
  };

  const openEdit = (item: KomponenPenilaian) => {
    setSelectedItem(item);
    setFormData({
      namaKomponen: item.namaKomponen,
      bobot: item.bobot.toString(),
      jenisUjianId: item.jenisUjianId.toString(),
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      namaKomponen: "",
      bobot: "",
      jenisUjianId: "",
    });
  };

  const columnHelper = createColumnHelper<KomponenPenilaian>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row, index) => index + 1, {
        id: "no",
        header: "No",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("namaKomponen", {
        header: "Nama Komponen",
        cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      }),
      columnHelper.accessor("bobot", {
        header: "Bobot (%)",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("jenisUjian.namaJenis", {
        header: "Jenis Ujian",
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
        title="Data Master Komponen Penilaian"
        description="Kelola komponen penilaian untuk setiap jenis ujian"
        iconName="ListChecks"
      />

      <DataCard>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari komponen..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Komponen
          </Button>
        </div>

        <TableGlobal table={table} cols={columns} />
      </DataCard>

      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => {
          if (!open) {
              setIsAddOpen(false);
              setIsEditOpen(false);
              resetForm();
          }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAddOpen ? "Tambah Komponen" : "Edit Komponen"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="text-sm font-medium">Jenis Ujian</label>
                     <Select
                        value={formData.jenisUjianId}
                        onValueChange={(v) => setFormData({...formData, jenisUjianId: v})}
                     >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis Ujian" />
                        </SelectTrigger>
                        <SelectContent>
                             {jenisUjianList.map((j) => (
                                 <SelectItem key={j.id} value={j.id.toString()}>
                                     {j.namaJenis}
                                 </SelectItem>
                             ))}
                        </SelectContent>
                     </Select>
                 </div>
                 <div>
                    <label className="text-sm font-medium">Bobot (%)</label>
                    <Input
                        type="number"
                        value={formData.bobot}
                        onChange={(e) => setFormData({...formData, bobot: e.target.value})}
                        placeholder="Contoh: 30"
                    />
                 </div>
             </div>
             <div>
                 <label className="text-sm font-medium">Nama Komponen</label>
                 <Input
                    value={formData.namaKomponen}
                    onChange={(e) => setFormData({...formData, namaKomponen: e.target.value})}
                    placeholder="Contoh: Penguasaan Materi"
                 />
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsAddOpen(false); setIsEditOpen(false);}}>
              Batal
            </Button>
            <Button onClick={isAddOpen ? handleCreate : handleUpdate}>
                 {isAddOpen ? "Simpan" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
