"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { getDosen } from "@/actions/data-master/dosen";
import { AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Phone, 
  GraduationCap, 
  Edit, 
  Save, 
  X, 
  MapPin, 
  Building2, 
  BookOpen, 
  Activity,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";

interface DosenProfile {
  id: number;
  nidn?: string;
  nama: string;
  noHp: string;
  alamat: string;
  prodi: {
    id: number;
    nama: string;
  };
  fakultas?: string;
  foto?: string | null;
}

export default function DosenProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<DosenProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<DosenProfile>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          // Fetch real data from Dosen table
          // Note: passing undefined to getDosen might return all, or we pass user.prodi?.id if available
          const dosens = await getDosen(user.prodi?.id);
          
          // Find the Dosen record associated with this user
          // Assuming user.id corresponds to Dosen.userId
          const myDosen = dosens.find((d) => d.userId === user.id);

          if (myDosen) {
             const profileData: DosenProfile = {
              id: myDosen.id,
              nidn: myDosen.nidn,
              nama: myDosen.nama,
              noHp: myDosen.noHp || "",
              alamat: myDosen.alamat || "",
              prodi: {
                id: myDosen.prodi.id,
                nama: myDosen.prodi.nama,
              },
              fakultas: "Fakultas Sains dan Teknologi", // Placeholder/Static for now
              foto: myDosen.foto,
            };
            setProfile(profileData);
            setEditData(profileData);
          } else {
             // Fallback if not found in Dosen table (e.g. data sync issue)
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const anyUser = user as any;
            const mockProfile: DosenProfile = {
              id: user.id,
              nidn: user.nidn || "1234567890",
              nama: user.nama,
              noHp: anyUser.no_hp || "081234567890",
              alamat: anyUser.alamat || "Jl. Contoh Alamat No. 123, Kota Malang",
              prodi: {
                id: 1,
                nama: user.prodi?.nama || "Teknik Informatika",
              },
              fakultas: "Fakultas Sains dan Teknologi",
              foto: null,
            };
            setProfile(mockProfile);
            setEditData(mockProfile);
          }

        } catch (error) {
           console.error("Error fetching dosen profile:", error);
        } finally {
           setLoading(false);
        }
      } else {
         setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profile || {});
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfile({ ...profile, ...editData } as DosenProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof DosenProfile, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
           <div className="text-muted-foreground text-sm">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full p-6 flex justify-center">
         <Card className="max-w-md w-full border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="flex flex-col items-center p-6 text-center">
               <X className="h-10 w-10 text-red-500 mb-2" />
               <div className="text-red-700 font-semibold">Gagal memuat profil</div>
               <div className="text-red-600/80 text-sm">Silakan coba muat ulang halaman.</div>
            </CardContent>
         </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header Area with Decorative Background */}
      <div className="relative group">
        <Card className="relative border-0 rounded-xl bg-white dark:bg-neutral-900 shadow-md p-6">
             
             {/* Edit Button Positioned Absolute Top-Right */}
             <div className="absolute top-4 right-4 z-10">
                {!isEditing ? (
                  <Button 
                     onClick={handleEdit} 
                     variant="outline"
                     className="rounded-full shadow-sm transition-transform hover:scale-105 active:scale-95"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleCancel}
                      disabled={saving}
                      className="rounded-full shadow-lg"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Batal
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
                      size="sm"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Simpan
                    </Button>
                  </div>
                )}
             </div>

          <div className="flex flex-col md:flex-row gap-6 items-center pt-8 md:pt-0">
             <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white dark:border-neutral-800 shadow-lg bg-emerald-50 dark:bg-neutral-800 shrink-0">
               <AvatarImage
                  src={profile.foto || undefined}
                  alt={profile.nama}
                  className="object-cover"
               />
               <AvatarFallback className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-neutral-800 dark:to-neutral-900 text-emerald-700 dark:text-emerald-300">
                  {profile.nama?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}
               </AvatarFallback>
             </Avatar>
             
             <div className="flex-1 text-center md:text-left space-y-2">
                <div>
                   <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                      {profile.nama}
                   </h1>
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800">
                         <span className="font-semibold text-gray-700 dark:text-gray-300">NIDN:</span> {profile.nidn}
                      </span>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                         <GraduationCap size={16} />
                         Dosen Tetap
                      </span>
                   </div>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  {user?.roles?.map((role) => (
                    <Badge
                      key={role.name}
                      variant="secondary"
                      className="rounded-full px-3 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                    >
                      {role.name}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="rounded-full border-dashed">
                     Aktif
                  </Badge>
                </div>
             </div>
          </div>
        </Card>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Stats & Quick Info */}
         <div className="space-y-6 lg:col-span-1">
            <Card className="border-0 shadow-md bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
               <CardHeader className="  border-b border-gray-100 dark:border-neutral-800 pb-4">
                  <h3 className="font-bold flex items-center gap-2 text-lg">
                     <Activity className="text-emerald-600" size={20} />
                     Statistik Akademik
                  </h3>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                     <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                              <User size={18} />
                           </div>
                           <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Mahasiswa Bimbingan</span>
                        </div>
                        <span className="font-bold text-lg">12</span>
                     </div>
                     <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                              <CheckCircle2 size={18} />
                           </div>
                           <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Proposal Disetujui</span>
                        </div>
                        <span className="font-bold text-lg">8</span>
                     </div>
                     <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                              <CalendarCheck size={18} />
                           </div>
                           <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ujian Sidang (Hari Ini)</span>
                        </div>
                        <span className="font-bold text-lg">1</span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
               <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">Status Mengajar</h3>
               <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 mb-4">
                  Anda saat ini tercatat aktif sebagai dosen tetap pada semester Ganjil 2024/2025.
               </p>
               <Button size="sm" variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/50">
                  Lihat Jadwal Mengajar
               </Button>
            </Card>
         </div>

         {/* Right Column: Detailed Forms */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Informasi Dasar */}
            <Card className="border-0 shadow-md bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
               <CardHeader className="pb-4 border-b border-gray-100 dark:border-neutral-800">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                     <User className="text-gray-400" size={20} />
                     Informasi Pribadi
                  </h3>
               </CardHeader>
               <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">NIDN</label>
                     <Input 
                        value={isEditing ? editData.nidn || "" : profile.nidn}
                        onChange={(e) => handleInputChange("nidn", e.target.value)}
                        readOnly={!isEditing}
                        className={`bg-gray-50/50 dark:bg-neutral-800/50 border-gray-200 dark:border-neutral-700 ${!isEditing ? 'border-transparent px-0 shadow-none bg-transparent dark:bg-transparent font-medium text-base h-auto' : ''}`}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Nama Lengkap</label>
                     <Input 
                        value={isEditing ? editData.nama || "" : profile.nama}
                        onChange={(e) => handleInputChange("nama", e.target.value)}
                        readOnly={!isEditing}
                        className={`bg-gray-50/50 dark:bg-neutral-800/50 border-gray-200 dark:border-neutral-700 ${!isEditing ? 'border-transparent px-0 shadow-none bg-transparent dark:bg-transparent font-medium text-base h-auto' : ''}`}
                     />
                  </div>
               </CardContent>
            </Card>

            {/* Informasi Kontak */}
            <Card className="border-0 shadow-md bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
               <CardHeader className="pb-4 border-b border-gray-100 dark:border-neutral-800">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                     <Phone className="text-gray-400" size={20} />
                     Kontak & Alamat
                  </h3>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                           <Phone size={12} /> Nomor Handphone
                        </label>
                        <Input 
                           value={isEditing ? editData.noHp || "" : profile.noHp}
                           onChange={(e) => handleInputChange("noHp", e.target.value)}
                           readOnly={!isEditing}
                           placeholder="Belum diisi"
                           className={`bg-gray-50/50 dark:bg-neutral-800/50 border-gray-200 dark:border-neutral-700 ${!isEditing ? 'border-transparent px-0 shadow-none bg-transparent dark:bg-transparent font-medium text-base h-auto' : ''}`}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                        <MapPin size={12} /> Alamat Lengkap
                     </label>
                      {isEditing ? (
                         <Textarea 
                           value={editData.alamat || ""}
                           onChange={(e) => handleInputChange("alamat", e.target.value)}
                           className="bg-gray-50/50 dark:bg-neutral-800/50 border-gray-200 dark:border-neutral-700 min-h-[80px]"
                         />
                      ) : (
                         <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                            {profile.alamat || "-"}
                         </p>
                      )}
                  </div>
               </CardContent>
            </Card>

            {/* Informasi Akademik */}
            <Card className="border-0 shadow-md bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
               <CardHeader className="pb-4 border-b border-gray-100 dark:border-neutral-800">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                     <BookOpen className="text-gray-400" size={20} />
                     Unit Kerja Akademik
                  </h3>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                           <GraduationCap size={12} /> Program Studi
                        </label>
                        <div className="text-base font-medium text-gray-900 dark:text-gray-100 p-2 rounded-lg bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800">
                           {profile.prodi.nama}
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                           <Building2 size={12} /> Fakultas
                        </label>
                        <div className="text-base font-medium text-gray-900 dark:text-gray-100 p-2 rounded-lg bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800">
                           {profile.fakultas || "-"}
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

         </div>
      </div>
    </div>
  );
}
