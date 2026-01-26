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
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import PageHeader from "@/components/common/PageHeader";
import TableGlobal from "@/components/tableGlobal";
import {
  getJenisUjian,
  createJenisUjian,
  updateJenisUjian,
  deleteJenisUjian,
} from "@/actions/data-master/jenisUjian";
import { JenisUjian } from "@/types/JenisUjian";
import { toast } from "sonner";

export default function JenisUjianPage() {
  const [data, setData] = useState<JenisUjian[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<JenisUjian | null>(null);

  const [formData, setFormData] = useState({
    namaJenis: "",
    deskripsi: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getJenisUjian();
      setData(res || []);
    } catch (error) {
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createJenisUjian(formData);
      toast.success("Jenis ujian berhasil ditambahkan");
      setIsAddOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Gagal menambahkan jenis ujian");
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      await updateJenisUjian(selectedItem.id, formData);
      toast.success("Jenis ujian berhasil diupdate");
      setIsEditOpen(false);
      setSelectedItem(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Gagal update jenis ujian");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await deleteJenisUjian(id);
      toast.success("Jenis ujian berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus jenis ujian");
    }
  };

  const openEdit = (item: JenisUjian) => {
    setSelectedItem(item);
    setFormData({
      namaJenis: item.namaJenis,
      deskripsi: item.deskripsi || "",
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      namaJenis: "",
      deskripsi: "",
    });
  };

  const columnHelper = createColumnHelper<JenisUjian>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row, index) => index + 1, {
        id: "no",
        header: "No",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("namaJenis", {
        header: "Nama Jenis Ujian",
        cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      }),
      columnHelper.accessor("deskripsi", {
        header: "Deskripsi",
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
        title="Data Master Jenis Ujian"
        description="Kelola jenis-jenis ujian skripsi"
        iconName="FileText"
      />

      <DataCard>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari jenis ujian..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Jenis Ujian
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
            <DialogTitle>{isAddOpen ? "Tambah Jenis Ujian" : "Edit Jenis Ujian"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Nama Jenis Ujian</label>
              <Input
                value={formData.namaJenis}
                onChange={(e) => setFormData({ ...formData, namaJenis: e.target.value })}
                placeholder="Contoh: Proposal, Hasil, Sidang"
              />
            </div>
            <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <Input
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    placeholder="Deskripsi singkat"
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
