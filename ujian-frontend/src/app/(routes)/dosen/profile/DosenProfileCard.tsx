"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { User } from "@/types/Auth";
import DosenProfileEditForm from "./DosenProfileEditForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getStorageUrl } from "@/lib/utils";
import {
  GraduationCap,
  MapPin,
  Phone,
  User as UserIcon,
  Activity,
  CheckCircle2,
  CalendarCheck,
  Building2,
  BookOpen,
  Briefcase,
  Mail,
  Calendar,
  Award,
} from "lucide-react";

export default function DosenProfileCard({
  user: initialUser,
  bimbinganCount,
}: {
  user: User | null;
  bimbinganCount: number;
}) {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser);
  if (!user) return null;
  const stats = [
    {
      label: "Mahasiswa Bimbingan",
      value: bimbinganCount,
      icon: UserIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-end">
        <button
          className="px-4 py-1 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition"
          onClick={() => setEditMode(true)}
        >
          Edit Profil
        </button>
      </div>
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent showCloseButton className="max-h-[95vh] ">
          <DialogHeader>
            <DialogTitle>Edit Profil Dosen</DialogTitle>
          </DialogHeader>
          <DosenProfileEditForm user={user} onSuccess={(u) => { setUser(u); setEditMode(false); }} />
        </DialogContent>
      </Dialog>
      {/* 1. Header Card */}
          <div>
            <Card className="border-0 rounded-3xl bg-white dark:bg-neutral-900 shadow-xl overflow-hidden relative">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />

              <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-white dark:border-neutral-800 shadow-xl bg-emerald-50 dark:bg-neutral-800 shrink-0">
                    <AvatarImage
                      src={user.foto ? getStorageUrl(user.foto) : undefined}
                      alt={user.nama}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-neutral-800 dark:to-neutral-900 text-emerald-700 dark:text-emerald-300">
                      {user.nama
                        ?.split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center md:text-left space-y-3">
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                          {user.nama}
                        </h1>
                        <Badge
                          className={`w-fit self-center md:self-auto px-4 py-1 text-xs font-bold uppercase tracking-widest border-0 ${
                            user.status === "Aktif"
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {user.status || "Aktif"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Mail size={16} className="text-emerald-600" />
                          {user.email}
                        </span>
                        <span className="hidden md:inline text-gray-300">
                          |
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <GraduationCap
                            size={18}
                            className="text-emerald-600"
                          />
                          Dosen Tetap
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                      <Badge
                        variant="outline"
                        className="rounded-full px-4 py-1 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 font-semibold"
                      >
                        NIDN: {user.nidn || "-"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full px-4 py-1 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 font-semibold"
                      >
                        NIP: {user.nip || "-"}
                      </Badge>
                      {user.roles?.map((role) => (
                        <Badge
                          key={role.name}
                          className="rounded-full px-4 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 font-bold"
                        >
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 2. Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & supporting cards (moved here) */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-neutral-800 pb-4 p-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Activity size={20} className="text-emerald-600" />
                    Statistik Akademik
                  </h2>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}
                          >
                            <stat.icon size={20} />
                          </div>
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {stat.label}
                          </span>
                        </div>
                        <span className="font-bold text-xl">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gabungan: Informasi Pribadi (Kontak + Alamat) */}
              <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-neutral-800 flex flex-row items-center gap-3 p-6">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                    <UserIcon size={20} />
                  </div>
                  <h3 className="font-bold text-lg">Informasi Pribadi</h3>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.15em]">
                      Nomor WhatsApp
                    </label>
                    <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      {user.no_hp || "-"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.15em]">
                      Email Institusi
                    </label>
                    <div className="font-bold text-gray-800 dark:text-gray-200 break-all">
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-neutral-800">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.15em]">
                      Alamat Domisili
                    </label>
                    <div className="font-medium text-gray-800 dark:text-gray-100 leading-relaxed text-sm min-h-[40px]">
                      {user.alamat ||
                        "Alamat belum diisi lengkap dalam sistem."}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Moved: Unit Kerja Akademik */}
            </div>

            {/* Right Column: Detailed Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Informasi Kepegawaian (Professional Info) */}
              <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-neutral-800 flex flex-row items-center gap-3 p-6">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <Award size={20} />
                  </div>
                  <h3 className="font-bold text-xl">Informasi Kepegawaian</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] group-hover:text-blue-500 transition-colors">
                        Jabatan Fungsional
                      </label>
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                        {user.jabatan || "-"}
                      </div>
                    </div>
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] group-hover:text-blue-500 transition-colors">
                        TMT di FST
                      </label>
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                        {user.tmt_fst || "-"}
                      </div>
                    </div>
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] group-hover:text-blue-500 transition-colors">
                        Pangkat / Golongan
                      </label>
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                        {user.pangkat || "-"}{" "}
                        {user.golongan ? `(${user.golongan})` : ""}
                      </div>
                    </div>
                    <div className="space-y-1.5 group">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] group-hover:text-blue-500 transition-colors">
                        Tempat, Tanggal Lahir
                      </label>
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                        {user.tempat_tanggal_lahir || "-"}
                      </div>
                    </div>
                    <div className="space-y-1.5 group md:col-span-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] group-hover:text-blue-500 transition-colors">
                        Visi / Bidang Keahlian
                      </label>
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-700 text-sm font-medium text-gray-600 dark:text-gray-400 italic">
                        "Belum diatur dalam profil utama. Bidang keahlian akan
                        ditampilkan berdasarkan riwayat penelitian dan
                        pengajaran."
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-neutral-800 flex flex-row items-center gap-3 p-6">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                    <Building2 size={20} />
                  </div>
                  <h3 className="font-bold text-xl">Unit Kerja Akademik</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] flex items-center gap-1.5 focus-within:text-purple-500 transition-colors">
                        <BookOpen size={12} className="text-purple-500" />{" "}
                        Program Studi
                      </label>
                      <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 font-bold text-purple-900 dark:text-purple-300">
                        {user.prodi?.nama || "-"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] flex items-center gap-1.5">
                        <Briefcase size={12} className="text-purple-500" />{" "}
                        Fakultas
                      </label>
                      <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 font-bold text-purple-900 dark:text-purple-300">
                        {user.fakultas || "Fakultas Sains dan Teknologi"}
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
