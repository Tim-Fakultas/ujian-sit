import { User } from "@/types/Auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  User as UserIcon,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

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
              <AvatarFallback className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-900 text-blue-600 dark:text-blue-400">
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                  {user.nama}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {user.email || "Belum ada email"}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                <Badge variant="outline" className="gap-1.5 py-1 px-3 border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 text-gray-600 dark:text-gray-300">
                   <UserIcon size={14} className="text-blue-500" />
                   {user.nim}
                </Badge>
                <Badge variant="outline" className="gap-1.5 py-1 px-3 border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 text-gray-600 dark:text-gray-300">
                   <GraduationCap size={14} className="text-indigo-500" />
                   Mahasiswa
                </Badge>
              </div>
            </div>

             {/* Status Badge */}
            <div className="flex flex-col gap-2 items-center md:items-end">
                <Badge className={`px-4 py-1.5 text-sm font-semibold uppercase tracking-wide border-0 shadow-sm ${
                   user.status === 'Aktif' 
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                  {user.status || "Aktif"}
                </Badge>
                <p className="text-xs text-muted-foreground">
                   Semester {user.semester || 1}
                </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Academic Stats */}
        <div className="space-y-6 lg:col-span-1">
           <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden h-full">
              <CardHeader className=" border-b border-gray-100 dark:border-neutral-800 pb-3">
                 <h2 className="text-lg font-bold flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-500" />
                    Statistik Akademik
                 </h2>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center border border-blue-100 dark:border-blue-800/50">
                       <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                          {user.ipk ?? "0.00"}
                       </div>
                       <div className="text-xs font-semibold uppercase text-blue-600/70 dark:text-blue-400">IPK</div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-center border border-purple-100 dark:border-purple-800/50">
                       <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                          {user.semester ?? "-"}
                       </div>
                       <div className="text-xs font-semibold uppercase text-purple-600/70 dark:text-purple-400">Semester</div>
                    </div>
                 </div>

                 <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200 dark:border-neutral-800">
                       <span className="text-sm text-muted-foreground">Angkatan</span>
                       <span className="font-semibold">{user.angkatan ?? "-"}</span>
                    </div>

                     <div className="pt-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Peminatan</div>
                        <div className="p-2.5 rounded-lg border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800 text-sm font-medium text-center">
                           {user.peminatan?.nama_peminatan || "Belum Memilih Peminatan"}
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
                       <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
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
                       <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
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
                 <CardHeader className="pb-2 border-b border-gray-100 dark:border-neutral-800">
                     <h3 className="text-lg font-bold">Informasi Kontak</h3>
                 </CardHeader>
                 <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="flex items-start gap-3">
                          <MapPin className="text-gray-400 mt-1 shrink-0" size={18} />
                          <div>
                             <div className="text-sm font-semibold text-gray-500 mb-0.5">Alamat Domisili</div>
                             <div className="text-sm font-medium leading-relaxed">
                                {user.alamat || "Alamat belum diisi"}
                             </div>
                          </div>
                       </div>
                       <div className="flex items-start gap-3">
                          <Phone className="text-gray-400 mt-1 shrink-0" size={18} />
                          <div>
                             <div className="text-sm font-semibold text-gray-500 mb-0.5">Nomor Handphone</div>
                             <div className="text-sm font-medium">
                                {user.no_hp || "-"}
                             </div>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>

           </div>
        </div>

      </div>
    </div>
  );
}
