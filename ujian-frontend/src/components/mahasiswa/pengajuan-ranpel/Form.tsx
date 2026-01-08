"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createRancanganPenelitian } from "@/actions/rancanganPenelitian";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";
import { showToast } from "@/components/ui/custom-toast";
import revalidateAction from "@/actions/revalidate";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

interface FormProps {
  mahasiswaId: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function Form({ mahasiswaId, onSuccess, onClose }: FormProps) {
  const MAX_TEXT = 4000;
  const MIN_JUDUL = 10;
  const MIN_TEXT = 20;

  const [formData, setFormData] = useState<RancanganPenelitian>({
    judulPenelitian: "",
    masalahDanPenyebab: "",
    alternatifSolusi: "",
    metodePenelitian: "",
    hasilYangDiharapkan: "",
    kebutuhanData: "",
    jurnalReferensi: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // refs for auto-resize
  const refMasalah = useRef<HTMLTextAreaElement | null>(null);
  const refAlternatif = useRef<HTMLTextAreaElement | null>(null);
  const refHasil = useRef<HTMLTextAreaElement | null>(null);
  const refKebutuhan = useRef<HTMLTextAreaElement | null>(null);
  const refJurnal = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    [
      refMasalah.current,
      refAlternatif.current,
      refHasil.current,
      refKebutuhan.current,
      refJurnal.current,
    ].forEach((ta) => {
      if (ta) {
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight}px`;
      }
    });
  }, [
    formData.masalahDanPenyebab,
    formData.alternatifSolusi,
    formData.hasilYangDiharapkan,
    formData.kebutuhanData,
    formData.jurnalReferensi,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // enforce max length on client
    const val = value.slice(0, MAX_TEXT);
    setFormData((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    // auto resize handled by effect reading formData
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (
      !formData.judulPenelitian ||
      formData.judulPenelitian.trim().length < MIN_JUDUL
    ) {
      errs.judulPenelitian = `Judul minimal ${MIN_JUDUL} karakter.`;
    }
    if (
      !formData.masalahDanPenyebab ||
      formData.masalahDanPenyebab.trim().length < MIN_TEXT
    ) {
      errs.masalahDanPenyebab = `Jelaskan minimal ${MIN_TEXT} karakter.`;
    }
    if (
      !formData.alternatifSolusi ||
      formData.alternatifSolusi.trim().length < MIN_TEXT
    ) {
      errs.alternatifSolusi = `Jelaskan minimal ${MIN_TEXT} karakter.`;
    }
    if (
      !formData.metodePenelitian ||
      formData.metodePenelitian.trim().length < 3
    ) {
      errs.metodePenelitian = `Masukkan metode penelitian yang valid.`;
    }
    if (
      !formData.hasilYangDiharapkan ||
      formData.hasilYangDiharapkan.trim().length < MIN_TEXT
    ) {
      errs.hasilYangDiharapkan = `Jelaskan minimal ${MIN_TEXT} karakter.`;
    }
    if (
      !formData.kebutuhanData ||
      formData.kebutuhanData.trim().length < MIN_TEXT
    ) {
      errs.kebutuhanData = `Jelaskan minimal ${MIN_TEXT} karakter.`;
    }
    if (
      !formData.jurnalReferensi ||
      formData.jurnalReferensi.trim().length < MIN_TEXT
    ) {
      errs.jurnalReferensi = `Sertakan minimal ${MIN_TEXT} karakter referensi.`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast.error("Periksa form, ada field yang perlu diperbaiki.");
      return;
    }
    setIsSubmitting(true);

    try {
      await createRancanganPenelitian(mahasiswaId, formData);
      await revalidateAction("/mahasiswa/pengajuan-ranpel");
      showToast.success("Berhasil!", "Rancangan penelitian berhasil disimpan.");
      setFormData({
        judulPenelitian: "",
        masalahDanPenyebab: "",
        alternatifSolusi: "",
        metodePenelitian: "",
        hasilYangDiharapkan: "",
        kebutuhanData: "",
        jurnalReferensi: "",
      });
      onSuccess?.();
    } catch {
      showToast.error(
        "Gagal!",
        "Gagal menyimpan rancangan penelitian. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative" noValidate>
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b dark:border-neutral-800 px-6 py-4 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
              Form Rancangan Penelitian
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                Baru
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Isi data rancangan penelitian Anda dengan jelas dan lengkap.
            </div>
          </div>
        </div>

        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"
          >
            <XCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Scrollable Content Body */}
      <div className="p-6 space-y-8 bg-gray-50/50 dark:bg-[#0a0a0a]">
        {/* Judul Section */}
        <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="judulPenelitian"
                className="text-base font-bold flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Judul Penelitian
              </Label>
              {formData.judulPenelitian.length > 0 && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    formData.judulPenelitian.length > 150
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {formData.judulPenelitian.length}/200
                </span>
              )}
            </div>

            <div className="relative group">
              <Textarea
                id="judulPenelitian"
                name="judulPenelitian"
                value={formData.judulPenelitian}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value.slice(0, MAX_TEXT),
                  }));
                  setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
                }}
                placeholder="Tuliskan judul penelitian skripsi Anda di sini..."
                required
                className={`min-h-[100px] text-lg font-medium resize-none leading-relaxed transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl ${
                  errors.judulPenelitian
                    ? "border-red-400 focus-visible:ring-red-400/20"
                    : ""
                }`}
                maxLength={200}
              />
            </div>
            {errors.judulPenelitian && (
              <p className="text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-left-2">
                <XCircle size={14} /> {errors.judulPenelitian}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-6 h-full hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 pb-2 border-b dark:border-neutral-800">
                <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg dark:bg-orange-900/20 dark:text-orange-400">
                  <Sparkles size={14} />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500">
                  Latar Belakang
                </h3>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="masalahDanPenyebab"
                  className="font-semibold text-sm"
                >
                  Masalah & Penyebab
                </Label>
                <Textarea
                  id="masalahDanPenyebab"
                  name="masalahDanPenyebab"
                  ref={refMasalah}
                  value={formData.masalahDanPenyebab}
                  onChange={handleChange}
                  placeholder="Uraikan apa masalah utamanya dan penyebab masalah tersebut..."
                  rows={6}
                  className={`resize-none bg-gray-50 dark:bg-neutral-800/50 border-gray-200 focus:bg-white transition-colors rounded-xl ${
                    errors.masalahDanPenyebab ? "border-red-400" : ""
                  }`}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  {errors.masalahDanPenyebab ? (
                    <span className="text-red-500 mr-auto">
                      {errors.masalahDanPenyebab}
                    </span>
                  ) : null}
                  <span>{formData.masalahDanPenyebab.length} chars</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label
                  htmlFor="kebutuhanData"
                  className="font-semibold text-sm"
                >
                  Kebutuhan Data
                </Label>
                <Textarea
                  id="kebutuhanData"
                  name="kebutuhanData"
                  ref={refKebutuhan}
                  value={formData.kebutuhanData}
                  onChange={handleChange}
                  placeholder="Data apa saja yang diperlukan untuk penelitian ini?"
                  rows={4}
                  className={`resize-none bg-gray-50 dark:bg-neutral-800/50 border-gray-200 focus:bg-white transition-colors rounded-xl ${
                    errors.kebutuhanData ? "border-red-400" : ""
                  }`}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  {errors.kebutuhanData ? (
                    <span className="text-red-500 mr-auto">
                      {errors.kebutuhanData}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label
                  htmlFor="jurnalReferensi"
                  className="font-semibold text-sm"
                >
                  Jurnal Referensi
                </Label>
                <Textarea
                  id="jurnalReferensi"
                  name="jurnalReferensi"
                  ref={refJurnal}
                  value={formData.jurnalReferensi}
                  onChange={handleChange}
                  placeholder="Sebutkan jurnal atau referensi yang mendukung penelitian ini..."
                  rows={4}
                  className={`resize-none bg-gray-50 dark:bg-neutral-800/50 border-gray-200 focus:bg-white transition-colors rounded-xl ${
                    errors.jurnalReferensi ? "border-red-400" : ""
                  }`}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  {errors.jurnalReferensi ? (
                    <span className="text-red-500 mr-auto">
                      {errors.jurnalReferensi}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-6 h-full hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 pb-2 border-b dark:border-neutral-800">
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/20 dark:text-emerald-400">
                  <Sparkles size={14} />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500">
                  Solusi & Harapan
                </h3>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="alternatifSolusi"
                  className="font-semibold text-sm"
                >
                  Alternatif Solusi
                </Label>
                <Textarea
                  id="alternatifSolusi"
                  name="alternatifSolusi"
                  ref={refAlternatif}
                  value={formData.alternatifSolusi}
                  onChange={handleChange}
                  placeholder="Jelaskan solusi yang Anda tawarkan..."
                  rows={6}
                  className={`resize-none bg-gray-50 dark:bg-neutral-800/50 border-gray-200 focus:bg-white transition-colors rounded-xl ${
                    errors.alternatifSolusi ? "border-red-400" : ""
                  }`}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  {errors.alternatifSolusi ? (
                    <span className="text-red-500 mr-auto">
                      {errors.alternatifSolusi}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label
                  htmlFor="hasilYangDiharapkan"
                  className="font-semibold text-sm"
                >
                  Hasil yang Diharapkan
                </Label>
                <Textarea
                  id="hasilYangDiharapkan"
                  name="hasilYangDiharapkan"
                  ref={refHasil}
                  value={formData.hasilYangDiharapkan}
                  onChange={handleChange}
                  placeholder="Apa target capaian dari penelitian ini?"
                  rows={4}
                  className={`resize-none bg-gray-50 dark:bg-neutral-800/50 border-gray-200 focus:bg-white transition-colors rounded-xl ${
                    errors.hasilYangDiharapkan ? "border-red-400" : ""
                  }`}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  {errors.hasilYangDiharapkan ? (
                    <span className="text-red-500 mr-auto">
                      {errors.hasilYangDiharapkan}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="space-y-3">
            <Label
              htmlFor="metodePenelitian"
              className="font-bold text-base flex items-center gap-2"
            >
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
              Metode Penelitian
            </Label>
            <Input
              id="metodePenelitian"
              name="metodePenelitian"
              value={formData.metodePenelitian}
              onChange={handleChange}
              placeholder="Contoh: Kuantitatif dengan algoritma XYZ..."
              required
              className={`h-12 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 rounded-xl ${
                errors.metodePenelitian ? "border-red-400" : ""
              }`}
              maxLength={200}
            />
            <div className="text-xs text-red-500 mt-1">
              {errors.metodePenelitian}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t dark:border-neutral-800 sticky bottom-0 bg-gray-50/90 dark:bg-[#0a0a0a]/90 backdrop-blur p-4 -mx-6 -mb-6 mt-4 z-30">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center gap-2 h-12 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            aria-live="polite"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Simpan Rancangan
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-12 px-6 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800"
            onClick={() =>
              setFormData({
                judulPenelitian: "",
                masalahDanPenyebab: "",
                alternatifSolusi: "",
                metodePenelitian: "",
                hasilYangDiharapkan: "",
                kebutuhanData: "",
                jurnalReferensi: "",
              })
            }
          >
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
}
