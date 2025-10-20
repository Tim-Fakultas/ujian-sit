"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RekapitulasiNilaiTable() {
  const [openDetail, setOpenDetail] = useState(false);

  function Modal({
    open,
    onClose,
    children,
    className = "",
  }: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
  }) {
    if (!open) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80"
        onClick={onClose}
      >
        <div
          className={`bg-white rounded shadow-lg p-6 relative max-w-2xl w-full ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </Button>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Nama Mahasiswa</TableHead>
            <TableHead>Judul Penelitian</TableHead>
            <TableHead>Hari / Tanggal</TableHead>
            <TableHead>Nilai</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="w-[100px]">1</TableCell>
            <TableCell>Contoh Mahasiswa</TableCell>
            <TableCell>Contoh Judul Penelitian</TableCell>
            <TableCell>Senin, 1 Januari 2023</TableCell>
            <TableCell>85</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2"
                    aria-label="Aksi"
                  >
                    <MoreVertical size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setOpenDetail(true)}>
                    <Eye size={16} className="mr-2" /> Detail
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Modal open={openDetail} onClose={() => setOpenDetail(false)}>
                <div className="max-h-[90vh] overflow-y-auto">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold mb-2">
                      Detail Rekap Nilai Skripsi
                    </h2>
                  </div>
                  <div className="mb-2">
                    <div>
                      <strong>Hari/Tanggal:</strong> Senin, 1 Januari 2023
                    </div>
                    <div>
                      <strong>Nama/NIM:</strong> Contoh Mahasiswa / 123456789
                    </div>
                    <div>
                      <strong>Judul Skripsi:</strong> Contoh Judul Penelitian
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="w-8">No.</TableHead>
                        <TableHead>Komponen</TableHead>
                        <TableHead>Bobot %</TableHead>
                        <TableHead>Skor</TableHead>
                        <TableHead>Bobot * Skor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>Seminar Proposal</TableCell>
                        <TableCell>20</TableCell>
                        <TableCell>85</TableCell>
                        <TableCell>{(85 * 20) / 100}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>Ujian Hasil</TableCell>
                        <TableCell>50</TableCell>
                        <TableCell>90</TableCell>
                        <TableCell>{(90 * 50) / 100}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>3</TableCell>
                        <TableCell>Ujian Skripsi</TableCell>
                        <TableCell>30</TableCell>
                        <TableCell>88</TableCell>
                        <TableCell>{(88 * 30) / 100}</TableCell>
                      </TableRow>
                      <TableRow className="font-bold bg-gray-50">
                        <TableCell colSpan={4}>Total Angka Nilai</TableCell>
                        <TableCell>
                          {(85 * 20) / 100 + (90 * 50) / 100 + (88 * 30) / 100}
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-bold bg-gray-50">
                        <TableCell colSpan={4}>Nilai Huruf</TableCell>
                        <TableCell>
                          {(() => {
                            const total =
                              (85 * 20) / 100 +
                              (90 * 50) / 100 +
                              (88 * 30) / 100;
                            if (total >= 80) return "A";
                            if (total >= 70) return "B";
                            if (total >= 60) return "C";
                            if (total >= 56) return "D";
                            return "E";
                          })()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  {/* Catatan interval nilai */}
                  <div className="mt-4 border rounded p-3 bg-gray-50">
                    <strong className="text-xs">Catatan interval nilai:</strong>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="pr-2 text-xs">A</TableCell>
                          <TableCell className="text-xs">
                            : 80.00 – 100
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pr-2 text-xs">B</TableCell>
                          <TableCell className="text-xs">
                            : 70.00 – 79.99
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pr-2 text-xs">C</TableCell>
                          <TableCell className="text-xs">
                            : 60.00 – 69.99
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pr-2 text-xs">D</TableCell>
                          <TableCell className="text-xs">
                            : 56.00 – 59.99
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="pr-2 text-xs">E</TableCell>
                          <TableCell className="text-xs">
                            : {"<"} 55.99
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Modal>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
