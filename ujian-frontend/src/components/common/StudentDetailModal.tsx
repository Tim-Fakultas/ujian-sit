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
    if (!status) return "bg-slate-100 text-slate-700 border-slate-200";
    const s = status.toLowerCase();
    if (["aktif", "lulus", "selesai"].includes(s))
      return "bg-emerald-100 text-emerald-700 border-emerald-200 green";
    if (["cuti", "non-aktif"].includes(s))
      return "bg-amber-100 text-amber-700 border-amber-200 amber";
    if (["drop out", "do", "keluar"].includes(s))
      return "bg-rose-100 text-rose-700 border-rose-200 red";
    return "bg-slate-100 text-slate-700 border-slate-200 slate";
  };

  const items: DetailItem[] = data
    ? [
        {
          label: "Program Studi",
          value: data.prodi?.nama,
          icon: GraduationCap,
          colSpan: 2,
        },
        {
          label: "Dosen Pembimbing Akademik",
          value: data.dosenPa?.nama,
          icon: User,
          colSpan: 2,
        },
        {
          label: "Tahun Angkatan",
          value: data.angkatan,
          icon: BookOpen,
        },
        {
          label: "Semester Saat Ini",
          value: `${data.semester} `,
          icon: BookOpen,
        },
        {
          label: "Indeks Prestasi Kumulatif",
          value: data.ipk ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-primary">
                {data.ipk}
              </span>
             
            </div>
          ) : (
            "-"
          ),
          icon: Award,
        },
        {
          label: "Nomor WhatsApp",
          value: data.noHp || "-",
          icon: Phone,
        },
        {
          label: "Alamat Lengkap Domisili",
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
