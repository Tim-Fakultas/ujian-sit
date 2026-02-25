import { useState, useRef, useEffect, useCallback } from "react";
import {
  createRancanganPenelitian,
  updateJudulRancanganPenelitian,
} from "@/actions/rancanganPenelitian";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";
import { showToast } from "@/components/ui/custom-toast";
import revalidateAction from "@/actions/revalidate";
import { createEmptyForm } from "./helpers";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FormErrors = Partial<Record<keyof RancanganPenelitian, string>>;

export interface UseRanpelFormOptions {
  mahasiswaId: number;
  ranpelId?: number;
  initialData?: RancanganPenelitian;
  /** Current submission status — controls whether the judul field is editable. */
  status?: string;
  onSuccess?: () => void;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const REQUIRED_FIELDS: Array<{
  key: keyof RancanganPenelitian;
  label: string;
}> = [
  { key: "judulPenelitian", label: "Judul penelitian" },
  { key: "masalahDanPenyebab", label: "Masalah dan penyebab" },
  { key: "alternatifSolusi", label: "Alternatif solusi" },
  { key: "metodePenelitian", label: "Metode penelitian" },
  { key: "hasilYangDiharapkan", label: "Hasil yang diharapkan" },
  { key: "kebutuhanData", label: "Kebutuhan data" },
  { key: "jurnalReferensi", label: "Jurnal referensi" },
];

function validate(formData: RancanganPenelitian): FormErrors {
  const errs: FormErrors = {};
  for (const { key, label } of REQUIRED_FIELDS) {
    if (!String(formData[key] ?? "").trim()) {
      errs[key] = `${label} wajib diisi.`;
    }
  }
  return errs;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRanpelForm({
  mahasiswaId,
  ranpelId,
  initialData,
  status,
  onSuccess,
}: UseRanpelFormOptions) {
  const isEditMode = Boolean(ranpelId);
  const isTitleLocked = Boolean(status && status !== "menunggu");

  // ── Form state ──────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<RancanganPenelitian>(
    initialData ?? createEmptyForm(),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Auto-resize textarea refs ────────────────────────────────────────────────
  const textareaRefs = {
    masalahDanPenyebab: useRef<HTMLTextAreaElement | null>(null),
    alternatifSolusi: useRef<HTMLTextAreaElement | null>(null),
    hasilYangDiharapkan: useRef<HTMLTextAreaElement | null>(null),
    kebutuhanData: useRef<HTMLTextAreaElement | null>(null),
    jurnalReferensi: useRef<HTMLTextAreaElement | null>(null),
  } as const;

  useEffect(() => {
    Object.values(textareaRefs).forEach((ref) => {
      const el = ref.current;
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.masalahDanPenyebab,
    formData.alternatifSolusi,
    formData.hasilYangDiharapkan,
    formData.kebutuhanData,
    formData.jurnalReferensi,
  ]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    if (isEditMode && initialData) {
      setFormData(initialData);
      showToast.info("Form telah di-reset ke data awal");
    } else {
      setFormData(createEmptyForm());
    }
  }, [isEditMode, initialData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errs = validate(formData);
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        showToast.error("Periksa form, ada field yang perlu diperbaiki.");
        return;
      }

      setIsSubmitting(true);
      try {
        if (isEditMode && ranpelId) {
          await updateJudulRancanganPenelitian(mahasiswaId, ranpelId, formData);
          showToast.success(
            "Berhasil!",
            "Rancangan penelitian berhasil diperbarui.",
          );
        } else {
          await createRancanganPenelitian(mahasiswaId, formData);
          showToast.success(
            "Berhasil!",
            "Rancangan penelitian berhasil disimpan.",
          );
          setFormData(createEmptyForm());
        }
        await revalidateAction("/mahasiswa/pengajuan-ranpel");
        onSuccess?.();
      } catch {
        showToast.error(
          "Gagal!",
          `Gagal ${isEditMode ? "memperbarui" : "menyimpan"} rancangan penelitian.`,
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isEditMode, ranpelId, mahasiswaId, onSuccess],
  );

  return {
    // Derived flags
    isEditMode,
    isTitleLocked,

    // State
    formData,
    errors,
    isSubmitting,

    // Refs
    textareaRefs,

    // Handlers
    handleChange,
    handleReset,
    handleSubmit,
  };
}
