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
import { Search, Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import PageHeader from "@/components/common/PageHeader";
import TableGlobal from "@/components/tableGlobal";
import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/actions/data-master/mahasiswa";
import { getAllProdi } from "@/actions/data-master/prodi";
import { Mahasiswa } from "@/types/Mahasiswa";
import { toast } from "sonner";

export default function MahasiswaPage() {
  const [data, setData] = useState<Mahasiswa[]>([]);
  const [prodiList, setProdiList] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Mahasiswa | null>(null);

  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    noHp: "",
    alamat: "",
    semester: "",
    prodiId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mhsData, prodiData] = await Promise.all([
        getAllMahasiswa(),
        getAllProdi(),
      ]);
      setData(mhsData || []);
      setProdiList(prodiData || []);
    } catch (error) {
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createMahasiswa({
        ...formData,
        prodiId: parseInt(formData.prodiId),
        semester: parseInt(formData.semester),
      });
      toast.success("Mahasiswa berhasil ditambahkan");
      setIsAddOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Gagal menambahkan mahasiswa");
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      await updateMahasiswa(selectedItem.id, {
        ...formData,
        prodiId: parseInt(formData.prodiId),
        semester: parseInt(formData.semester),
      });
      toast.success("Mahasiswa berhasil diupdate");
      setIsEditOpen(false);
      setSelectedItem(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Gagal update mahasiswa");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await deleteMahasiswa(id);
      toast.success("Mahasiswa berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus mahasiswa");
    }
  };

  const openEdit = (item: Mahasiswa) => {
    setSelectedItem(item);
    setFormData({
      nim: item.nim,
      nama: item.nama,
      noHp: item.noHp || "",
      alamat: item.alamat || "",
      semester: item.semester?.toString() || "1",
      prodiId: item.prodi?.id?.toString() || "",
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nim: "",
      nama: "",
      noHp: "",
      alamat: "",
      semester: "",
      prodiId: "",
    });
  };

  const columnHelper = createColumnHelper<Mahasiswa>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row, index) => index + 1, {
        id: "no",
        header: "No",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("nim", {
        header: "NIM",
        cell: (info) => <span className="font-mono">{info.getValue()}</span>,
      }),
      columnHelper.accessor("nama", {
        header: "Nama",
      }),
      columnHelper.accessor("prodi.nama", {
        header: "Prodi",
      }),
      columnHelper.accessor("semester", {
        header: "Semester",
        cell: (info) => <div className="text-center">{info.getValue()}</div>,
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
        title="Data Master Mahasiswa"
        description="Kelola data mahasiswa aktif"
        icon={GraduationCap}
      />

      <DataCard>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari mahasiswa..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Mahasiswa
          </Button>
        </div>

        <TableGlobal table={table} cols={columns} />
      </DataCard>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => {
          if (!open) {
              setIsAddOpen(false);
              setIsEditOpen(false);
              resetForm();
          }
      }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddOpen ? "Tambah Mahasiswa" : "Edit Mahasiswa"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="text-sm font-medium">NIM</label>
                     <Input
                        value={formData.nim}
                        onChange={(e) => setFormData({...formData, nim: e.target.value})}
                        disabled={isEditOpen} // Assuming NIM is unique key
                        placeholder="NIM"
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
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    placeholder="Nama Mahasiswa"
                 />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="text-sm font-medium">Semester</label>
                     <Input
                        type="number"
                        value={formData.semester}
                        onChange={(e) => setFormData({...formData, semester: e.target.value})}
                        placeholder="1-8"
                     />
                 </div>
                  <div>
                     <label className="text-sm font-medium">No HP</label>
                     <Input
                        value={formData.noHp}
                        onChange={(e) => setFormData({...formData, noHp: e.target.value})}
                        placeholder="08..."
                     />
                 </div>
             </div>
             <div>
                 <label className="text-sm font-medium">Alamat</label>
                 <Input
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    placeholder="Alamat lengkap"
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
