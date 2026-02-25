"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";
import { CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react";
import { useRanpelForm, FormErrors } from "./useRanpelForm";

// ─── Props ────────────────────────────────────────────────────────────────────

interface FormProps {
  mahasiswaId: number;
  ranpelId?: number;
  initialData?: RancanganPenelitian;
  /** Current submission status — controls whether the judul field is editable. */
  status?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Form({
  mahasiswaId,
  ranpelId,
  initialData,
  status,
  onSuccess,
  onClose,
}: FormProps) {
  const {
    isEditMode,
    isTitleLocked,
    formData,
    errors,
    isSubmitting,
    textareaRefs,
    handleChange,
    handleReset,
    handleSubmit,
  } = useRanpelForm({ mahasiswaId, ranpelId, initialData, status, onSuccess });

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col relative overflow-hidden"
      noValidate
    >
      {/* ── Header ── */}
      <FormHeader isEditMode={isEditMode} onClose={onClose} />

      {/* ── Scrollable body ── */}
      <div className="flex-1 p-6 space-y-6 bg-gray-50/50 dark:bg-[#0a0a0a] overflow-y-auto">
        {/* Judul */}
        <FormSection>
          <FormFieldLabel htmlFor="judulPenelitian" accent="bg-primary">
            Judul Penelitian
            {formData.judulPenelitian.length > 0 && (
              <CharCount count={formData.judulPenelitian.length} />
            )}
          </FormFieldLabel>
          <Textarea
            id="judulPenelitian"
            name="judulPenelitian"
            value={formData.judulPenelitian}
            onChange={handleChange}
            placeholder="Tuliskan judul penelitian skripsi Anda..."
            required
            disabled={isTitleLocked}
            className={`min-h-[100px] text-base font-medium resize-none rounded-xl ${
              errors.judulPenelitian ? "border-red-400" : ""
            } ${isTitleLocked ? "bg-gray-100 dark:bg-neutral-800 text-gray-500 cursor-not-allowed" : ""}`}
          />
          {isTitleLocked && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              Untuk mengubah judul, gunakan menu{" "}
              <a
                href="/mahasiswa/perbaikan-judul"
                className="underline font-semibold"
              >
                Perbaikan Judul
              </a>
              .
            </div>
          )}
          <FieldError message={errors.judulPenelitian} />
        </FormSection>

        {/* Latar Belakang */}
        <FormSection>
          <SectionHeading>Latar Belakang</SectionHeading>
          <TextareaField
            id="masalahDanPenyebab"
            label="Masalah & Penyebab"
            ref={textareaRefs.masalahDanPenyebab}
            value={formData.masalahDanPenyebab}
            onChange={handleChange}
            placeholder="Uraikan masalah utama dan penyebabnya..."
            error={errors.masalahDanPenyebab}
            rows={6}
          />
          <TextareaField
            id="kebutuhanData"
            label="Kebutuhan Data"
            ref={textareaRefs.kebutuhanData}
            value={formData.kebutuhanData}
            onChange={handleChange}
            placeholder="Data apa saja yang diperlukan untuk penelitian ini?"
            error={errors.kebutuhanData}
            rows={4}
          />
        </FormSection>

        {/* Solusi & Harapan */}
        <FormSection>
          <SectionHeading>Solusi &amp; Harapan</SectionHeading>
          <TextareaField
            id="alternatifSolusi"
            label="Alternatif Solusi"
            ref={textareaRefs.alternatifSolusi}
            value={formData.alternatifSolusi}
            onChange={handleChange}
            placeholder="Jelaskan solusi yang Anda tawarkan..."
            error={errors.alternatifSolusi}
            rows={6}
          />
          <TextareaField
            id="hasilYangDiharapkan"
            label="Hasil yang Diharapkan"
            ref={textareaRefs.hasilYangDiharapkan}
            value={formData.hasilYangDiharapkan}
            onChange={handleChange}
            placeholder="Apa target capaian dari penelitian ini?"
            error={errors.hasilYangDiharapkan}
            rows={4}
          />
        </FormSection>

        {/* Metode */}
        <FormSection>
          <FormFieldLabel htmlFor="metodePenelitian" accent="bg-purple-500">
            Metode Penelitian
          </FormFieldLabel>
          <Input
            id="metodePenelitian"
            name="metodePenelitian"
            value={formData.metodePenelitian}
            onChange={handleChange}
            placeholder="Contoh: Kuantitatif dengan algoritma XYZ..."
            required
            className={`h-12 rounded-xl ${errors.metodePenelitian ? "border-red-400" : ""}`}
          />
          <FieldError message={errors.metodePenelitian} />
        </FormSection>

        {/* Jurnal */}
        <FormSection>
          <FormFieldLabel htmlFor="jurnalReferensi" accent="bg-teal-500">
            Jurnal Referensi
          </FormFieldLabel>
          <TextareaField
            id="jurnalReferensi"
            label=""
            ref={textareaRefs.jurnalReferensi}
            value={formData.jurnalReferensi}
            onChange={handleChange}
            placeholder="Sebutkan jurnal atau referensi yang mendukung penelitian ini..."
            error={errors.jurnalReferensi}
            rows={4}
            hideLabel
          />
        </FormSection>
      </div>

      {/* ── Footer ── */}
      <div className="flex-none flex gap-4 p-4 border-t dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 h-12 rounded-xl"
          aria-live="polite"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              {isEditMode ? "Memperbarui..." : "Menyimpan..."}
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              {isEditMode ? "Simpan Perubahan" : "Simpan Rancangan"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-12 px-6 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormHeader({
  isEditMode,
  onClose,
}: {
  isEditMode: boolean;
  onClose?: () => void;
}) {
  return (
    <div className="flex-none bg-white dark:bg-neutral-900 border-b dark:border-neutral-800 px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {isEditMode
              ? "Edit Rancangan Penelitian"
              : "Form Rancangan Penelitian"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEditMode
              ? "Perbarui data rancangan penelitian Anda."
              : "Isi data rancangan penelitian dengan jelas dan lengkap."}
          </p>
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
  );
}

function FormSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 pb-1 border-b dark:border-neutral-800">
      {children}
    </h3>
  );
}

function FormFieldLabel({
  htmlFor,
  accent,
  children,
}: {
  htmlFor: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center">
      <Label
        htmlFor={htmlFor}
        className="font-bold text-sm flex items-center gap-2"
      >
        <span className={`w-1 h-4 ${accent} rounded-full`} />
        {children}
      </Label>
    </div>
  );
}

function CharCount({ count }: { count: number }) {
  return (
    <span className="ml-2 text-xs font-normal text-muted-foreground">
      {count} karakter
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-sm text-red-500 flex items-center gap-1">
      <XCircle size={14} />
      {message}
    </p>
  );
}

interface TextareaFieldProps {
  id: keyof RancanganPenelitian;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  error?: string;
  errors?: FormErrors;
  rows?: number;
  hideLabel?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
}

const TextareaField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
  hideLabel = false,
  ref,
}: TextareaFieldProps) => (
  <div className="space-y-1.5">
    {!hideLabel && label && (
      <Label htmlFor={String(id)} className="font-semibold text-sm">
        {label}
      </Label>
    )}
    <Textarea
      id={String(id)}
      name={String(id)}
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`resize-none bg-gray-50 dark:bg-neutral-800/50 border-gray-200 focus:bg-white rounded-xl ${
        error ? "border-red-400" : ""
      }`}
    />
    {error && <FieldError message={error} />}
  </div>
);
