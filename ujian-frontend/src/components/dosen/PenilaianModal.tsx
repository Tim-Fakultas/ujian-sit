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
import React, { useEffect, useState } from "react";
import { getKomponenPenilaianByUjianByPeran } from "@/actions/komponenPenilaian";
import { postPenilaian } from "@/actions/penilaian";
import { KomponenPenilaian } from "@/types/KomponenPenilaian";
import { Ujian } from "@/types/Ujian";
import { useActionState } from "react";

interface PenilaianModalProps {
  open: boolean;
  onClose: () => void;
  ujian: Ujian;
  penilaian: Record<string, number>;
  setPenilaian: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  skorAkhir: number;
}

export default function PenilaianModal({
  open,
  onClose,
  ujian,
  penilaian,
  setPenilaian,
  skorAkhir,
}: PenilaianModalProps) {
  const [komponen, setKomponen] = useState<KomponenPenilaian[]>([]);

  useEffect(() => {
    if (ujian?.jenisUjian?.id && ujian?.peranPenguji) {
      getKomponenPenilaianByUjianByPeran(
        ujian.jenisUjian.id,
        ujian.peranPenguji
      ).then((data) => setKomponen(data ?? []));
    }
  }, [ujian?.jenisUjian?.id, ujian?.peranPenguji]);

  // Server action untuk submit penilaian
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
      nilai: Number(formData.get(`nilai_${k.id}`) ?? 0),
    }));

    try {
      await postPenilaian({
        ujianId: ujian.id,
        dosenId,
        komponenNilai,
      });
      // Jangan panggil onClose di server action, panggil di client effect
      return { success: true };
    } catch (err: unknown) {
      return { error: (err as Error)?.message || "Gagal menyimpan penilaian" };
    }
  };

  // Ganti useFormState dengan useActionState (Next.js 15+)
  const [state, formAction] = useActionState(
    (prevState: { success?: boolean; error?: string }, formData: FormData) =>
      submitPenilaianAction(prevState, formData),
    { success: false, error: undefined }
  );

  // Tutup modal jika sukses
  useEffect(() => {
    if (state && state.success) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);

  if (!open || !ujian) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80"
      onClick={onClose}
    >
      <div
        className="bg-white rounded shadow-lg p-6 relative max-h-[80vh] overflow-y-auto w-full max-w-2xl"
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
        <h2 className="text-lg font-bold mb-2">Form Penilaian Ujian</h2>
        <form className="space-y-3" action={formAction}>
          {/* Identitas */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="mb-1">Nama Mahasiswa</Label>
              <Input type="text" value={ujian.mahasiswa?.nama ?? ""} readOnly />
            </div>
            <div>
              <Label className="mb-1">NIM</Label>
              <Input type="text" value={ujian.mahasiswa?.nim ?? ""} readOnly />
            </div>
            <div>
              <Label className="mb-1">Prodi</Label>
              <Input
                type="text"
                value={ujian.mahasiswa?.prodi?.namaProdi ?? ""}
                readOnly
              />
            </div>
            <div>
              <Label className="mb-1">Peran Penguji</Label>
              <Input type="text" value={ujian.peranPenguji ?? ""} readOnly />
            </div>
          </div>
          {/* Penilaian dinamis */}
          <div className="mt-4">
            <Table className="w-full text-sm border">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border px-2 py-1">Kriteria</TableHead>
                  <TableHead className="border px-2 py-1">Bobot (%)</TableHead>
                  <TableHead className="border px-2 py-1">Skor</TableHead>
                  <TableHead className="border px-2 py-1">Bobot*Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {komponen.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="border px-2 py-1">
                      {k.namaKomponen}
                    </TableCell>
                    <TableCell className="border px-2 py-1">
                      {k.bobot}
                    </TableCell>
                    <TableCell className="border px-2 py-1">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        name={`nilai_${k.id}`}
                        defaultValue={penilaian[k.namaKomponen] ?? 0}
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell className="border px-2 py-1">
                      {(
                        ((penilaian[k.namaKomponen] ?? 0) * k.bobot) /
                        100
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-gray-50">
                  <TableCell className="border px-2 py-1">Skor Akhir</TableCell>
                  <TableCell className="border px-2 py-1">Total</TableCell>
                  <TableCell className="border px-2 py-1"></TableCell>
                  <TableCell className="border px-2 py-1">
                    {komponen
                      .reduce(
                        (sum, k) =>
                          sum +
                          ((penilaian[k.namaKomponen] ?? 0) * k.bobot) / 100,
                        0
                      )
                      .toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white rounded py-2 mt-2"
          >
            Simpan Penilaian
          </Button>
          {state?.error && (
            <div className="text-red-600 text-sm mt-2">{state.error}</div>
          )}
          {/* Catatan interval nilai */}
          <div className="mt-4 text-sm border rounded p-3 bg-gray-50">
            <strong>Catatan interval nilai:</strong>
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
