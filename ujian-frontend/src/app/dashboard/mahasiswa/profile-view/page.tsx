"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMahasiswaStore } from "@/stores/useMahasiswaStore";
import {
  User,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Calendar,
} from "lucide-react";

export default function ProfileViewPage() {
  const mahasiswa = useMahasiswaStore((state) => state.mahasiswa);
  const setMahasiswa = useMahasiswaStore((state) => state.setMahasiswa);
  const [loading, setLoading] = useState(true);

  const formFields = [
    { key: "nama", label: "Nama Lengkap", icon: User },
    { key: "nim", label: "NIM", icon: null },
    { key: "noHp", label: "Nomor Telepon", icon: Phone },
    { key: "alamat", label: "Alamat", icon: MapPin },
    { key: "fakultas", label: "Fakultas", icon: GraduationCap },
    { key: "prodi", label: "Program Studi", icon: BookOpen },
    {
      key: "semester",
      label: "Semester",
      icon: Calendar,
      format: (value: number) => `Semester ${value}`,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setMahasiswa({
        id: 1,
        nama: "Muhammad Abdi",
        nim: "23051450225",
        noHp: "081234567890",
        alamat: "Jln Angkatan 45 No. 123, Palembang",
        fakultas: "Sains dan Teknologi",
        prodi: "Sistem Informasi",
        semester: 6,
      });
      setLoading(false);
    }, 1500);
  }, [setMahasiswa]);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 ">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">Profil Mahasiswa</h1>
          <p className="text-sm text-gray-600">
            Informasi lengkap data mahasiswa
          </p>
        </div>

        {/* Skeleton saat loading */}
        {loading ? (
          <Card className="border">
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        ) : (
          mahasiswa && (
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  Data Mahasiswa
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {formFields.map((field) => {
                  const Icon = field.icon;
                  const value = field.format
                    ? field.format(
                        mahasiswa[field.key as keyof typeof mahasiswa] as number
                      )
                    : mahasiswa[field.key as keyof typeof mahasiswa];

                  return (
                    <div key={field.key} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        {Icon && <Icon className="w-4 h-4 mr-2" />}
                        {field.label}
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900">
                        {value}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
