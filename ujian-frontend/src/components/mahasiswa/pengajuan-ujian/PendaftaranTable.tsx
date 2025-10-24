"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { getJenisUjianColor, getStatusColor, truncateTitle } from "@/lib/utils";
import { PendaftaranUjianResponse } from "@/types/PendaftaranUjian";
import { User } from "@/types/Auth";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";

export default function PendaftaranTable({
  pendaftaranUjian,
}: {
  pendaftaranUjian: PendaftaranUjianResponse;
  user: User | null;
  jenisUjianList: Array<{ id: number; namaJenis: string }>;
  pengajuanRanpel: PengajuanRanpel[];
  showFormOnly?: boolean;
}) {
  return (
    <div className="rounded-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>Jenis Ujian</TableHead>
            <TableHead>Tanggal Pengajuan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendaftaranUjian.data && pendaftaranUjian.data.length > 0 ? (
            pendaftaranUjian.data.map((pendaftaran, index: number) => (
              <TableRow key={pendaftaran.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {truncateTitle(pendaftaran.ranpel.judulPenelitian)}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getJenisUjianColor(
                      pendaftaran.jenisUjian.namaJenis
                    )}`}
                  >
                    {pendaftaran.jenisUjian.namaJenis}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(pendaftaran.tanggalPengajuan).toLocaleDateString(
                    "id-ID"
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(
                      pendaftaran.status
                    )}`}
                  >
                    {pendaftaran.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" className="text-xs">
                    <Eye />
                    Lihat
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500">
                Tidak ada data pendaftaran ujian
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
