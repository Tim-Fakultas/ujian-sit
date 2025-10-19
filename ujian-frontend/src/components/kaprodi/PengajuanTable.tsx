"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPengajuanRanpelByProdi } from "@/actions/pengajuanRanpel";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import PDFPreviewModal from "../dosen/PDFPreviewModal";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

export default function PengajuanTable({
  pengajuanRanpel,
  loggedUser,
}: {
  pengajuanRanpel: PengajuanRanpel[];
  loggedUser: any;
}) {
  const { data } = useSWR<PengajuanRanpel[]>(
    `/api/mahasiswa/pengajuan-ranpel`,
    {
      fallbackData: pengajuanRanpel,
      refreshInterval: 3000,
    }
  );

  const truncateTitle = (title: string, maxLength: number = 45) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID");
    } catch {
      return dateString;
    }
  };

  const handleLihatClick = (pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPengajuan(null);
  };

  // Tambahkan handler untuk refresh data dan update modal
  const handleUpdated = async () => {
    mutate(`/api/mahasiswa/pengajuan-ranpel`);
    // Jika modal masih terbuka, update selectedPengajuan dengan data terbaru
    if (selectedPengajuan) {
      // Fetch pengajuan terbaru dari backend
      const updatedList = await getPengajuanRanpelByProdi(loggedUser.prodi?.id);
      const updatedPengajuan = updatedList.find(
        (p) => p.id === selectedPengajuan.id
      );
      if (updatedPengajuan) setSelectedPengajuan(updatedPengajuan);
    }
  };

  return (
    <>
      <div className="mt-6 overflow-x-auto border-0 rounded-sm">
        <Table>
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead>Judul Rancangan Penelitian</TableHead>
              <TableHead>Tanggal Pengajuan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data && data.length > 0 ? (
              data.map((pengajuan: PengajuanRanpel, index: number) => (
                <TableRow key={pengajuan.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{pengajuan.mahasiswa.nama}</TableCell>
                  <TableCell>
                    {truncateTitle(pengajuan.ranpel.judulPenelitian)}
                  </TableCell>
                  <TableCell>
                    {formatDate(pengajuan.tanggalPengajuan)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        pengajuan.status === "diterima"
                          ? "bg-blue-100 text-blue-800"
                          : pengajuan.status === "diverifikasi"
                          ? "bg-green-100 text-green-800"
                          : pengajuan.status === "ditolak"
                          ? "bg-red-100 text-red-800"
                          : ""
                      }`}
                    >
                      {pengajuan.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() => handleLihatClick(pengajuan)}
                      variant="outline"
                      className="text-xs"
                    >
                      <Eye size={16} />
                      Preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Tidak ada data pengajuan rancangan penelitian.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PDF Preview Modal */}
      {selectedPengajuan && (
        <PDFPreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pengajuan={selectedPengajuan}
          loggedUser={loggedUser}
          onUpdated={handleUpdated} // <-- panggil refresh
        />
      )}
    </>
  );
}
