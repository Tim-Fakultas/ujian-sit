"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, MapPin, GraduationCap, BookOpen, Calendar } from "lucide-react";

interface StudentProfileProps {
  student?: {
    nama: string;
    nim: string;
    alamat: string;
    fakultas: string;
    prodi: string;
    semester: number;
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
    semester: 6,
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

  const profileData = [
    {
      icon: MapPin,
      label: "Alamat",
      value: studentData.alamat,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: GraduationCap,
      label: "Fakultas",
      value: studentData.fakultas,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: BookOpen,
      label: "Program Studi",
      value: studentData.prodi,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Calendar,
      label: "Semester",
      value: `Semester ${studentData.semester}`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <Card className="w-full max-w-7xl mx-auto bg-white border-0 ">
      <CardContent>
        {/* Header Section with Avatar and Basic Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 p-6 bg-gray-50 rounded-xl">
          <Avatar className="h-16 w-16 border-4 border-white shadow-md">
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(studentData.nama)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {studentData.nama}
            </h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <p className="text-lg text-gray-600 font-medium">
                NIM: {studentData.nim}
              </p>
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-3 py-1"
              >
                Mahasiswa Aktif
              </Badge>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {profileData.map((item, index) => (
            <div
              key={index}
              className="group p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 hover:border-gray-200"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {item.label}
                  </p>
                  <p className="text-gray-900 font-medium leading-relaxed break-words">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
