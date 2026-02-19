"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/Auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateMahasiswaProfileAction } from "@/actions/mahasiswa";
import { refreshUserAction } from "@/actions/auth";
import { showToast } from "@/components/ui/custom-toast";
import { Loader2, Save, UserCog, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import FileUploadCard from "./FileUploadCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllPeminatan } from "@/actions/data-master/peminatan";

interface Peminatan {
  id: number;
  nama_peminatan: string;
}

interface ProfileEditDialogProps {
  user: User;
}

export function ProfileEditDialog({ user }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [peminatanList, setPeminatanList] = useState<Peminatan[]>([]);

  useEffect(() => {
    const fetchPeminatan = async () => {
      if (user.prodi?.id) {
        const data = await getAllPeminatan(user.prodi.id);
        if (Array.isArray(data)) {
          setPeminatanList(data);
        }
      }
    };
    fetchPeminatan();
  }, [user.prodi?.id]);

  const [formData, setFormData] = useState({
    email: user.email || "",
    alamat: user.alamat || "",
    no_hp: user.no_hp || "",
    ipk: user.ipk?.toString() || "0",
    semester: user.semester?.toString() || "1",
    peminatan_id: user.peminatan?.id?.toString() || "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        email: user.email || "",
        alamat: user.alamat || "",
        no_hp: user.no_hp || "",
        ipk: user.ipk?.toString() || "0",
        semester: user.semester?.toString() || "1",
        peminatan_id: user.peminatan?.id?.toString() || "",
      });
    }
  }, [user, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePeminatanChange = (value: string) => {
    setFormData((prev) => ({ ...prev, peminatan_id: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await updateMahasiswaProfileAction({
        email: formData.email,
        alamat: formData.alamat,
        no_hp: formData.no_hp,
        ipk: parseFloat(formData.ipk) || 0,
        semester: parseInt(formData.semester) || 1,
        peminatan_id: formData.peminatan_id
          ? parseInt(formData.peminatan_id)
          : undefined,
        // Pass supplementary data
        nim: user.nim,
        nama: user.nama,
        prodi_id: user.prodi?.id,
      });

      if (res.success) {
        await refreshUserAction();
        showToast.success("Profil berhasil diperbarui");
        setOpen(false);
        router.refresh();
      } else {
        showToast.error(res.error || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error(error);
      showToast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    // When dialog closes, refresh user data to reflect any uploaded files
    if (!isOpen) {
      await refreshUserAction();
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-blue-200 dark:shadow-none px-6 py-5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
          <UserCog size={18} className="mr-2" />
          <span className="font-bold">Edit Profil</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[90%] sm:max-w-[50%] rounded-xl max-h-[90vh] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 ">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle>Edit Profil</DialogTitle>
              <DialogDescription className="mt-1">
                Perbarui informasi profil dan data akademik Anda di sini.
              </DialogDescription>
            </div>
            <DialogClose className="ring-offset-background focus:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none ml-4">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 px-6 py-4"
            id="profile-edit-form"
          >
            {/* Informasi Data Diri */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium leading-none border-b pb-2 text-muted-foreground">
                Informasi Pribadi
              </h4>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@contoh.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="no_hp">Nomor Handphone</Label>
                  <Input
                    id="no_hp"
                    name="no_hp"
                    type="tel"
                    value={formData.no_hp}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="alamat">Alamat Domisili</Label>
                  <Textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Alamat lengkap..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* Informasi Statistik (Optional: If we really want to put it here) */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium leading-none border-b pb-2 text-muted-foreground">
                Data Akademik
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Peminatan Input */}
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="peminatan">Peminatan</Label>
                  <Select
                    value={formData.peminatan_id}
                    onValueChange={handlePeminatanChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Peminatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {peminatanList.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nama_peminatan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ipk">IPK</Label>
                  <Input
                    id="ipk"
                    name="ipk"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.00"
                    value={formData.ipk}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    name="semester"
                    type="number"
                    min="1"
                    max="14"
                    value={formData.semester}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {/* Dokumen Kelengkapan */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium leading-none border-b pb-2 text-muted-foreground">
                Dokumen Kelengkapan
              </h4>
              <div className="space-y-4">
                <FileUploadCard
                  title="Kartu Tanda Mahasiswa (KTM)"
                  fileKey="file_ktm"
                  currentUrl={user.url_ktm}
                />

                <FileUploadCard
                  title="Transkrip Nilai"
                  description="Transkrip nilai terbaru yang sudah divalidasi"
                  fileKey="file_transkrip_nilai"
                  currentUrl={user.url_transkrip_nilai}
                />

                <FileUploadCard
                  title="Bukti Lulus Metopen"
                  description="Bukti lulus mata kuliah Metodologi Penelitian"
                  fileKey="file_bukti_lulus_metopen"
                  currentUrl={user.url_bukti_lulus_metopen}
                />

                <FileUploadCard
                  title="Sertifikat BTA"
                  description="Sertifikat Baca Tulis Al-Qur'an"
                  fileKey="file_sertifikat_bta"
                  currentUrl={user.url_sertifikat_bta}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-1 z-10 bg-background border-t px-6 py-4">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              form="profile-edit-form"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
