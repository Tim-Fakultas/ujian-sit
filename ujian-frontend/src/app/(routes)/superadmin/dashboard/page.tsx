import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  FileText,
  Calendar,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export default function Page() {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: "Total Dosen",
      value: "156",
      icon: Users,
      description: "Dosen aktif di seluruh fakultas",
      color: "text-blue-600",
    },
    {
      title: "Total Mahasiswa",
      value: "2,847",
      icon: GraduationCap,
      description: "Mahasiswa aktif semua prodi",
      color: "text-green-600",
    },
    {
      title: "Program Studi",
      value: "24",
      icon: Building2,
      description: "Program studi yang tersedia",
      color: "text-purple-600",
    },
    {
      title: "Peminatan",
      value: "68",
      icon: BookOpen,
      description: "Total peminatan/konsentrasi",
      color: "text-orange-600",
    },
    {
      title: "Skripsi Aktif",
      value: "432",
      icon: FileText,
      description: "Skripsi yang sedang berjalan",
      color: "text-indigo-600",
    },
    {
      title: "Skripsi Selesai",
      value: "1,235",
      icon: UserCheck,
      description: "Skripsi yang telah selesai",
      color: "text-emerald-600",
    },
    {
      title: "Ujian Bulan Ini",
      value: "89",
      icon: Calendar,
      description: "Jadwal ujian bulan ini",
      color: "text-red-600",
    },
    {
      title: "Tingkat Kelulusan",
      value: "94.2%",
      icon: TrendingUp,
      description: "Persentase kelulusan tahun ini",
      color: "text-teal-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Superadmin
        </h1>
        <div className="text-sm text-gray-500">
          Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-6 w-6 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Dosen baru terdaftar</p>
                <p className="text-xs text-gray-500">
                  Dr. Ahmad Susanto - Teknik Informatika
                </p>
              </div>
              <span className="text-xs text-gray-400">2 jam lalu</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ujian skripsi selesai</p>
                <p className="text-xs text-gray-500">
                  5 mahasiswa lulus ujian hari ini
                </p>
              </div>
              <span className="text-xs text-gray-400">4 jam lalu</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Program studi baru</p>
                <p className="text-xs text-gray-500">
                  Teknik Biomedis telah disetujui
                </p>
              </div>
              <span className="text-xs text-gray-400">1 hari lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Ringkasan Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mahasiswa baru</span>
              <span className="text-sm font-semibold text-green-600">+127</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Skripsi selesai</span>
              <span className="text-sm font-semibold text-blue-600">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Dosen aktif</span>
              <span className="text-sm font-semibold text-purple-600">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rata-rata IPK</span>
              <span className="text-sm font-semibold text-orange-600">
                3.42
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
