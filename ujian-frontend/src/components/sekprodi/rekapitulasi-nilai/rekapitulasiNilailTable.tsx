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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function RekapitulasiNilaiTable() {
  const [openDetail, setOpenDetail] = useState(false);

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
                  <button className="px-2 py-1 rounded bg-gray-200 text-xs flex items-center gap-1">
                    <MoreVertical size={16} /> More
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setOpenDetail(true)}>
                    <Eye size={16} className="mr-2" /> Detail
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Detail Rekap Nilai Skripsi</DialogTitle>
                  </DialogHeader>
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
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
