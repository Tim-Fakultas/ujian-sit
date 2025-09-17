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
  masalah: z.string().min(30, "Masalah minimal 30 karakter"),
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
      masalah: "",
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
    <div className="min-h-screen bg-background">
      <div className="w-full mx-auto">
        <Card className="border-border">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Form Pengajuan Judul Skripsi
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Lengkapi semua informasi yang diperlukan untuk pengajuan judul
                  skripsi Anda. Pastikan semua field diisi dengan lengkap dan
                  akurat.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="judul"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">
                        Judul Skripsi *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan judul skripsi yang diusulkan"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Judul harus jelas, spesifik, dan mencerminkan isi
                        penelitian (10-200 karakter)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="identifikasi"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">
                        Identifikasi Masalah *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan identifikasi masalah yang akan diteliti"
                          {...field}
                          className="min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Uraikan latar belakang dan konteks masalah yang akan
                        diteliti (minimal 50 karakter)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="masalah"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-medium">
                          Masalah *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Uraikan masalah utama"
                            {...field}
                            className="min-h-[100px] resize-none"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Minimal 30 karakter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rumusanMasalah"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-medium">
                          Rumusan Masalah *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Rumuskan masalah dalam bentuk pertanyaan penelitian"
                            {...field}
                            className="min-h-[100px] resize-none"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Minimal 30 karakter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pokokMasalah"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">
                        Pokok Masalah *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan pokok masalah yang akan menjadi fokus penelitian"
                          {...field}
                          className="min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Fokuskan pada aspek utama yang akan diteliti secara
                        mendalam (minimal 30 karakter)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="penelitianSebelumnya"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">
                        Penelitian Sebelumnya *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Uraikan penelitian-penelitian terkait yang sudah pernah dilakukan"
                          {...field}
                          className="min-h-[120px] resize-none"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Sertakan referensi penelitian yang relevan dan jelaskan
                        gap yang akan diisi (minimal 50 karakter)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deskripsiLengkap"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">
                        Deskripsi Lengkap *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Berikan deskripsi lengkap tentang penelitian yang akan dilakukan"
                          {...field}
                          className="min-h-[140px] resize-none"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Jelaskan metodologi, target hasil, dan kontribusi yang
                        diharapkan (minimal 100 karakter)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3 pt-6 border-t sm:flex-row">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="order-1 sm:order-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Submit Pengajuan"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="order-2 sm:order-2"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Form
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="order-3 sm:order-3"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Batal
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
