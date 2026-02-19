"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateDosen } from "@/actions/data-master/dosen";
import { User } from "@/types/Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
const schema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  no_hp: z.string().optional(),
  alamat: z.string().optional(),
  tempat_tanggal_lahir: z.string().optional(),
  pangkat: z.string().optional(),
  golongan: z.string().optional(),
  tmt_fst: z.string().optional(),
  jabatan: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function DosenProfileEditForm({
  user,
  onSuccess,
}: {
  user: User;
  onSuccess: (u: User) => void;
}) {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nama: user.nama || "",
      email: user.email || "",
      no_hp: user.no_hp || "",
      alamat: user.alamat || "",
      tempat_tanggal_lahir: user.tempat_tanggal_lahir || "",
      pangkat: user.pangkat || "",
      golongan: user.golongan || "",
      tmt_fst: user.tmt_fst || "",
      jabatan: user.jabatan || "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    // Map ke snake_case agar sesuai backend
    const payload = {
      nama: values.nama,
      email: values.email,
      no_hp: values.no_hp,
      alamat: values.alamat,
      tempat_tanggal_lahir: values.tempat_tanggal_lahir,
      pangkat: values.pangkat,
      golongan: values.golongan,
      tmt_fst: values.tmt_fst,
      jabatan: values.jabatan,
    };
    const result = await updateDosen(user.id, payload);
    setLoading(false);
    if (result) {
      // Sync cookie & store
      try {
        const { refreshUserAction } = await import("@/actions/auth");
        await refreshUserAction();

        const { useAuthStore } = await import("@/stores/useAuthStore");
        await useAuthStore.getState().refreshUser();
      } catch (e) {
        console.error("Failed to sync after profile update:", e);
      }

      onSuccess({ ...user, ...payload });
    } else {
      alert("Gagal update profile dosen.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full overflow-hidden"
      >
        {/* Konten Form - Bisa Scroll */}
        <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4">
          <FormField
            name="nama"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Institusi</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="no_hp"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WhatsApp</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="tempat_tanggal_lahir"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat, Tanggal Lahir</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="pangkat"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pangkat</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="golongan"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Golongan</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="tmt_fst"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TMT FST</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="jabatan"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan Fungsional</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="alamat"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Domisili</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Footer - Sticky/Fixed di Bawah */}
        <div className="shrink-0 bg-white dark:bg-neutral-900 border-t px-6 py-4 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto px-10 shadow-lg"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
