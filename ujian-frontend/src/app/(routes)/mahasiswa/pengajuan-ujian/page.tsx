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
import { Badge } from "@/components/ui/badge";
import { Plus, FileText } from "lucide-react";
import { PengajuanUjian } from "@/types/PengajuanUjian";
import {
  getPengajuanUjian,
  createPengajuanUjian,
} from "@/actions/pengajuanUjianAction";

export default function PengajuanUjianPage() {
  const [pengajuanData, setPengajuanData] = useState<PengajuanUjian[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getPengajuanUjian();
      // Filter only current user's proposals (mock current user)
      const userProposals = result.filter(
        (item) => item.mahasiswa.nim === "20220001"
      );
      setPengajuanData(userProposals);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdd = async (formData: FormData) => {
    const result = await createPengajuanUjian(formData);
    if (result.success) {
      setIsAddDialogOpen(false);
      fetchData();
    } else {
      alert(result.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500">
            Disetujui
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Pengajuan Ujian Skripsi
            </h1>
            <p className="text-gray-600 mt-1">
              Ajukan proposal ujian skripsi Anda
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded">
                <Plus className="mr-2 h-4 w-4" />
                Ajukan Ujian
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
              <DialogHeader>
                <DialogTitle>Form Pengajuan Ujian Skripsi</DialogTitle>
              </DialogHeader>
              <form action={handleSubmitAdd} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Judul Skripsi</label>
                  <Input
                    name="judulSkripsi"
                    placeholder="Masukkan judul skripsi"
                    className="mt-1 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Deskripsi</label>
                  <Textarea
                    name="deskripsi"
                    placeholder="Deskripsi singkat tentang skripsi"
                    className="mt-1 rounded"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Pembimbing 1</label>
                  <Select name="pembimbing1Id" required>
                    <SelectTrigger className="rounded">
                      <SelectValue placeholder="Pilih pembimbing 1" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
                      <SelectItem value="1">Dr. Budi Santoso, M.Kom</SelectItem>
                      <SelectItem value="2">Sari Indah, M.T</SelectItem>
                      <SelectItem value="3">
                        Prof. Dr. Andi Wijaya, M.Sc
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Pembimbing 2 (Opsional)
                  </label>
                  <Select name="pembimbing2Id">
                    <SelectTrigger className="rounded">
                      <SelectValue placeholder="Pilih pembimbing 2" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
                      <SelectItem value="1">Dr. Budi Santoso, M.Kom</SelectItem>
                      <SelectItem value="2">Sari Indah, M.T</SelectItem>
                      <SelectItem value="3">
                        Prof. Dr. Andi Wijaya, M.Sc
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded">
                    Ajukan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Judul Skripsi</TableHead>
                <TableHead>Pembimbing</TableHead>
                <TableHead>Tanggal Pengajuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SK Pembimbing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : pengajuanData.length > 0 ? (
                pengajuanData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="max-w-md">
                      <div>
                        <div className="font-medium">{item.judulSkripsi}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.deskripsi}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{item.pembimbing1?.nama}</div>
                        {item.pembimbing2 && (
                          <div className="text-sm text-gray-600">
                            {item.pembimbing2.nama}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(item.tanggalPengajuan).toLocaleDateString(
                        "id-ID"
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {item.skPembimbing ? (
                        <Button variant="outline" size="sm" className="rounded">
                          <FileText className="mr-2 h-4 w-4" />
                          Lihat SK
                        </Button>
                      ) : (
                        <span className="text-gray-400">Belum ada</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Belum ada pengajuan ujian
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
