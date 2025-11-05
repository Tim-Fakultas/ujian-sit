"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createRancanganPenelitian } from "@/actions/rancanganPenelitian";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";
import { toast } from "sonner";
import revalidateAction from "@/actions/revalidateAction";
import { CheckCircle2, XCircle } from "lucide-react";

interface FormProps {
  mahasiswaId: number;
  onSuccess?: () => void;
}

export default function Form({ mahasiswaId, onSuccess }: FormProps) {
  const [formData, setFormData] = useState<RancanganPenelitian>({
    judulPenelitian: "",
    masalahDanPenyebab: "",
    alternatifSolusi: "",
    metodePenelitian: "",
    hasilYangDiharapkan: "",
    kebutuhanData: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="judulPenelitian">Judul Penelitian</Label>
        <Input
          id="judulPenelitian"
          name="judulPenelitian"
          value={formData.judulPenelitian}
          onChange={handleChange}
          placeholder="Masukkan judul penelitian"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="masalahDanPenyebab">Masalah dan Penyebab</Label>
        <Textarea
          id="masalahDanPenyebab"
          name="masalahDanPenyebab"
          value={formData.masalahDanPenyebab}
          onChange={handleChange}
          placeholder="Jelaskan masalah dan penyebabnya"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alternatifSolusi">Alternatif Solusi</Label>
        <Textarea
          id="alternatifSolusi"
          name="alternatifSolusi"
          value={formData.alternatifSolusi}
          onChange={handleChange}
          placeholder="Jelaskan alternatif solusi yang diusulkan"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metodePenelitian">Metode Penelitian</Label>
        <Input
          id="metodePenelitian"
          name="metodePenelitian"
          value={formData.metodePenelitian}
          onChange={handleChange}
          placeholder="Contoh: Waterfall, Agile, dll."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hasilYangDiharapkan">Hasil yang Diharapkan</Label>
        <Textarea
          id="hasilYangDiharapkan"
          name="hasilYangDiharapkan"
          value={formData.hasilYangDiharapkan}
          onChange={handleChange}
          placeholder="Jelaskan hasil yang diharapkan dari penelitian"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kebutuhanData">Kebutuhan Data</Label>
        <Textarea
          id="kebutuhanData"
          name="kebutuhanData"
          value={formData.kebutuhanData}
          onChange={handleChange}
          placeholder="Jelaskan data apa saja yang dibutuhkan"
          rows={4}
          required
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Rancangan"}
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
