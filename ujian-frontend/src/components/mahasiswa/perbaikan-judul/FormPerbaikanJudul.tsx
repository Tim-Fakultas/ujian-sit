"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showToast } from "@/components/ui/custom-toast";
import { Loader2, UploadCloud, FileType, CheckCircle2, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { perbaikanJudul } from "@/actions/perbaikanJudul";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";

import RiwayatPerubahan from "./RiwayatPerubahan";


// Schema validasi
const formSchema = z.object({
  judulBaru: z.string().min(10, {
    message: "Judul baru harus memiliki minimal 10 karakter.",
  }),
  // File validasi (mock) - we can't easily validate FileList with z.object in a simple way for client-side without custom transform, 
  // but let's try to keep it simple or just check in onSubmit
});

interface FormPerbaikanJudulProps {
  mahasiswaId: number;
  ranpelId: number;
  judulLama: string;
  updatedAt?: string | null;
}

export default function FormPerbaikanJudul({
  mahasiswaId,
  ranpelId,
  judulLama,
  updatedAt,
}: FormPerbaikanJudulProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judulBaru: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      showToast.error("Mohon unggah surat perbaikan judul terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("ranpelId", ranpelId.toString());
      formData.append("mahasiswaId", mahasiswaId.toString());
      formData.append("judulBaru", values.judulBaru);
      formData.append("berkas", file);

      await perbaikanJudul(formData);

      showToast.success("Judul berhasil diperbarui dan surat perbaikan telah dikirim.");
      form.reset();
      setFile(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      showToast.error("Gagal melakukan perbaikan judul. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 items-stretch">
      {/* Kolom Kiri: Judul Lama */}
      <div className="flex flex-col gap-6 h-full">
        <Card className="shadow-sm shrink-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-blue-500" />
              Judul Saat Ini
            </CardTitle>
            <CardDescription>
              Judul penelitian yang saat ini terdaftar di sistem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg border border-dashed text-sm leading-relaxed font-medium text-muted-foreground">
              {judulLama}
            </div>
            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md">
              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
              <p>Pastikan judul baru yang Anda ajukan sudah disetujui oleh Dosen Pembimbing melalui proses konsultasi.</p>
            </div>
          </CardContent>
        </Card>

        {/* Riwayat Perubahan */}
        <div className="flex-1 min-h-0">
          <RiwayatPerubahan currentJudul={judulLama} updatedAt={updatedAt} mahasiswaId={mahasiswaId} className="h-full" />
        </div>
      </div>

      {/* Kolom Kanan: Form Perbaikan */}
      <div className="h-full">
        <Card className="shadow-md h-full">
          <CardHeader>
            <CardTitle className="text-xl">Form Perbaikan Judul</CardTitle>
            <CardDescription>
              Lengkapi form di bawah untuk mengajukan perubahan judul skripsi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Input Judul Baru */}
                <FormField
                  control={form.control}
                  name="judulBaru"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Judul Baru</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Masukkan judul penelitian yang baru..."
                          className="min-h-[100px] resize-y text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Gunakan tata bahasa yang baik dan benar sesuai PUEBI.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Upload File */}
                <div className="space-y-2">
                  <FormLabel className="text-base font-semibold">Surat Perbaikan Judul</FormLabel>
                  <div className={`
                    border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer
                    ${file ? "border-emerald-500 bg-emerald-50/30" : "border-gray-300 dark:border-gray-700"}
                  `}>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                          if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit
                            showToast.error("Ukuran file maksimal 2MB");
                            return;
                          }
                          if (selectedFile.type !== "application/pdf") {
                            showToast.error("File harus berformat PDF");
                            return;
                          }
                          setFile(selectedFile);
                        }
                      }}
                    />
                    <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                      {file ? (
                        <>
                          <FileType className="h-10 w-10 text-emerald-500 mb-2" />
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400 break-all px-2">
                            {file.name}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 h-8"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setFile(null);
                            }}
                          >
                            Hapus
                          </Button>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Klik untuk upload file
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            Format PDF, Maksimal 2MB
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                  {!file && (
                    <p className="text-[0.8rem] text-muted-foreground">
                      Lampirkan surat persetujuan perubahan judul yang telah ditandatangani.
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Simpan Perubahan Judul"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
