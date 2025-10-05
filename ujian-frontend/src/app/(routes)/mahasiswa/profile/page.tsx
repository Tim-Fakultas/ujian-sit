"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  GraduationCap,
  Building,
  Phone,
  Calendar,
  BookOpen,
  Trophy,
  Mail,
  MapPin,
} from "lucide-react";

export default function ProfilePage() {
  const { user, initializeFromCookies } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeFromCookies(); // ambil user dari cookie setelah refresh
    setLoading(false);
  }, [initializeFromCookies]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memuat data...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p>Data pengguna tidak ditemukan. Silakan login terlebih dahulu.</p>
      </div>
    );
  }

  // ✅ Data dari JSON login backend kamu
  const student = {
    nim: user.nim || "-",
    nama: user.nama || "-",
    email: user.email || "-",
    noHp: (user as { no_hp?: string }).no_hp || "-",
    alamat: (user as { alamat?: string }).alamat || "-",
    semester: (user as { semester?: number }).semester || 0,
    ipk: (user as { ipk?: number }).ipk || 0,
    prodi:
      (user as { prodi?: { nama_prodi?: string } }).prodi?.nama_prodi || "-",
    fakultas: "Fakultas Sains dan Teknologi", // default karena field fakultas_id aja
    peminatan:
      (user as { peminatan?: { nama_peminatan?: string } }).peminatan
        ?.nama_peminatan || "-",
    avatar: (user as { avatar?: string }).avatar || "",
  };

  const getIPKColor = (ipk: number) => {
    if (ipk >= 3.5) return "text-green-600";
    if (ipk >= 3.0) return "text-blue-600";
    if (ipk >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getIPKBadgeVariant = (ipk: number) => {
    if (ipk >= 3.5) return "default";
    if (ipk >= 3.0) return "secondary";
    return "outline";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Profile */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-white p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-32 h-32 border-4 border-blue-200 shadow-lg">
                <AvatarImage src={student.avatar} alt={student.nama} />
                <AvatarFallback className="text-3xl font-bold bg-blue-600 text-white">
                  {student.nama
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">
                  {student.nama}
                </h1>
                <p className="text-blue-700 text-lg font-medium mb-3">
                  NIM: {student.nim}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
                    Mahasiswa Aktif
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200">
                    Semester {student.semester}
                  </Badge>
                  <Badge
                    className={`${
                      student.ipk >= 3.5
                        ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                        : student.ipk >= 3.0
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
                        : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                    }`}
                  >
                    IPK: {student.ipk.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informasi Personal */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Informasi Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{student.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">No. HP</p>
                    <p className="font-medium text-gray-900">{student.noHp}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="font-medium text-gray-900">
                      {student.alamat}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Akademik */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-green-600" />
                Informasi Akademik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Building className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Fakultas</p>
                    <p className="font-medium text-gray-900">
                      {student.fakultas}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600">Program Studi</p>
                    <p className="font-medium text-gray-900">{student.prodi}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-600">Peminatan</p>
                    <p className="font-medium text-gray-900">
                      {student.peminatan}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Akademik */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-orange-600" />
              Status Akademik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Semester</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {student.semester}
                </p>
                <p className="text-sm text-gray-600">Semester Aktif</p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <Trophy className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">IPK</h3>
                <p className={`text-2xl font-bold ${getIPKColor(student.ipk)}`}>
                  {student.ipk.toFixed(2)}
                </p>
                <Badge
                  variant={getIPKBadgeVariant(student.ipk)}
                  className="mt-1"
                >
                  {student.ipk >= 3.5
                    ? "Cumlaude"
                    : student.ipk >= 3.0
                    ? "Baik"
                    : "Cukup"}
                </Badge>
              </div>

              <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
                <User className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Status</h3>
                <p className="text-lg font-semibold text-orange-600">Aktif</p>
                <p className="text-sm text-gray-600">Mahasiswa Reguler</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
