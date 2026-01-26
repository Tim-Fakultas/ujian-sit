/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";

import { showToast } from "@/components/ui/custom-toast";
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
import {
  X,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
} from "lucide-react";

interface PenilaianModalProps {
  open: boolean;
  onClose: () => void;
  ujian: Ujian;
  currentDosenId?: number; // sangat penting
  onSuccess?: (dosenId: number) => void;
}

export default function PenilaianModal({
  open,
  onClose,
  ujian,
  currentDosenId,
  onSuccess,
}: PenilaianModalProps) {
  // ref to detect transition of action success (false -> true)
  const prevSuccessRef = useRef<boolean>(false);

  // ... (lines 35-169 remain unchanged)

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
      showToast.success("Penilaian berhasil disimpan!");
      // close modal & revalidate
      if (dosenId && onSuccess) {
        onSuccess(dosenId);
      }
      onClose();
      revalidateAction("/dosen/jadwal-ujian");
    }
    prevSuccessRef.current = !!state.success;
  }, [state.success, onClose, dosenId, onSuccess]);

  // Calculate grade text based on score
  // Calculate grade text based on score
  const getGrade = (score: number) => {
    if (score >= 80)
      return {
        label: "A",
        color:
          "text-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800",
      };
    if (score >= 70)
      return {
        label: "B",
        color:
          "text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800",
      };
    if (score >= 60)
      return {
        label: "C",
        color:
          "text-yellow-600 bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800",
      };
    if (score >= 56)
      return {
        label: "D",
        color:
          "text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800",
      };
    return {
      label: "E",
      color:
        "text-red-600 bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800",
    };
  };

  const gradeInfo = getGrade(totalSkor);

  if (!open || !ujian) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 p-4 transition-all duration-300 "
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#121212] rounded-xl shadow-2xl relative w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-100 dark:border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with decorative elements */}
        <div className="relative px-8 py-6 border-b dark:border-neutral-800 overflow-hidden bg-white dark:bg-[#121212]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

          <div className="relative flex items-center justify-between z-10 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <ClipboardList strokeWidth={1.5} size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Penilaian Ujian
                </h2>
                <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
                  {formatPeran(peranPenguji)} • {ujian.mahasiswa?.nama}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              onClick={onClose}
              aria-label="Tutup"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <form
          action={formAction}
          className="flex-1 flex flex-col overflow-hidden bg-gray-50/50 dark:bg-[#0a0a0a]/50"
        >
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
            {/* Score Cards Grid for Mobile / List for Desktop */}
            <div className="space-y-4">
              <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-neutral-500">
                <div className="col-span-6">Kriteria Penilaian</div>
                <div className="col-span-2 text-center">Bobot (%)</div>
                <div className="col-span-2 text-center">Skor (0-100)</div>
                <div className="col-span-2 text-right">Nilai Akhir</div>
              </div>

              {komponen.map((k, idx) => (
                <div
                  key={k.id}
                  className="group bg-white dark:bg-[#18181b] rounded-2xl p-4 sm:p-0 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Component Name */}
                  <div className="col-span-6 flex items-center gap-4 sm:pl-4 sm:py-4 mb-3 sm:mb-0">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 flex items-center justify-center text-sm font-medium border dark:border-neutral-700">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base leading-tight">
                        {k.namaKomponen.replace(/_\d+$/, "").replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 sm:hidden">
                        Bobot: {k.bobot}%
                      </p>
                    </div>
                  </div>

                  {/* Weight Display */}
                  <div className="col-span-2 hidden sm:flex justify-center">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 text-sm font-medium">
                      {k.bobot}%
                    </span>
                  </div>

                  {/* Score Input */}
                  <div className="col-span-2 flex items-center justify-between sm:justify-center gap-4">
                    <span className="text-sm font-medium sm:hidden text-gray-600">
                      Skor:
                    </span>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        max={100}
                        value={nilai[k.id] ?? ""}
                        onChange={(e) =>
                          handleNilaiChange(k.id, e.target.value)
                        }
                        placeholder="0"
                        className={`w-20 text-center font-bold text-lg h-12 rounded-xl border-2 transition-all duration-200 focus:ring-4 ${nilai[k.id] !== null && Number(nilai[k.id]) >= 0
                          ? "border-blue-100 bg-blue-50/50 text-blue-700 focus:border-blue-500 focus:ring-blue-500/20 dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-blue-400"
                          : "border-gray-200 bg-white focus:border-gray-400 dark:bg-neutral-900 dark:border-neutral-700"
                          }`}
                      />
                    </div>
                  </div>

                  {/* Calculated Value */}
                  <div className="col-span-2 flex items-center justify-between sm:justify-end sm:pr-4 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-dashed border-gray-200 dark:border-neutral-800">
                    <span className="text-sm font-medium sm:hidden text-gray-600">
                      Total:
                    </span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {getBobotSkor(k.id, k.bobot).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resume Card */}
            <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 shadow-sm border border-blue-100 dark:border-blue-900/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border-4 ${gradeInfo.color}`}
                >
                  {gradeInfo.label}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
                    Total Akumulasi
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {totalSkor.toFixed(2)}{" "}
                    <span className="text-lg text-gray-400 font-medium">
                      / 100
                    </span>
                  </h3>
                </div>
              </div>

              <div className="w-full sm:w-auto flex flex-col items-end gap-2">
                {!isAllFilled && (
                  <div className="flex items-center gap-2 text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg text-xs font-medium animate-pulse">
                    <AlertCircle size={14} />
                    Lengkapi semua skor penilaian
                  </div>
                )}
                {isSudahNilai && (
                  <div className="flex items-center gap-2 text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <CheckCircle2 size={14} />
                    Penilaian telah tersimpan
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 bg-white dark:bg-[#121212] border-t dark:border-neutral-800 flex justify-end gap-3 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-6 rounded-xl border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 font-medium"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className={`h-11 px-8 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all hover:translate-y-[-1px] ${isSudahNilai
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none dark:bg-neutral-800 dark:text-neutral-600"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                }`}
              disabled={isSudahNilai || !isAllFilled || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Menyimpan...
                </>
              ) : isSudahNilai ? (
                "Sudah Dinilai"
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Simpan Nilai
                </>
              )}
            </Button>
          </div>

          {state.error && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-red-50 dark:bg-red-900/90 text-red-600 dark:text-red-200 px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-in slide-in-from-bottom-5 fade-in">
              {state.error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
