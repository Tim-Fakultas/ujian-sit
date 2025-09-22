"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, FileText, RotateCcw, X, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Simple toast implementation
const useToast = () => ({
  toast: ({
    title,
    description,
    variant,
  }: {
    title: string;
    description: string;
    variant?: string;
  }) => {
    const message =
      variant === "destructive"
        ? `Error: ${title} - ${description}`
        : `${title} - ${description}`;
    alert(message);
  },
});

const formSchema = z.object({
  judul: z
    .string()
    .min(10, "Judul minimal 10 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  identifikasi: z.string().min(50, "Identifikasi minimal 50 karakter"),
  rumusanMasalah: z.string().min(30, "Rumusan masalah minimal 30 karakter"),
  pokokMasalah: z.string().min(30, "Pokok masalah minimal 30 karakter"),
  penelitianSebelumnya: z
    .string()
    .min(50, "Penelitian sebelumnya minimal 50 karakter"),
  deskripsiLengkap: z
    .string()
    .min(100, "Deskripsi lengkap minimal 100 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

export default function FormPengajuan() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: "",
      identifikasi: "",
      rumusanMasalah: "",
      pokokMasalah: "",
      penelitianSebelumnya: "",
      deskripsiLengkap: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(values);
      toast({
        title: "Berhasil!",
        description: "Pengajuan judul skripsi telah dikirim untuk review.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error!",
        description: "Terjadi kesalahan saat mengirim pengajuan.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    toast({
      title: "Form direset",
      description: "Semua data form telah dikosongkan.",
    });
  };
  

  const handleCancel = () => {
    // Navigate back or close modal
    window.history.back();
  };

  return (
    <div className="min-h-screen ">
      <div className="w-full ">
        <Card className="border-0 py-6">
          <CardHeader className="space-y-6 pb-4">
            <div className="flex items-start gap-4">
              <div className="space-y-3">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Form Pengajuan Judul Penelitian
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Lengkapi semua informasi yang diperlukan untuk pengajuan judul
                  skripsi Anda. Pastikan semua field diisi dengan lengkap dan
                  akurat untuk mempercepat proses review.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="judul"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-semibold">
                        Judul <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan judul skripsi yang diusulkan"
                          {...field}
                          className="h-12 text-base"
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground italic mt-1">
                        Judul harus jelas, spesifik, dan mencerminkan isi
                        penelitian (10-200 karakter)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="identifikasi"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-semibold">
                        Identifikasi Masalah{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan identifikasi masalah yang akan diteliti"
                          {...field}
                          className="min-h-[120px] text-base resize-none"
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground italic mt-1">
                        Uraikan latar belakang dan konteks masalah yang akan
                        diteliti (minimal 50 karakter)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rumusanMasalah"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-semibold">
                        Rumusan Masalah{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Rumuskan masalah dalam bentuk pertanyaan penelitian"
                          {...field}
                          className="min-h-[120px] text-base resize-none"
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground italic mt-1">
                        Minimal 30 karakter
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pokokMasalah"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-semibold">
                        Pokok Masalah{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan pokok masalah yang akan menjadi fokus penelitian"
                          {...field}
                          className="min-h-[120px] text-base resize-none"
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground italic mt-1">
                        Fokuskan pada aspek utama yang akan diteliti secara
                        mendalam (minimal 30 karakter)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="penelitianSebelumnya"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-semibold">
                        Penelitian Sebelumnya{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Uraikan penelitian-penelitian terkait yang sudah pernah dilakukan"
                          {...field}
                          className="min-h-[140px] text-base resize-none"
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground italic mt-1">
                        Sertakan referensi penelitian yang relevan dan jelaskan
                        gap yang akan diisi (minimal 50 karakter)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deskripsiLengkap"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-semibold">
                        Deskripsi Lengkap{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Berikan deskripsi lengkap tentang penelitian yang akan dilakukan"
                          {...field}
                          className="min-h-[160px] text-base resize-none"
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground italic mt-1">
                        Jelaskan metodologi, target hasil, dan kontribusi yang
                        diharapkan (minimal 100 karakter)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 pt-8 border-t sm:flex-row sm:justify-between ">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-8 text-base font-semibold bg-[#1B82EC] hover:bg-[#1669C1] "
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Submit Pengajuan"
                    )}
                  </Button>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="h-12 px-6 text-base font-medium"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset Form
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="h-12 px-6 text-base font-medium"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Batal
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
