/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { getKomponenPenilaianByUjianByPeran } from "@/actions/data-master/komponenPenilaian";
import { postPenilaian } from "@/actions/penilaian";
import { getPenilaianByUjianId } from "@/actions/penilaian";
import { KomponenPenilaian } from "@/types/KomponenPenilaian";
import { Ujian } from "@/types/Ujian";
import { useActionState } from "react";
import revalidateAction from "@/actions/revalidate";
import { X } from "lucide-react";

interface PenilaianModalProps {
  open: boolean;
  onClose: () => void;
  ujian: Ujian;
  currentDosenId?: number; // sangat penting
}

export default function PenilaianModal({
  open,
  onClose,
  ujian,
  currentDosenId,
}: PenilaianModalProps) {
  // flag to avoid repeated toasts
  const [toastShown, setToastShown] = useState(false);
  // reset toast flag when modal opens
  useEffect(() => {
    if (open) setToastShown(false);
  }, [open]);
  // helper: format peran seperti "penguji_2" -> "Penguji 2", "ketua_penguji" -> "Ketua Penguji"
  const formatPeran = (p?: string) => {
    if (!p) return "";
    const map: Record<string, string> = {
      ketua_penguji: "Ketua Penguji",
      sekretaris_penguji: "Sekretaris Penguji",
      penguji_1: "Penguji 1",
      penguji_2: "Penguji 2",
    };
    if (map[p]) return map[p];
    // fallback: replace underscores with spaces and title case each word
    return p
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };
  const [komponen, setKomponen] = useState<KomponenPenilaian[]>([]);
  const [nilai, setNilai] = useState<Record<number, number>>({});
  const [isSudahNilai, setIsSudahNilai] = useState(false);

  // Ambil peran dosen dari pivot
  const pengujiInfo = ujian?.penguji?.find(
    (p) => p.id === Number(currentDosenId)
  );

  const peranPenguji = pengujiInfo?.peran;
  const dosenId = pengujiInfo?.id;

  // Fetch komponen penilaian saat modal dibuka
  useEffect(() => {
    if (!ujian?.jenisUjian?.id || !peranPenguji) return;

    getKomponenPenilaianByUjianByPeran(ujian.jenisUjian.id, peranPenguji).then(
      (data) => {
        setKomponen(data ?? []);
        const init: Record<number, number> = {};
        (data ?? []).forEach((k) => (init[k.id] = 0));
        setNilai(init);
      }
    );
  }, [ujian?.jenisUjian?.id, peranPenguji]);

  // Cek apakah dosen sudah memberikan nilai
  useEffect(() => {
    async function cekSudah() {
      if (!ujian?.id || !dosenId) {
        setIsSudahNilai(false);
        return;
      }

      const data = await getPenilaianByUjianId(ujian.id);

      const sudah = data.some(
        (p: { dosenId: number }) => p.dosenId === Number(dosenId)
      );

      setIsSudahNilai(sudah);
    }
    cekSudah();
  }, [ujian?.id, dosenId]);

  // Update skor
  const handleNilaiChange = (id: number, val: number) => {
    setNilai((prev) => ({ ...prev, [id]: val }));
  };

  // Hitung bobot × skor
  const getBobotSkor = (id: number, bobot: number) =>
    ((nilai[id] ?? 0) * bobot) / 100;

  const totalSkor = komponen.reduce(
    (sum, k) => sum + getBobotSkor(k.id, k.bobot),
    0
  );

  // Server Action Submit
  const submitPenilaianAction = async () => {
    if (!ujian.id || !dosenId) {
      return { error: "ID ujian atau dosen tidak ditemukan." };
    }

    const komponenNilai = komponen.map((k) => ({
      komponenId: k.id,
      nilai: nilai[k.id] ?? 0,
    }));

    try {
      await postPenilaian({
        ujianId: ujian.id,
        dosenId,
        komponenNilai,
      });

      return { success: true };
    } catch (err: any) {
      return { error: err.message || "Gagal menyimpan penilaian" };
    }
  };

  const [state, formAction] = useActionState(submitPenilaianAction, {
    success: false,
    error: undefined,
  });

  // Tutup modal jika sukses — tampilkan toast hanya sekali
  useEffect(() => {
    if (state.success && !toastShown) {
      import("sonner").then(({ toast }) =>
        toast.success("Penilaian berhasil disimpan!")
      );
      setToastShown(true);
      // close modal & revalidate
      onClose();
      revalidateAction("/dosen/jadwal-ujian");
    }
  }, [state.success, toastShown, onClose]);

  if (!open || !ujian) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-lg p-6 relative w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X size={16} />
        </Button>

        <h2 className="text-lg font-bold mb-3 text-left">
          Form Penilaian Ujian
        </h2>

        {/* Identitas */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div>
            <Label className="mb-2">Nama Mahasiswa</Label>
            <Input value={ujian.mahasiswa?.nama ?? ""} readOnly />
          </div>
          <div>
            <Label className="mb-2">NIM</Label>
            <Input value={ujian.mahasiswa?.nim ?? ""} readOnly />
          </div>
          <div>
            <Label className="mb-2">Prodi</Label>
            <Input value={ujian.mahasiswa?.prodi?.namaProdi ?? ""} readOnly />
          </div>
          <div>
            <Label className="mb-2">Peran Penguji</Label>
            <Input value={formatPeran(pengujiInfo?.peran)} readOnly />
          </div>
        </div>

        {/* Tabel Penilaian */}
        <form action={formAction}>
          <div className="border rounded-md overflow-hidden">
            <Table className="w-full text-sm ">
              <TableHeader className="border-b">
                <TableRow>
                  <TableHead>Kriteria</TableHead>
                  <TableHead>Bobot</TableHead>
                  <TableHead>Skor</TableHead>
                  <TableHead>Bobot × Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {komponen.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell>{k.namaKomponen}</TableCell>
                    <TableCell>{k.bobot}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={nilai[k.id] ?? 0}
                        onChange={(e) =>
                          handleNilaiChange(k.id, Number(e.target.value))
                        }
                        className="w-16 text-center"
                      />
                    </TableCell>
                    <TableCell>
                      {getBobotSkor(k.id, k.bobot).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white"
            disabled={isSudahNilai}
          >
            Simpan Penilaian
          </Button>

          {isSudahNilai && (
            <p className="text-xs text-red-600 mt-2 text-center">
              Anda sudah memberikan penilaian.
            </p>
          )}

          {state.error && (
            <p className="text-red-600 text-sm mt-2 text-center">
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
