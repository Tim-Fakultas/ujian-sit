"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createRancanganPenelitian } from "@/actions/rancanganPenelitian";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";
import { toast } from "sonner";
import revalidateAction from "@/actions/revalidate";
import { CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react";

interface FormProps {
  mahasiswaId: number;
  onSuccess?: () => void;
}

export default function Form({ mahasiswaId, onSuccess }: FormProps) {
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // refs for auto-resize
  const refMasalah = useRef<HTMLTextAreaElement | null>(null);
  const refAlternatif = useRef<HTMLTextAreaElement | null>(null);
  const refHasil = useRef<HTMLTextAreaElement | null>(null);
  const refKebutuhan = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    [
      refMasalah.current,
      refAlternatif.current,
      refHasil.current,
      refKebutuhan.current,
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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Periksa form, ada field yang perlu diperbaiki.");
      return;
    }
    setIsSubmitting(true);

    try {
      await createRancanganPenelitian(mahasiswaId, formData);
      await revalidateAction("/mahasiswa/pengajuan-ranpel");
      toast(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-green-500" size={20} />
          <div>
            <div className="font-semibold">Berhasil!</div>
            <div className="text-xs">
              Rancangan penelitian berhasil disimpan.
            </div>
          </div>
        </div>
      );
      setFormData({
        judulPenelitian: "",
        masalahDanPenyebab: "",
        alternatifSolusi: "",
        metodePenelitian: "",
        hasilYangDiharapkan: "",
        kebutuhanData: "",
      });
      onSuccess?.();
    } catch {
      toast(
        <div className="flex items-center gap-2">
          <XCircle className="text-red-500" size={20} />
          <div>
            <div className="font-semibold">Gagal!</div>
            <div className="text-xs">
              Gagal menyimpan rancangan penelitian. Silakan coba lagi.
            </div>
          </div>
        </div>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="text-lg font-medium">Form Rancangan Penelitian</div>
            <div className="text-sm text-muted-foreground">
              Isi data rancangan penelitian Anda dengan jelas.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="judulPenelitian">Judul Penelitian</Label>
        <Input
          id="judulPenelitian"
          name="judulPenelitian"
          value={formData.judulPenelitian}
          onChange={handleChange}
          placeholder="Masukkan judul penelitian"
          required
          className={`h-12 text-base ${
            errors.judulPenelitian ? "border-red-400" : ""
          }`}
          maxLength={200}
          aria-invalid={!!errors.judulPenelitian}
          aria-describedby={errors.judulPenelitian ? "err-judul" : undefined}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <div id="err-judul" className="text-xs text-red-500">
            {errors.judulPenelitian || ""}
          </div>
          <div>{formData.judulPenelitian.length}/200</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="masalahDanPenyebab">Masalah dan Penyebab</Label>
        <Textarea
          id="masalahDanPenyebab"
          name="masalahDanPenyebab"
          ref={refMasalah}
          value={formData.masalahDanPenyebab}
          onChange={handleChange}
          placeholder="Jelaskan masalah dan penyebabnya"
          rows={4}
          required
          className={`min-h-[90px] text-base resize-none ${
            errors.masalahDanPenyebab ? "border-red-400" : ""
          }`}
          maxLength={MAX_TEXT}
          aria-invalid={!!errors.masalahDanPenyebab}
          aria-describedby={
            errors.masalahDanPenyebab ? "err-masalah" : undefined
          }
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <div id="err-masalah" className="text-xs text-red-500">
            {errors.masalahDanPenyebab || ""}
          </div>
          <div>
            {formData.masalahDanPenyebab.length}/{MAX_TEXT}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alternatifSolusi">Alternatif Solusi</Label>
        <Textarea
          id="alternatifSolusi"
          name="alternatifSolusi"
          ref={refAlternatif}
          value={formData.alternatifSolusi}
          onChange={handleChange}
          placeholder="Jelaskan alternatif solusi yang diusulkan"
          rows={4}
          required
          className={`min-h-[90px] text-base resize-none ${
            errors.alternatifSolusi ? "border-red-400" : ""
          }`}
          maxLength={MAX_TEXT}
          aria-invalid={!!errors.alternatifSolusi}
          aria-describedby={
            errors.alternatifSolusi ? "err-alternatif" : undefined
          }
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <div id="err-alternatif" className="text-xs text-red-500">
            {errors.alternatifSolusi || ""}
          </div>
          <div>
            {formData.alternatifSolusi.length}/{MAX_TEXT}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="metodePenelitian">Metode Penelitian</Label>
          <Input
            id="metodePenelitian"
            name="metodePenelitian"
            value={formData.metodePenelitian}
            onChange={handleChange}
            placeholder="Contoh: Waterfall, Agile, dll."
            required
            className={`h-12 text-base ${
              errors.metodePenelitian ? "border-red-400" : ""
            }`}
            maxLength={200}
            aria-invalid={!!errors.metodePenelitian}
            aria-describedby={
              errors.metodePenelitian ? "err-metode" : undefined
            }
          />
          <div id="err-metode" className="text-xs text-red-500">
            {errors.metodePenelitian || ""}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kebutuhanData">Kebutuhan Data</Label>
          <Textarea
            id="kebutuhanData"
            name="kebutuhanData"
            ref={refKebutuhan}
            value={formData.kebutuhanData}
            onChange={handleChange}
            placeholder="Jelaskan data apa saja yang dibutuhkan"
            rows={3}
            required
            className={`min-h-[72px] text-base resize-none ${
              errors.kebutuhanData ? "border-red-400" : ""
            }`}
            maxLength={MAX_TEXT}
            aria-invalid={!!errors.kebutuhanData}
            aria-describedby={
              errors.kebutuhanData ? "err-kebutuhan" : undefined
            }
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div id="err-kebutuhan" className="text-xs text-red-500">
              {errors.kebutuhanData || ""}
            </div>
            <div>
              {formData.kebutuhanData.length}/{MAX_TEXT}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hasilYangDiharapkan">Hasil yang Diharapkan</Label>
        <Textarea
          id="hasilYangDiharapkan"
          name="hasilYangDiharapkan"
          ref={refHasil}
          value={formData.hasilYangDiharapkan}
          onChange={handleChange}
          placeholder="Jelaskan hasil yang diharapkan dari penelitian"
          rows={4}
          required
          className={`min-h-[90px] text-base resize-none ${
            errors.hasilYangDiharapkan ? "border-red-400" : ""
          }`}
          maxLength={MAX_TEXT}
          aria-invalid={!!errors.hasilYangDiharapkan}
          aria-describedby={
            errors.hasilYangDiharapkan ? "err-hasil" : undefined
          }
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <div id="err-hasil" className="text-xs text-red-500">
            {errors.hasilYangDiharapkan || ""}
          </div>
          <div>
            {formData.hasilYangDiharapkan.length}/{MAX_TEXT}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
          aria-live="polite"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Menyimpan...
            </>
          ) : (
            "Simpan Rancangan"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setFormData({
              judulPenelitian: "",
              masalahDanPenyebab: "",
              alternatifSolusi: "",
              metodePenelitian: "",
              hasilYangDiharapkan: "",
              kebutuhanData: "",
            })
          }
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
