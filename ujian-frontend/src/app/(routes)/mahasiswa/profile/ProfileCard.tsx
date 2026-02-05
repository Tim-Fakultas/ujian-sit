"use client";

import { getStorageUrl } from "@/lib/utils";
import { User } from "@/types/Auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
   Briefcase,
   GraduationCap,
   MapPin,
   Phone,
   User as UserIcon,
   ShieldCheck,
   BookOpen,
   FileText,
   Eye,
} from "lucide-react";
import { ProfileEditDialog } from "./ProfileEditDialog";

export default function ProfileCard({ user }: { user: User | null }) {
   if (!user) return null;

   return (
      <div className="w-full max-w-6xl mx-auto space-y-8">

         {/* 1. Top Banner / Header Card */}
         <div>
            <Card className="border-0 rounded-3xl bg-white dark:bg-neutral-900 shadow-lg p-6">
               <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Avatar */}
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white dark:border-neutral-800 shadow-lg bg-gray-50 dark:bg-neutral-800 shrink-0 cursor-pointer transition-transform hover:scale-105">
                     <AvatarFallback className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary/10 to-primary/5 dark:from-neutral-800 dark:to-neutral-900 text-primary dark:text-blue-400">
                        {user.nama
                           ?.split(" ")
                           .map((n) => n[0])
                           .join("")
                           .toUpperCase()
                           .slice(0, 2) || "M"}
                     </AvatarFallback>
                  </Avatar>

                  {/* Basic Info */}
                  <div className="flex-1 text-center md:text-left space-y-2">
                     <div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                              {user.nama}
                           </h1>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-2">
                           <div className="group flex items-center gap-2">
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                 {user.email || "Belum ada email"}
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                        <Badge variant="outline" className="gap-1.5 py-1 px-3 border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 text-gray-600 dark:text-gray-300">
                           <UserIcon size={14} className="text-primary" />
                           {user.nim}
                        </Badge>
                        <Badge variant="outline" className="gap-1.5 py-1 px-3 border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 text-gray-600 dark:text-gray-300">
                           <GraduationCap size={14} className="text-primary" />
                           Mahasiswa
                        </Badge>
                     </div>
                  </div>

                  {/* Status Badge & Edit Button */}
                  <div className="flex flex-col gap-3 items-center md:items-end">
                     <div className="flex flex-col items-center md:items-end gap-1">
                        <Badge className={`px-4 py-1.5 text-sm font-semibold uppercase tracking-wide border-0 shadow-sm ${user.status === 'Aktif'
                           ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                           }`}>
                           {user.status || "Aktif"}
                        </Badge>
                        <p className="text-xs text-muted-foreground hidden md:block">
                           Semester {user.semester || 1}
                        </p>
                     </div>

                     <ProfileEditDialog user={user} />
                  </div>
               </div>
            </Card>
         </div>

         {/* 2. Main Content Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Academic Stats */}
            <div className="space-y-6 lg:col-span-1">
               <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden h-full">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-neutral-800 pb-3">
                     <h2 className="text-lg font-bold flex items-center gap-2">
                        <BookOpen size={18} className="text-blue-500" />
                        Statistik Akademik
                     </h2>
                  </CardHeader>
                  <CardContent className="p-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-primary/5 dark:bg-blue-900/20 text-center border border-primary/20 dark:border-blue-800/50 flex flex-col justify-center">
                           <div className="text-2xl font-bold text-primary dark:text-blue-300 mb-1">
                              {user.ipk ?? "0.00"}
                           </div>
                           <div className="text-xs font-semibold uppercase text-primary/70 dark:text-blue-400 mt-1">IPK</div>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 dark:bg-blue-900/20 text-center border border-primary/20 dark:border-blue-800/50 flex flex-col justify-center">
                           <div className="text-2xl font-bold text-primary dark:text-blue-300 mb-1">
                              {user.semester ?? "-"}
                           </div>
                           <div className="text-xs font-semibold uppercase text-primary/70 dark:text-blue-400 mt-1">Semester</div>
                        </div>
                     </div>

                     <div className="mt-6 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 dark:border-neutral-800">
                           <span className="text-sm text-muted-foreground">Angkatan</span>
                           <span className="font-semibold">{user.angkatan ?? "-"}</span>
                        </div>

                        <div className="pt-2">
                           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Program Studi</div>
                           <div className="p-2.5 rounded-lg border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 text-sm font-medium text-center">
                              {user.prodi?.nama || "Belum Ditentukan"}
                           </div>
                        </div>

                        <div className="pt-2">
                           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Peminatan</div>
                           <div className="p-2.5 rounded-lg border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 text-sm font-medium text-center">
                              {user.peminatan?.nama || "Belum Memilih Peminatan"}
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Right Column: Detailed Info */}
            <div className="space-y-6 lg:col-span-2">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Dosen Pembimbing */}
                  <Card className="border-0 shadow-md bg-white dark:bg-neutral-900 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                     <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                           <div className="p-3 rounded-full bg-primary/10 dark:bg-blue-900/30 text-primary dark:text-blue-400">
                              <ShieldCheck size={20} />
                           </div>
                           <div>
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Pembimbing Akademik</h3>
                              <p className="text-sm text-gray-500 mb-2">Dosen Wali / PA</p>
                              <div className="font-medium text-gray-800 dark:text-gray-200">
                                 {user.dosen_pa ? (
                                    <span>{user.dosen_pa.nama}</span>
                                 ) : (
                                    <span className="text-gray-400 italic">Belum ditentukan</span>
                                 )}
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Pembimbing Skripsi */}
                  <Card className="border-0 shadow-md bg-white dark:bg-neutral-900 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                     <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                           <div className="p-3 rounded-full bg-primary/10 dark:bg-blue-900/30 text-primary dark:text-blue-400">
                              <Briefcase size={20} />
                           </div>
                           <div>
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Pembimbing Skripsi</h3>
                              <div className="space-y-2 mt-2">
                                 <div className="text-sm">
                                    <span className="text-xs text-gray-500 uppercase font-semibold mr-2">P-1</span>
                                    <span className="font-medium">{user.pembimbing1?.nama || "-"}</span>
                                 </div>
                                 <div className="text-sm">
                                    <span className="text-xs text-gray-500 uppercase font-semibold mr-2">P-2</span>
                                    <span className="font-medium">{user.pembimbing2?.nama || "-"}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card className="md:col-span-2 border-0 shadow-md bg-white dark:bg-neutral-900 rounded-2xl">
                     <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
                        <h3 className="text-lg font-bold">Informasi Kontak</h3>
                     </CardHeader>
                     <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="flex items-start gap-3">
                              <MapPin className="text-gray-400 mt-1 shrink-0" size={18} />
                              <div className="w-full">
                                 <div className="text-sm font-semibold text-gray-500 mb-0.5">Alamat Domisili</div>
                                 <div className="text-sm font-medium leading-relaxed">
                                    {user.alamat || "Alamat belum diisi"}
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-start gap-3">
                              <Phone className="text-gray-400 mt-1 shrink-0" size={18} />
                              <div className="w-full">
                                 <div className="text-sm font-semibold text-gray-500 mb-0.5">Nomor Handphone</div>
                                 <div className="text-sm font-medium">
                                    {user.no_hp || "-"}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Documents View Section */}
                  <div className="md:col-span-2 space-y-4">
                     <h3 className="text-lg font-bold">Dokumen Kelengkapan</h3>
                     <Card className="border-0 shadow-md bg-white dark:bg-neutral-900 rounded-2xl">
                        <CardContent className="p-6 space-y-4">
                           {[
                              { label: "Kartu Tanda Mahasiswa (KTM)", url: user.url_ktm },
                              { label: "Transkrip Nilai", url: user.url_transkrip_nilai },
                              { label: "Bukti Lulus Metopen", url: user.url_bukti_lulus_metopen },
                              { label: "Sertifikat BTA", url: user.url_sertifikat_bta }
                           ].map((doc, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700">
                                 <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${doc.url ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-400'}`}>
                                       <FileText size={20} />
                                    </div>
                                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{doc.label}</span>
                                 </div>
                                 {doc.url ? (
                                    <Button variant="outline" size="sm" asChild className="h-8 text-xs border-primary/20 hover:bg-primary/10 text-primary">
                                       <a href={getStorageUrl(doc.url)} target="_blank" rel="noreferrer">
                                          <Eye size={14} className="mr-1.5" />
                                          Lihat
                                       </a>
                                    </Button>
                                 ) : (
                                    <span className="text-xs text-muted-foreground italic px-3">Belum diunggah</span>
                                 )}
                              </div>
                           ))}
                        </CardContent>
                     </Card>
                  </div>

               </div>
            </div>

         </div>
      </div>
   );
}
