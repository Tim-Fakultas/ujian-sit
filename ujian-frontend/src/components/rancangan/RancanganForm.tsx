"use client";

import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  User,
  BookOpen,
  Search,
  Settings,
  Target,
  Database,
  Save,
  FileText,
} from "lucide-react";
import { dosenPAData, mahasiswaData } from "@/lib/constants";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

interface RancanganFormData {
  judul: string;
  masalahPenyebab: string;
  alternatifSolusi: string;
  hasilDiharapkan: string;
  kebutuhanData: string;
  metodePelaksanaan: string;
  dosenPA: string;
}

interface RancanganFormProps {
  onSubmitSuccess?: () => void;
}

export function RancanganForm({ onSubmitSuccess }: RancanganFormProps) {
  const [formData, setFormData] = useState<RancanganFormData>({
    judul: "",
    masalahPenyebab: "",
    alternatifSolusi: "",
    hasilDiharapkan: "",
    kebutuhanData: "",
    metodePelaksanaan: "",
    dosenPA: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  const { user } = useAuthStore();
  useEffect(() => {
    console.log(user)
  }, [user])

  // Check for existing draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("ranpel_draft");
    if (savedDraft) {
      setHasDraft(true);
    }
  }, []);

  // Load draft when form opens
  useEffect(() => {
    if (isFormOpen) {
      loadDraft();
    }
  }, [isFormOpen]);

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem("ranpel_draft");
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
        toast.success("Draft berhasil dimuat", {
          description: "Data draft sebelumnya telah dimuat ke form.",
          duration: 3000,
          icon: "📋",
        });
      }
    } catch (error) {
      console.error("Error loading draft:", error);
      toast.error("Gagal memuat draft", {
        description: "Terjadi kesalahan saat memuat draft yang tersimpan.",
        duration: 4000,
      });
    }
  };

  const saveDraft = async () => {
    const hasData = Object.values(formData).some(
      (value) => value.trim() !== ""
    );

    if (!hasData) {
      toast.error("Form kosong", {
        description: "Tidak ada data untuk disimpan sebagai draft.",
        duration: 3000,
      });
      return;
    }

    setIsDraftSaving(true);

    try {
      const draftWithTimestamp = {
        ...formData,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem("ranpel_draft", JSON.stringify(draftWithTimestamp));
      setHasDraft(true);

      toast.success("Draft berhasil disimpan", {
        description: "Data form telah disimpan sebagai draft.",
        duration: 3000,
        icon: "💾",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Gagal menyimpan draft", {
        description:
          "Terjadi kesalahan saat menyimpan draft. Silakan coba lagi.",
        duration: 4000,
      });
    } finally {
      setIsDraftSaving(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem("ranpel_draft");
    setHasDraft(false);
  };

  const resetForm = () => {
    setFormData({
      judul: "",
      masalahPenyebab: "",
      alternatifSolusi: "",
      hasilDiharapkan: "",
      kebutuhanData: "",
      metodePelaksanaan: "",
      dosenPA: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "judul",
      "masalahPenyebab",
      "alternatifSolusi",
      "hasilDiharapkan",
      "kebutuhanData",
      "metodePelaksanaan",
      "dosenPA",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData].trim()
    );

    if (emptyFields.length > 0) {
      toast.error("Form belum lengkap", {
        description: "Mohon lengkapi semua field yang wajib diisi.",
        duration: 4000,
      });
      return;
    }

    const submitPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1;
        if (success) {
          resolve(formData);
        } else {
          reject(new Error("Server error"));
        }
      }, 2000);
    });

    toast.promise(submitPromise, {
      loading: "Mengirim pengajuan...",
      success: () => {
        clearDraft();
        resetForm();
        setIsFormOpen(false);
        onSubmitSuccess?.();
        return "Pengajuan berhasil disubmit!";
      },
      error: "Gagal mengirim pengajuan. Silakan coba lagi.",
    });

    try {
      await submitPromise;
      console.log("Form submitted:", formData);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleDialogClose = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      {hasDraft && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
          <FileText className="h-4 w-4" />
          Draft tersedia
        </div>
      )}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button className="rounded bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Rancangan
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-4xl max-h-[95vh] overflow-y-auto rounded-lg"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Form Pengajuan Rancangan Penelitian
            </DialogTitle>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 mt-1">
                Lengkapi formulir berikut untuk mengajukan rancangan penelitian
                Anda
              </p>
              {hasDraft && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearDraft();
                    resetForm();
                    toast.success("Draft berhasil dihapus", {
                      description:
                        "Draft yang tersimpan telah dihapus dari penyimpanan lokal.",
                      icon: "🗑️",
                    });
                  }}
                  className="text-xs"
                >
                  Hapus Draft
                </Button>
              )}
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information Section */}
            <Card className="border-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                  <User className="h-4 w-4" />
                  Informasi Mahasiswa
                </CardTitle>
                <CardDescription>
                  Data mahasiswa yang akan mengajukan penelitian
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="nama"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nama Lengkap
                    </Label>
                    <Input
                      id="nama"
                      value={mahasiswaData.nama}
                      className="bg-gray-50 border-gray-200"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="nim"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nomor Induk Mahasiswa (NIM)
                    </Label>
                    <Input
                      id="nim"
                      value={mahasiswaData.nim}
                      className="bg-gray-50 border-gray-200"
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Research Topic Section */}
            <Card className="border-green-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-green-700">
                  <BookOpen className="h-4 w-4" />
                  Topik Penelitian
                </CardTitle>
                <CardDescription>
                  Tentukan judul dan fokus penelitian Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label
                    htmlFor="judul"
                    className="text-sm font-medium text-gray-700"
                  >
                    Judul Penelitian <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="judul"
                    placeholder="Masukkan judul penelitian yang spesifik dan jelas"
                    value={formData.judul}
                    onChange={(e) => handleInputChange("judul", e.target.value)}
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500">
                    Gunakan judul yang spesifik, jelas, dan mencerminkan inti
                    penelitian
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Problem Analysis Section */}
            <Card className="border-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                  <Search className="h-4 w-4" />
                  Analisis Masalah
                </CardTitle>
                <CardDescription>
                  Identifikasi dan analisis masalah yang akan diteliti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label
                    htmlFor="masalah"
                    className="text-sm font-medium text-gray-700"
                  >
                    Masalah & Penyebab <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="masalah"
                    placeholder="Jelaskan permasalahan yang akan diselesaikan beserta penyebab-penyebabnya..."
                    value={formData.masalahPenyebab}
                    onChange={(e) =>
                      handleInputChange("masalahPenyebab", e.target.value)
                    }
                    className="min-h-[120px] border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-700 font-medium mb-1">
                      Panduan Pengisian:
                    </p>
                    <ul className="text-xs text-orange-600 space-y-1">
                      <li>
                        • Jelaskan permasalahan yang akan diselesaikan beserta
                        penyebab-penyebabnya
                      </li>
                      <li>
                        • Jika berkaitan dengan objek tertentu, sebutkan masalah
                        pada objek tersebut
                      </li>
                      <li>• Sertakan data awal sebagai pendukung argumen</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Solution Section */}
            <Card className="border-purple-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-purple-700">
                  <Settings className="h-4 w-4" />
                  Solusi & Metodologi
                </CardTitle>
                <CardDescription>
                  Pendekatan dan metode untuk menyelesaikan masalah
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="solusi"
                    className="text-sm font-medium text-gray-700"
                  >
                    Alternatif Solusi <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="solusi"
                    placeholder="Jelaskan cara-cara atau solusi yang akan digunakan untuk menyelesaikan masalah..."
                    value={formData.alternatifSolusi}
                    onChange={(e) =>
                      handleInputChange("alternatifSolusi", e.target.value)
                    }
                    className="min-h-[120px] border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-700 font-medium mb-1">
                      Panduan Pengisian:
                    </p>
                    <ul className="text-xs text-purple-600 space-y-1">
                      <li>• Harus memiliki dasar teori/keilmuan yang jelas</li>
                      <li>
                        • Sertakan referensi dari penelitian terdahulu atau buku
                      </li>
                      <li>• Jelaskan mengapa solusi ini dipilih</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label
                    htmlFor="metode"
                    className="text-sm font-medium text-gray-700"
                  >
                    Metode Pelaksanaan <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="metode"
                    placeholder="Jelaskan metode yang akan digunakan untuk melaksanakan penelitian..."
                    value={formData.metodePelaksanaan}
                    onChange={(e) =>
                      handleInputChange("metodePelaksanaan", e.target.value)
                    }
                    className="min-h-[120px] border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-700 font-medium mb-1">
                      Panduan Pengisian:
                    </p>
                    <ul className="text-xs text-purple-600 space-y-1">
                      <li>
                        • Sesuaikan dengan topik penelitian (analisis,
                        perancangan, pengujian, implementasi)
                      </li>
                      <li>
                        • Jelaskan tahapan-tahapan penelitian secara sistematis
                      </li>
                      <li>
                        • Sertakan tools atau teknologi yang akan digunakan
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expected Results Section */}
            <Card className="border-indigo-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-indigo-700">
                  <Target className="h-4 w-4" />
                  Target & Hasil
                </CardTitle>
                <CardDescription>
                  Output dan outcome yang diharapkan dari penelitian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label
                    htmlFor="hasil"
                    className="text-sm font-medium text-gray-700"
                  >
                    Hasil yang Diharapkan{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="hasil"
                    placeholder="Jelaskan target yang akan dicapai..."
                    value={formData.hasilDiharapkan}
                    onChange={(e) =>
                      handleInputChange("hasilDiharapkan", e.target.value)
                    }
                    className="min-h-[120px] border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    <p className="text-xs text-indigo-700 font-medium mb-1">
                      Panduan Pengisian:
                    </p>
                    <ul className="text-xs text-indigo-600 space-y-1">
                      <li>
                        • <strong>Hasil (Output):</strong> perangkat lunak,
                        model, prototip, dll
                      </li>
                      <li>
                        • <strong>Dampak (Outcome):</strong> pengaruh
                        implementasi terhadap objek penelitian
                      </li>
                      <li>
                        • Jelaskan kontribusi penelitian terhadap bidang ilmu
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Requirements Section */}
            <Card className="border-teal-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-teal-700">
                  <Database className="h-4 w-4" />
                  Kebutuhan Data
                </CardTitle>
                <CardDescription>
                  Data dan sumber daya yang diperlukan untuk penelitian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label
                    htmlFor="data"
                    className="text-sm font-medium text-gray-700"
                  >
                    Kebutuhan Data <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="data"
                    placeholder="Sebutkan data yang akan diolah sebagai variabel penelitian..."
                    value={formData.kebutuhanData}
                    onChange={(e) =>
                      handleInputChange("kebutuhanData", e.target.value)
                    }
                    className="min-h-[120px] border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                  <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                    <p className="text-xs text-teal-700 font-medium mb-1">
                      Panduan Pengisian:
                    </p>
                    <ul className="text-xs text-teal-600 space-y-1">
                      <li>
                        • <strong>Data awal:</strong> untuk merumuskan masalah
                      </li>
                      <li>
                        • <strong>Bahan penelitian:</strong> yang akan diolah
                        selama penelitian
                      </li>
                      <li>• Sebutkan sumber data dan cara memperolehnya</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supervisor Selection */}
            <Card className="border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  Pembimbing Akademik
                </CardTitle>
                <CardDescription>
                  Pilih dosen pembimbing akademik untuk penelitian Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label
                    htmlFor="dosen"
                    className="text-sm font-medium text-gray-700"
                  >
                    Dosen Pembimbing Akademik{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                 <Input type="text" value={user?.dosen_pa?.nama} disabled className="text-black" />
                </div>
              </CardContent>
            </Card>

            <DialogFooter className="pt-6 border-t">
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleDialogClose}
                  className="rounded-md"
                >
                  Tutup
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={saveDraft}
                    disabled={isDraftSaving}
                    className="rounded-md"
                  >
                    {isDraftSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Draft
                      </>
                    )}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Pengajuan
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
