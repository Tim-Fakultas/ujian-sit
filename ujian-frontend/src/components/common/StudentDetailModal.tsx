"use client";

import { useEffect, useState } from "react";
import { getMahasiswaById } from "@/actions/data-master/mahasiswa";
import {
  User,
  BookOpen,
  GraduationCap,
  MapPin,
  Phone,
  Award,
} from "lucide-react";
import DetailModal, { DetailItem } from "./DetailModal";

interface StudentDetailModalProps {
  mahasiswaId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

// Define specific type based on expected API response or use any if uncertain
interface MahasiswaDetail {
  id: number;
  nama: string;
  nim: string;
  prodi: {
    nama: string;
  };
  semester: number;
  angkatan: string;
  ipk: number;
  noHp: string;
  alamat: string;
  status: string;
  dosenPa?: {
    nama: string;
  };
}

export default function StudentDetailModal({
  mahasiswaId,
  isOpen,
  onClose,
}: StudentDetailModalProps) {
  const [data, setData] = useState<MahasiswaDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && mahasiswaId) {
      setLoading(true);
      getMahasiswaById(mahasiswaId)
        .then((res: any) => {
          setData(res.data || res);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setData(null);
      setLoading(false);
    }
  }, [isOpen, mahasiswaId]);

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-700 border-gray-200";
    const s = status.toLowerCase();
    if (["aktif", "lulus", "selesai"].includes(s))
      return "bg-green-100 text-green-700 border-green-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const items: DetailItem[] = data
    ? [
        {
          label: "Program Studi",
          value: data.prodi?.nama,
          icon: GraduationCap,
        },
        {
          label: "Dosen Pembimbing Akademik",
          value: data.dosenPa?.nama,
          icon: User,
        },
        {
          label: "Semester",
          value: data.semester?.toString(),
          icon: BookOpen,
        },
        {
          label: "Angkatan",
          value: data.angkatan,
          icon: BookOpen,
        },
        {
          label: "IPK",
          value: data.ipk?.toString(),
          icon: Award,
        },
        {
          label: "No. Handphone",
          value: data.noHp,
          icon: Phone,
        },
        {
          label: "Alamat",
          value: data.alamat,
          icon: MapPin,
          colSpan: 2,
        },
      ]
    : [];

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Mahasiswa"
      loading={loading}
      headerData={
        data
          ? {
              name: data.nama,
              subText: data.nim,
              status: data.status || "Status Tidak Diketahui",
              statusColor: getStatusColor(data.status),
              initials: data.nama ? data.nama.charAt(0) : undefined,
              avatarColor: "bg-primary/10 text-primary border-primary/20",
            }
          : undefined
      }
      items={items}
    />
  );
}
