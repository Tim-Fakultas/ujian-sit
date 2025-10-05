"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  GraduationCap,
  Building,
  Phone,
  Calendar,
  BookOpen,
  Trophy,
  Users,
  Award,
  UserCheck,
} from "lucide-react";

interface StudentProfile {
  nim: string;
  nama: string;
  prodi: string;
  fakultas: string;
  noHp: string;
  semester: number;
  ipk: number;
  dosenPA: string;
  peminatan: string;
  pembimbing1: string;
  pembimbing2: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const mockData: StudentProfile = {
          nim: "2021012345",
          nama: "Ahmad Rizki Pratama",
          prodi: "Teknik Informatika",
          fakultas: "Fakultas Teknologi Informasi",
          noHp: "085123456789",
          semester: 7,
          ipk: 3.75,
          dosenPA: "Dr. Siti Nurhaliza, M.T.",
          peminatan: "Software Engineering",
          pembimbing1: "Prof. Dr. Budi Santoso, M.Kom.",
          pembimbing2: "Dr. Andi Wijaya, M.T.",
        };
        setStudent(mockData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-200 rounded-lg h-96"></div>
              <div className="lg:col-span-2 bg-gray-200 rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          Data mahasiswa tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <div className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-blue-200">
                  <AvatarImage src={student.avatar} alt={student.nama} />
                  <AvatarFallback className="text-2xl font-semibold bg-blue-700 text-white">
                    {student.nama
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-1 text-gray-900">
                  {student.nama}
                </h2>
                <p className="text-blue-700 font-medium mb-2">
                  NIM: {student.nim}
                </p>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  Mahasiswa Aktif
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fakultas</p>
                      <p className="font-medium text-gray-900">
                        {student.fakultas}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <GraduationCap className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Program Studi</p>
                      <p className="font-medium text-gray-900">
                        {student.prodi}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Semester</p>
                      <p className="font-medium text-gray-900">
                        Semester {student.semester}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">IPK</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-lg ${getIPKColor(
                            student.ipk
                          )}`}
                        >
                          {student.ipk.toFixed(2)}
                        </span>
                        <Badge
                          variant={getIPKBadgeVariant(student.ipk)}
                          className="text-xs"
                        >
                          {student.ipk >= 3.5
                            ? "Cumlaude"
                            : student.ipk >= 3.0
                            ? "Baik"
                            : "Cukup"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prestasi */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Prestasi Akademik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Semester IPK terbaik
                    </span>
                    <Badge variant="outline">Semester 6</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total SKS</span>
                    <span className="font-medium">140 SKS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SKS tersisa</span>
                    <span className="font-medium text-blue-600">4 SKS</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informasi Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  Informasi Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <User className="w-4 h-4" /> Nama Lengkap
                      </label>
                      <p className="mt-1 font-medium text-gray-900">
                        {student.nama}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> NIM
                      </label>
                      <p className="mt-1 font-medium text-gray-900">
                        {student.nim}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> No. HP
                      </label>
                      <p className="mt-1 font-medium text-blue-600">
                        {student.noHp}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Building className="w-4 h-4" /> Fakultas
                      </label>
                      <p className="mt-1 font-medium text-gray-900">
                        {student.fakultas}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> Program Studi
                      </label>
                      <p className="mt-1 font-medium text-gray-900">
                        {student.prodi}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Semester
                      </label>
                      <p className="mt-1 font-medium text-gray-900">
                        Semester {student.semester}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Peminatan
                      </label>
                      <p className="mt-1 font-medium text-gray-900">
                        {student.peminatan}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Akademik */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-600" />
                  Informasi Akademik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Dosen Pembimbing Akademik
                        </h3>
                        <p className="text-sm text-gray-600">
                          Pembimbing akademik
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {student.dosenPA}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Trophy className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Indeks Prestasi Kumulatif
                        </h3>
                        <p className="text-sm text-gray-600">IPK saat ini</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${getIPKColor(
                          student.ipk
                        )}`}
                      >
                        {student.ipk.toFixed(2)}
                      </span>
                      <Badge variant={getIPKBadgeVariant(student.ipk)}>
                        {student.ipk >= 3.5
                          ? "Cumlaude"
                          : student.ipk >= 3.0
                          ? "Baik"
                          : "Cukup"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Dosen Pembimbing Skripsi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Pembimbing 1
                          </h4>
                          <p className="text-gray-700">{student.pembimbing1}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Pembimbing 2
                          </h4>
                          <p className="text-gray-700">{student.pembimbing2}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                  Progress Akademik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress SKS</span>
                      <span className="font-medium">140/144 SKS</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                        style={{ width: "97.2%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">140</p>
                      <p className="text-xs text-gray-600">SKS Selesai</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">4</p>
                      <p className="text-xs text-gray-600">SKS Tersisa</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">7</p>
                      <p className="text-xs text-gray-600">Semester</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">97%</p>
                      <p className="text-xs text-gray-600">Progress</p>
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
