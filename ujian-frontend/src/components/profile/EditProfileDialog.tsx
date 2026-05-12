"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/stores/useAuthStore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types/Auth";
import { updateUserProfileAction } from "@/actions/user";
import { toast } from "sonner";
import { Edit } from "lucide-react";

const profileSchema = z.object({
  email: z.string().email("Email tidak valid"),
  no_hp: z.string().min(10, "Nomor HP minimal 10 karakter").optional().nullable(),
  alamat: z.string().optional().nullable(),
  // Student specific
  semester: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  ipk: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  // Dosen/Staff specific
  tempat_tanggal_lahir: z.string().optional().nullable(),
  pangkat: z.string().optional().nullable(),
  golongan: z.string().optional().nullable(),
  jabatan: z.string().optional().nullable(),
  tmt_fst: z.string().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfileDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);


  const isStudent = user.role?.toLowerCase() === "mahasiswa";

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user.email || "",
      no_hp: user.no_hp || "",
      alamat: user.alamat || "",
      semester: user.semester || undefined,
      ipk: user.ipk || undefined,
      tempat_tanggal_lahir: user.tempat_tanggal_lahir || "",
      pangkat: user.pangkat || "",
      golongan: user.golongan || "",
      jabatan: user.jabatan || "",
      tmt_fst: user.tmt_fst || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true);
    try {
      const result = await updateUserProfileAction(data);
      if (result.success) {
        toast.success(result.message);
        
        // Update client-side store
        // We fetch the latest user data via the refresh action which is already integrated in the store
        await useAuthStore.getState().refreshUser();
        
        // Force router refresh to update server components
        router.refresh();
        
        setOpen(false);
      } else {

        toast.error(result.message);
        if (result.errors) {
          // Handle field errors if any
          console.error("Validation errors:", result.errors);
        }
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui profil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Edit size={16} />
          Edit Profil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
          <DialogDescription>
            Perbarui informasi profil Anda di sini. Klik simpan setelah selesai.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="no_hp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor HP</FormLabel>
                    <FormControl>
                      <Input placeholder="0812..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Alamat lengkap..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isStudent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ipk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IPK</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="tempat_tanggal_lahir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempat, Tanggal Lahir</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Jakarta, 01-01-1980" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pangkat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pangkat</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="golongan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Golongan</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jabatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jabatan</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tmt_fst"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TMT FST</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
