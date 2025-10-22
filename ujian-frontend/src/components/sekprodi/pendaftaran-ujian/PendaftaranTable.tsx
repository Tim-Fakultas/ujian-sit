"use client";

import React, { useState, useEffect, useActionState } from "react";
import { getRuangan } from "@/actions/ruangan";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical } from "lucide-react";
import { getMahasiswaById } from "@/actions/mahasiswa";
import { getJenisUjianColor, getStatusColor, truncateTitle } from "@/lib/utils";
import { jadwalkanUjianAction } from "@/actions/jadwalUjian";
import { Ujian } from "@/types/Ujian";
import { useAuthStore } from "@/stores/useAuthStore";

export default function PendaftaranUjianTable({
  ujianList,
  dosen,
}: {
  ujianList: Ujian[];
  dosen: { data: { id: number | string; nama: string }[] };
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Ujian | null>(null);
  type MahasiswaDetail = {
    id: number | string;
    nama: string;
    pembimbing1?: { id: number | string; nama: string };
    pembimbing2?: { id: number | string; nama: string };
    // Add other fields as needed
  };

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    console.log("🔑 Token dari Zustand:", token);
  }, [token]);

  const [mahasiswaDetail, setMahasiswaDetail] =
    useState<MahasiswaDetail | null>(null);
  const [penguji1, setPenguji1] = useState<string>("");
  const [penguji2, setPenguji2] = useState<string>("");

  // State for ruangan
  const [ruanganList, setRuanganList] = useState<
    { id: number; namaRuangan: string }[]
  >([]);
  const [ruangan, setRuangan] = useState<string>("");

  useEffect(() => {
    getRuangan().then((res) => {
      if (res && Array.isArray(res.data)) {
        setRuanganList(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (selected) {
      getMahasiswaById(Number(selected.mahasiswa.id)).then((res) =>
        setMahasiswaDetail(res?.data || null)
      );
    }
  }, [selected]);

  type JadwalkanUjianState = {
    success: boolean;
    message: string;
  };

  const jadwalkanUjianReducer = async (
    state: JadwalkanUjianState,
    formData: FormData
  ): Promise<JadwalkanUjianState> => {
    const result = await jadwalkanUjianAction(formData);
    return {
      success: result?.success ?? false,
      message:
        result && "message" in result && typeof result.message === "string"
          ? result.message
          : "",
    };
  };

  // Ganti useFormState dengan useActionState
  const [state, formAction] = useActionState(jadwalkanUjianReducer, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Ujian berhasil dijadwalkan!");
      setOpen(false);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  // Reset penguji jika dialog ditutup
  useEffect(() => {
    if (!open) {
      setPenguji1("");
      setPenguji2("");
      setSelected(null);
      setMahasiswaDetail(null);
    }
  }, [open]);

  return (
    <div className="rounded-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Mahasiswa</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>Jenis Ujian</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ujianList.map((u, i) => (
            <TableRow key={u.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{u.mahasiswa.nama}</TableCell>
              <TableCell>{truncateTitle(u.judulPenelitian)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getJenisUjianColor(
                    u.jenisUjian.namaJenis
                  )}`}
                >
                  {u.jenisUjian.namaJenis}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusColor(
                    u.pendaftaranUjian.status
                  )}`}
                >
                  {u.pendaftaranUjian.status}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelected(u)}>
                      <Eye size={16} /> Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelected(u);
                        setOpen(true);
                      }}
                    >
                      Jadwalkan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog Jadwal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Jadwalkan Ujian</DialogTitle>
            <DialogDescription>Isi data ujian di bawah ini.</DialogDescription>
          </DialogHeader>

          {selected && !mahasiswaDetail && (
            <div className="text-center py-8">Memuat data pembimbing...</div>
          )}

          {selected && mahasiswaDetail && (
            <form action={formAction} className="space-y-3">
              <input
                type="hidden"
                name="ujianId"
                value={String(selected?.id ?? "")}
              />
              <input
                type="hidden"
                name="mahasiswaId"
                value={String(selected?.mahasiswa?.id ?? "")}
              />
              <input
                type="hidden"
                name="jenisUjianId"
                value={String(selected?.jenisUjian?.id ?? "")}
              />
              <input
                type="hidden"
                name="ketuaPenguji"
                value={String(mahasiswaDetail?.pembimbing1?.id ?? "")}
                required
              />
              <input
                type="hidden"
                name="sekretarisPenguji"
                value={String(mahasiswaDetail?.pembimbing2?.id ?? "")}
                required
              />
              {/* Hidden input for penguji1 */}
              <input
                type="hidden"
                name="penguji1"
                value={penguji1 ?? ""}
                required
              />
              {/* Hidden input for penguji2 */}
              <input
                type="hidden"
                name="penguji2"
                value={penguji2 ?? ""}
                required
              />

              <Label>Ketua Penguji</Label>
              <Input
                type="text"
                value={mahasiswaDetail?.pembimbing1?.nama || "-"}
                readOnly
                name="ketuaPengujiNama"
              />

              <Label>Sekretaris Penguji</Label>
              <Input
                type="text"
                value={mahasiswaDetail?.pembimbing2?.nama || "-"}
                readOnly
                name="sekretarisPengujiNama"
              />

              <Label>Tanggal Ujian</Label>
              <Input type="date" name="tanggalUjian" required />

              <div className="flex gap-2">
                <div className="w-1/2">
                  <Label>Waktu Mulai</Label>
                  <Input type="time" name="waktuMulai" required />
                </div>
                <div className="w-1/2">
                  <Label>Waktu Selesai</Label>
                  <Input type="time" name="waktuSelesai" required />
                </div>
              </div>

              <Label>Ruangan</Label>
              <select
                name="ruangan"
                value={ruangan}
                onChange={(e) => setRuangan(e.target.value)}
                required
                className="w-full border rounded px-2 py-2"
              >
                <option value="" disabled>
                  Pilih Ruangan
                </option>
                {ruanganList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.namaRuangan}
                  </option>
                ))}
              </select>
              <input type="hidden" name="ruangan" value={ruangan} />

              <Label>Dosen Penguji 1</Label>
              <Select value={penguji1} onValueChange={setPenguji1}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Dosen" />
                </SelectTrigger>
                <SelectContent>
                  {dosen.data.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Dosen Penguji 2</Label>
              <Select value={penguji2} onValueChange={setPenguji2}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Dosen" />
                </SelectTrigger>
                <SelectContent>
                  {dosen.data.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  !mahasiswaDetail?.pembimbing1?.id ||
                  !mahasiswaDetail?.pembimbing2?.id ||
                  !penguji1 ||
                  !penguji2
                }
              >
                Simpan Jadwal
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
