"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, MapPin, GraduationCap, BookOpen } from "lucide-react";

interface StudentProfileProps {
  student?: {
    nama: string;
    nim: string;
    alamat: string;
    fakultas: string;
    prodi: string;
  };
}

export function StudentProfile({ student }: StudentProfileProps) {
  // Mock data untuk demonstrasi
  const defaultStudent = {
    nama: "Ahmad Rizki Pratama",
    nim: "2020110001",
    alamat: "Jl. Merdeka No. 123, Bandung, Jawa Barat",
    fakultas: "Fakultas Sains dan Teknologi",
    prodi: "Teknik Informatika",
  };

  const studentData = student || defaultStudent;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full bg-white ">
      <CardHeader className="pb-6 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-gray-900">
          <User className="h-5 w-5 text-gray-600" />
          Profile Mahasiswa
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start gap-6 mb-8">
          <Avatar className="h-20 w-20 border-2 border-gray-100">
            <AvatarFallback className="text-xl font-bold bg-gray-100 text-gray-700">
              {getInitials(studentData.nama)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 text-balance">
              {studentData.nama}
            </h2>
            <p className="text-gray-600 font-medium">NIM: {studentData.nim}</p>
            <Badge
              variant="secondary"
              className="bg-green-50 text-green-700 border-green-200 font-medium"
            >
              Mahasiswa Aktif
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* Alamat */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Alamat
              </p>
              <p className="text-gray-900 text-pretty leading-relaxed">
                {studentData.alamat}
              </p>
            </div>
          </div>

          {/* Fakultas */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Fakultas
              </p>
              <p className="text-gray-900">{studentData.fakultas}</p>
            </div>
          </div>

          {/* Program Studi */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Program Studi
              </p>
              <p className="text-gray-900">{studentData.prodi}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
