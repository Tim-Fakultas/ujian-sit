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
import { getKomponenPenilaianByUjianByPeran } from "@/actions/komponenPenilaian";
import { postPenilaian } from "@/actions/penilaian";
import { KomponenPenilaian } from "@/types/KomponenPenilaian";
import { Ujian } from "@/types/Ujian";
import { useActionState } from "react";
import revalidateAction from "@/actions/revalidateAction";

interface PenilaianModalProps {
  open: boolean;
  onClose: () => void;
  ujian: Ujian;
  penilaian?: Record<string, number>;
  setPenilaian?: (penilaian: Record<string, number>) => void;
}

export default function PenilaianModal({
  open,
  onClose,
  ujian,
}: PenilaianModalProps) {
  const [komponen, setKomponen] = useState<KomponenPenilaian[]>([]);
  const [nilai, setNilai] = useState<Record<number, number>>({}); // nilai per komponen id

  useEffect(() => {
    if (ujian?.jenisUjian?.id && ujian?.peranPenguji) {
      getKomponenPenilaianByUjianByPeran(
        ujian.jenisUjian.id,
        ujian.peranPenguji
      ).then((data) => {
        setKomponen(data ?? []);
        const init: Record<number, number> = {};
        (data ?? []).forEach((k) => (init[k.id] = 0));
        setNilai(init);
      });
    }
  }, [ujian?.jenisUjian?.id, ujian?.peranPenguji]);

  // ✅ update skor secara dinamis
  const handleNilaiChange = (id: number, val: number) => {
    setNilai((prev) => ({ ...prev, [id]: val }));
  };

  // hitung bobot * skor
  const getBobotSkor = (id: number, bobot: number) =>
    ((nilai[id] ?? 0) * bobot) / 100;

  // hitung total
  const totalSkor = komponen.reduce(
    (sum, k) => sum + getBobotSkor(k.id, k.bobot),
    0
  );

  // Server Action Submit
  const submitPenilaianAction = async (_: unknown, formData: FormData) => {
    let dosenId: number | undefined = undefined;
    if (ujian.peranPenguji === "Ketua Penguji")
      dosenId = ujian.ketuaPenguji?.id;
    else if (ujian.peranPenguji === "Sekretaris Penguji")
      dosenId = ujian.sekretarisPenguji?.id;
    else if (ujian.peranPenguji === "Penguji 1") dosenId = ujian.penguji1?.id;
    else if (ujian.peranPenguji === "Penguji 2") dosenId = ujian.penguji2?.id;

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
    } catch (err: unknown) {
      return { error: (err as Error)?.message || "Gagal menyimpan penilaian" };
    }
  };

  const [state, formAction] = useActionState(
    (prev: { success?: boolean; error?: string }, formData: FormData) =>
      submitPenilaianAction(prev, formData),
    { success: false, error: undefined }
  );

  // Tutup modal jika sukses
  useEffect(() => {
    if (state && state.success) {
      onClose();
      revalidateAction("/dosen/jadwal-ujian");
    }
  }, [onClose, state, state.success]);

  if (!open || !ujian) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </Button>
        <h2 className="text-lg font-bold  mb-3">Form Penilaian Ujian</h2>

        {/* Identitas Mahasiswa */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <Label className="mb-1">Nama Mahasiswa</Label>
            <Input value={ujian.mahasiswa?.nama ?? ""} readOnly />
          </div>
          <div>
            <Label className="mb-1">NIM</Label>
            <Input value={ujian.mahasiswa?.nim ?? ""} readOnly />
          </div>
          <div>
            <Label className="mb-1">Prodi</Label>
            <Input value={ujian.mahasiswa?.prodi?.namaProdi ?? ""} readOnly />
          </div>
          <div>
            <Label className="mb-1">Peran Penguji</Label>
            <Input value={ujian.peranPenguji ?? ""} readOnly />
          </div>
        </div>

        <form action={formAction}>
          <Table className="w-full text-sm border">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="border px-2 py-1">Kriteria</TableHead>
                <TableHead className="border px-2 py-1">Bobot (%)</TableHead>
                <TableHead className="border px-2 py-1">Skor</TableHead>
                <TableHead className="border px-2 py-1">Bobot × Skor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {komponen.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="border px-2 py-1">
                    {k.namaKomponen}
                  </TableCell>
                  <TableCell className="border px-2 py-1">{k.bobot}</TableCell>
                  <TableCell className="border px-2 py-1">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={nilai[k.id] ?? 0}
                      onChange={(e) =>
                        handleNilaiChange(k.id, Number(e.target.value))
                      }
                      onFocus={(e) => {
                        if (Number(e.target.value) === 0) e.target.value = "";
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          e.target.value = "0";
                          handleNilaiChange(k.id, 0);
                        }
                      }}
                      className="w-16 text-center"
                    />
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right">
                    {getBobotSkor(k.id, k.bobot).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-gray-50">
                <TableCell className="border px-2 py-1">Skor Akhir</TableCell>
                <TableCell className="border px-2 py-1">Total</TableCell>
                <TableCell className="border px-2 py-1"></TableCell>
                <TableCell className="border px-2 py-1 text-right text-[#636AE8]">
                  {totalSkor.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button
            type="submit"
            className="w-full mt-4 bg-[#636AE8] hover:bg-[#4b53c5] text-white"
          >
            Simpan Penilaian
          </Button>

          {state?.error && (
            <p className="text-red-600 text-sm mt-2">{state.error}</p>
          )}

          {/* Catatan interval nilai */}
          <div className="mt-5 text-sm border rounded p-3 bg-gray-50">
            <strong>Catatan Interval Nilai:</strong>
            <Table className="mt-2">
              <TableBody>
                <TableRow>
                  <TableCell className="pr-2">A</TableCell>
                  <TableCell>: 80.00 – 100</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pr-2">B</TableCell>
                  <TableCell>: 70.00 – 79.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pr-2">C</TableCell>
                  <TableCell>: 60.00 – 69.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pr-2">D</TableCell>
                  <TableCell>: 56.00 – 59.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pr-2">E</TableCell>
                  <TableCell>: {"<"} 55.99</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </form>
      </div>
    </div>
  );
}
