"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { useState } from "react";
import useSWR from "swr";
import { DosenUser } from "@/types/Auth";
import PDFPreviewModal from "./PDFPreviewModal";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { formatDate, truncateTitle } from "@/lib/utils";

export default function PengajuanTable({
  pengajuanRanpel,
  loggedUser,
}: {
  pengajuanRanpel: PengajuanRanpel[];
  loggedUser: DosenUser;
}) {
  const { data } = useSWR<PengajuanRanpel[]>(
    `/api/mahasiswa/pengajuan-ranpel`,
    {
      fallbackData: pengajuanRanpel,
      refreshInterval: 3000,
    }
  );

  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLihatClick = (pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPengajuan(null);
  };

  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-sm">
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
                        pengajuan.status === "menunggu"
                          ? "bg-yellow-100 text-yellow-800"
                          : pengajuan.status === "diterima"
                          ? "bg-green-100 text-green-800"
                          : pengajuan.status === "ditolak"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {pengajuan.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() => handleLihatClick(pengajuan)}
                      className="text-xs"
                      variant="outline"
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
        />
      )}
    </>
  );
}
