import { User } from "@/types/Auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Briefcase, Building2, UserCircle2 } from "lucide-react";

export default function ProfileCard({ user }: { user: User | null }) {
  if (!user) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative group">


        <Card className="border-0 rounded-3xl bg-white dark:bg-neutral-900 shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
             {/* Avatar */}
             <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white dark:border-neutral-800 shadow-lg bg-orange-50 dark:bg-neutral-800 shrink-0 cursor-pointer transition-transform hover:scale-105">
                <AvatarFallback className="text-3xl md:text-4xl font-bold bg-transparent text-gray-900 dark:text-gray-100">
                   {user.nama?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
             </Avatar>

             {/* Identity */}
             <div className="flex-1 text-center md:text-left space-y-2">
                <div>
                   <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                      {user.nama}
                   </h1>
                   <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {user.email || "Belum ada email"}
                   </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                   <Badge className="px-3 py-1 bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800 hover:bg-orange-200">
                      Sekretaris Prodi
                   </Badge>
                   <Badge variant="outline" className="border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-400">
                      Staff Akademik
                   </Badge>
                </div>
             </div>

             {/* Status Badge */}
            <div className="flex flex-col gap-2 items-center md:items-end">
                <Badge className="px-4 py-1.5 text-sm font-semibold uppercase tracking-wide border-0 shadow-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">
                  Active
                </Badge>
                <p className="text-xs text-muted-foreground">
                   {user.nip_nim || "-"}
                </p>
            </div>
          </div>
        </Card>

             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contact Info */}
                <Card className="border border-gray-100 dark:border-neutral-800 shadow-sm bg-gray-50/50 dark:bg-neutral-800/20">
                   <CardHeader className="pb-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                         <UserCircle2 size={16} /> Informasi Kontak
                      </h3>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
                         <div className="p-2 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <Mail size={18} />
                         </div>
                         <div className="overflow-hidden">
                            <div className="text-xs text-gray-500 font-medium">Email Address</div>
                            <div className="text-sm font-semibold truncate hover:text-primary transition-colors cursor-pointer" title={user.email}>
                               {user.email}
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
                         <div className="p-2 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <Briefcase size={18} />
                         </div>
                         <div>
                            <div className="text-xs text-gray-500 font-medium">Jabatan</div>
                            <div className="text-sm font-semibold">Sekretaris Program Studi</div>
                         </div>
                      </div>
                   </CardContent>
                </Card>

                {/* Academic Unit */}
                 <Card className="border border-gray-100 dark:border-neutral-800 shadow-sm bg-gray-50/50 dark:bg-neutral-800/20">
                   <CardHeader className="pb-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                         <Building2 size={16} /> Unit Kerja
                      </h3>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 text-center">
                         <div className="text-xs text-gray-400 mb-1 font-semibold uppercase">Program Studi</div>
                         <div className="text-lg font-bold text-gray-800 dark:text-white">
                            {user.prodi?.nama_prodi || "Teknik Informatika"}
                         </div>
                      </div>
                      <div className="flex justify-between items-center text-sm px-2">
                         <span className="text-gray-500">Status</span>
                         <span className="font-medium text-emerald-600 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                         </span>
                      </div>
                   </CardContent>
                </Card>

             </div>

      </div>
    </div>
  );
}
