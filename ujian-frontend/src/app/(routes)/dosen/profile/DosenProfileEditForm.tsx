"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateDosen } from "@/actions/data-master/dosen";
import { User } from "@/types/Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const schema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  no_hp: z.string().optional(),
  alamat: z.string().optional(),
  tempat_tanggal_lahir: z.string().optional(),
  pangkat: z.string().optional(),
  golongan: z.string().optional(),
  tmt_fst: z.string().optional(),
  jabatan: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function DosenProfileEditForm({ user, onSuccess }: { user: User, onSuccess: (u: User) => void }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nama: user.nama || "",
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
      onSuccess({ ...user, ...payload });
    } else {
      alert("Gagal update profile dosen.");
    }
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
        <FormField name="nama" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Nama</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="no_hp" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>No HP</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="alamat" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="tempat_tanggal_lahir" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Tempat, Tanggal Lahir</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="pangkat" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Pangkat</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="golongan" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Golongan</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="tmt_fst" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>TMT FST</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="jabatan" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Jabatan</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Perubahan"}</Button>
      </form>
    </Form>
  );
}
