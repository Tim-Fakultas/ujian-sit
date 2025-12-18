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
import { Search, Plus, Edit, Trash2, Bookmark } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import PageHeader from "@/components/common/PageHeader";
import TableGlobal from "@/components/tableGlobal";
import {
  getAllPeminatan,
  createPeminatan,
  updatePeminatan,
  deletePeminatan,
} from "@/actions/data-master/peminatan";
import { toast } from "sonner";

// Define simple type locally if not available globally yet
interface Peminatan {
  id: number;
  nama: string;
  deskripsi: string | null;
}

export default function PeminatanPage() {
  const [data, setData] = useState<Peminatan[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Peminatan | null>(null);

  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllPeminatan();
      setData(res || []);
    } catch (error) {
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createPeminatan(formData);
      toast.success("Peminatan berhasil ditambahkan");
      setIsAddOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Gagal menambahkan peminatan");
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      await updatePeminatan(selectedItem.id, formData);
      toast.success("Peminatan berhasil diupdate");
      setIsEditOpen(false);
      setSelectedItem(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Gagal update peminatan");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await deletePeminatan(id);
      toast.success("Peminatan berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus peminatan");
    }
  };

  const openEdit = (item: Peminatan) => {
    setSelectedItem(item);
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi || "",
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      deskripsi: "",
    });
  };

  const columnHelper = createColumnHelper<Peminatan>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row, index) => index + 1, {
        id: "no",
        header: "No",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("nama", {
        header: "Nama Peminatan",
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
        title="Data Master Peminatan"
        description="Kelola data bidang peminatan skripsi"
        icon={Bookmark}
      />

      <DataCard>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari peminatan..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Peminatan
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
            <DialogTitle>{isAddOpen ? "Tambah Peminatan" : "Edit Peminatan"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Nama Peminatan</label>
              <Input
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: AI, Web Development"
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
