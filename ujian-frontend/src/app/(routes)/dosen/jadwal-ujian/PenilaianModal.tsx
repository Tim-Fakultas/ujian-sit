/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../../components/ui/table";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
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
  // ref to detect transition of action success (false -> true)
  const prevSuccessRef = useRef<boolean>(false);

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
  // nilai bisa null = belum diisi
  const [nilai, setNilai] = useState<Record<number, number | null>>({});
  const [isSudahNilai, setIsSudahNilai] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // cek apakah semua skor sudah diisi (bukan null/undefined)
  const isAllFilled =
    komponen.length > 0 &&
    komponen.every((k) => nilai[k.id] !== null && nilai[k.id] !== undefined);

  // Ambil peran dosen dari pivot
  const pengujiInfo = ujian?.penguji?.find(
    (p) => p.id === Number(currentDosenId)
  );

  const peranPenguji = pengujiInfo?.peran;
  const dosenId = pengujiInfo?.id;

  // Fetch komponen penilaian dan penilaian saat modal dibuka
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (!ujian?.jenisUjian?.id || !peranPenguji || !ujian?.id || !dosenId) {
        setKomponen([]);
        setNilai({});
        setIsSudahNilai(false);
        return;
      }
      // Ambil komponen penilaian
      const dataKomponen = await getKomponenPenilaianByUjianByPeran(
        ujian.jenisUjian.id,
        peranPenguji
      );
      if (!isMounted) return;
      setKomponen(dataKomponen ?? []);
      // Ambil penilaian yang sudah ada
      const dataPenilaian = await getPenilaianByUjianId(ujian.id);
      if (!isMounted) return;
      // Cek apakah sudah menilai
      const penilaianDosen = dataPenilaian.filter(
        (p: { dosenId: number }) => p.dosenId === Number(dosenId)
      );
      const sudah = penilaianDosen.length > 0;
      setIsSudahNilai(sudah);

      // Set nilai: jika sudah ada, tampilkan nilai sebelumnya, jika belum null
      const init: Record<number, number | null> = {};
      (dataKomponen ?? []).forEach((k) => {
        const existing = penilaianDosen.find(
          (p: any) => p.komponenPenilaianId === k.id
        );
        init[k.id] = existing ? Number(existing.nilai) : null;
      });
      setNilai(init);
    }
    if (open) fetchData();
    return () => {
      isMounted = false;
    };
  }, [open, ujian?.jenisUjian?.id, peranPenguji, ujian?.id, dosenId]);

  // Update skor, terima string dari input; kosong -> null, else number (clamped 0-100)
  const handleNilaiChange = (id: number, val: string | number | null) => {
    let v: number | null;
    if (val === null || val === "") {
      v = null;
    } else {
      v = Number(val);
      if (isNaN(v)) v = null;
      else v = Math.max(0, Math.min(100, v));
    }
    setNilai((prev) => ({ ...prev, [id]: v }));
  };

  // Hitung bobot × skor
  const getBobotSkor = (id: number, bobot: number) =>
    (((nilai[id] ?? 0) as number) * bobot) / 100;

  const totalSkor = komponen.reduce(
    (sum, k) => sum + getBobotSkor(k.id, k.bobot),
    0
  );

  // Server Action Submit
  const submitPenilaianAction = async () => {
    setIsLoading(true);
    // Prevent double submit if already submitted
    if (isSudahNilai) {
      setIsLoading(false);
      return { error: "Anda sudah memberikan penilaian." };
    }
    if (!ujian.id || !dosenId) {
      setIsLoading(false);
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
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || "Gagal menyimpan penilaian" };
    }
  };

  const [state, formAction] = useActionState(submitPenilaianAction, {
    success: false,
    error: undefined,
  });

  // Tampilkan toast HANYA ketika state.success berubah dari false -> true
  useEffect(() => {
    if (state.success && !prevSuccessRef.current) {
      import("sonner").then(({ toast }) =>
        toast.success("Penilaian berhasil disimpan!")
      );
      // close modal & revalidate
      onClose();
      revalidateAction("/dosen/jadwal-ujian");
    }
    prevSuccessRef.current = !!state.success;
  }, [state.success, onClose]);

  if (!open || !ujian) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#18181c] rounded-2xl shadow-2xl p-0 relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b ">
          <h2 className="text-xl font-bold tracking-tight">
            Form Penilaian Ujian
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full "
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Tabel Penilaian */}
        <form
          action={formAction}
          className="flex-1 flex flex-col overflow-auto"
        >
          <div className="flex-1 px-6 py-4 overflow-auto">
            <div className="border rounded-xl overflow-hidden  bg-white dark:bg-[#23232a]">
              <Table className="w-full text-sm">
                <TableHeader className="border-b bg-gray-50 dark:bg-[#202024]">
                  <TableRow>
                    <TableHead className="font-semibold">Kriteria</TableHead>
                    <TableHead className="font-semibold">Bobot</TableHead>
                    <TableHead className="font-semibold">Skor</TableHead>
                    <TableHead className="font-semibold">
                      Bobot × Skor
                    </TableHead>
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
                          value={nilai[k.id] ?? ""}
                          onChange={(e) =>
                            handleNilaiChange(k.id, e.target.value)
                          }
                          className="w-16 text-center rounded-md border border-muted"
                        />
                      </TableCell>
                      <TableCell>
                        {getBobotSkor(k.id, k.bobot).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="px-4 py-2 border-t text-right text-base font-bold bg-gray-50 dark:bg-[#202024]">
                Total Skor:{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {totalSkor.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <Button
              type="submit"
              className={`w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow ${
                isSudahNilai || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSudahNilai || !isAllFilled || isLoading}
              aria-disabled={isSudahNilai || !isAllFilled || isLoading}
              title={
                isSudahNilai ? "Anda sudah memberikan penilaian." : undefined
              }
            >
              {isLoading ? "Menyimpan..." : "Simpan Penilaian"}
            </Button>

            {isSudahNilai && (
              <p className="text-xs text-red-600 mt-2 text-center">
                Anda sudah memberikan penilaian.
              </p>
            )}

            {!isAllFilled && (
              <p className="text-xs text-orange-600 mt-2 text-center">
                Harap isi semua skor sebelum menyimpan.
              </p>
            )}

            {state.error && (
              <p className="text-red-600 text-sm mt-2 text-center">
                {state.error}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
