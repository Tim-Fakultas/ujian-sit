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
  const [nilai, setNilai] = useState<Record<number, number>>({});
  const [isSudahNilai, setIsSudahNilai] = useState(false);

  // Fetch komponen penilaian saat modal dibuka
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

  // Cek apakah dosen sudah memberikan nilai
  useEffect(() => {
    async function cekSudahNilai() {
      if (ujian?.id && ujian?.peranPenguji) {
        const penilaian = await getPenilaianByUjianId(ujian.id);
        let dosenId: number | undefined = undefined;
        if (ujian.peranPenguji === "Ketua Penguji")
          dosenId = ujian.ketuaPenguji?.id;
        else if (ujian.peranPenguji === "Sekretaris Penguji")
          dosenId = ujian.sekretarisPenguji?.id;
        else if (ujian.peranPenguji === "Penguji 1")
          dosenId = ujian.penguji1?.id;
        else if (ujian.peranPenguji === "Penguji 2")
          dosenId = ujian.penguji2?.id;

        if (dosenId) {
          const sudah = penilaian.some(
            (p: { dosenId: number }) => p.dosenId === dosenId
          );
          setIsSudahNilai(sudah);
        } else {
          setIsSudahNilai(false);
        }
      } else {
        setIsSudahNilai(false);
      }
    }
    cekSudahNilai();
  }, [
    ujian?.id,
    ujian?.peranPenguji,
    ujian?.ketuaPenguji,
    ujian?.sekretarisPenguji,
    ujian?.penguji1,
    ujian?.penguji2,
  ]);

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
      // Cegah toast muncul terus-menerus dengan flag
      let shown = false;
      if (!shown) {
        shown = true;
        import("sonner").then(({ toast }) => {
          toast.success("Penilaian berhasil disimpan!", {
            description: "Data penilaian Anda telah berhasil disimpan.",
          });
        });
        onClose();
        revalidateAction("/dosen/jadwal-ujian");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

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
        <h2 className="text-lg font-bold  mb-3 text-left">
          Form Penilaian Ujian
        </h2>

        {/* Identitas Mahasiswa */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div>
            <Label className="mb-1 text-xs">Nama Mahasiswa</Label>
            <Input
              value={ujian.mahasiswa?.nama ?? ""}
              className="text-xs"
              readOnly
            />
          </div>
          <div>
            <Label className="mb-1 text-xs">NIM</Label>
            <Input
              value={ujian.mahasiswa?.nim ?? ""}
              className="text-xs"
              readOnly
            />
          </div>
          <div>
            <Label className="mb-1 text-xs">Prodi</Label>
            <Input
              value={ujian.mahasiswa?.prodi?.namaProdi ?? ""}
              className="text-xs"
              readOnly
            />
          </div>
          <div>
            <Label className="mb-1 text-xs">Peran Penguji</Label>
            <Input
              value={ujian.peranPenguji ?? ""}
              className="text-xs"
              readOnly
            />
          </div>
        </div>
        {/* Pastikan seluruh text di dalam grid ini sudah text-xs */}

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
                <TableCell className="border px-2 py-1 text-right text-blue-400">
                  {totalSkor.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button
            type="submit"
            className="w-full mt-4 bg-blue-400 hover:bg-blue-500 text-white"
            disabled={isSudahNilai}
          >
            Simpan Penilaian
          </Button>

          {isSudahNilai && (
            <p className="text-xs text-red-600 mt-2 text-center">
              Anda sudah memberikan penilaian untuk ujian ini.
            </p>
          )}

          {state?.error && (
            <p className="text-red-600 text-sm mt-2">{state.error}</p>
          )}

          {/* Catatan interval nilai */}
          <div className="mt-5 text-sm border rounded p-3 bg-gray-50">
            <strong className="block text-center mb-2">
              Catatan Interval Nilai:
            </strong>
            <Table className="mt-2 w-full">
              <TableBody>
                <TableRow>
                  <TableCell className="pr-2 text-left w-1/4">A</TableCell>
                  <TableCell className="text-left">: 80.00 – 100</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pr-2 text-left w-1/4">B</TableCell>
                  <TableCell className="text-left">: 70.00 – 79.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pr-2 text-left w-1/4">C</TableCell>
                  <TableCell className="text-left">: 60.00 – 69.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pr-2 text-left w-1/4">D</TableCell>
                  <TableCell className="text-left">: 56.00 – 59.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pr-2 text-left w-1/4">E</TableCell>
                  <TableCell className="text-left">: {"<"} 55.99</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </form>
      </div>
    </div>
  );
}
