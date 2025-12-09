/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getNilaiHuruf } from "@/lib/ujian/constants";
import { Ujian } from "@/types/Ujian";

export default function RekapitulasiNilaiModal({
  dispatchModal,
  ujian,
  rekapPenilaian,
  rekapLoading,
}: {
  dispatchModal: React.Dispatch<any>;
  ujian: Ujian;
  rekapPenilaian: any[];
  rekapLoading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => dispatchModal({ type: "CLOSE_REKAP" })}
      />
      <div
        className="relative z-10 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle>
              Rekapitulasi Nilai {ujian.jenisUjian?.namaJenis}
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {ujian.hariUjian ?? "-"} /{" "}
              {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground font-medium">
                  Mahasiswa
                </div>
                <div className="font-semibold">
                  {ujian.mahasiswa?.nama ?? "-"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">
                  NIM
                </div>
                <div className="font-semibold">
                  {ujian.mahasiswa?.nim ?? "-"}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-muted-foreground font-medium mb-2">
                  Judul Penelitian
                </div>
                <div className="font-medium border rounded px-3 py-2 dark:bg-sidebar-accent dark:text-white whitespace-normal break-words">
                  {ujian.judulPenelitian ?? "-"}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border border-muted mt-4">
              <Table>
                <TableHeader className="border-b">
                  <TableRow>
                    <TableHead className="w-8 text-center font-semibold">
                      No.
                    </TableHead>
                    <TableHead className="font-semibold">Nama</TableHead>
                    <TableHead className="font-semibold">Jabatan</TableHead>
                    <TableHead className="font-semibold text-center">
                      Angka Nilai
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rekapLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : rekapPenilaian.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Tidak ada data penilaian
                      </TableCell>
                    </TableRow>
                  ) : (
                    rekapPenilaian.map((d, i) => (
                      <TableRow key={d.dosen?.id || i}>
                        <TableCell className="border-r text-center">
                          {i + 1}
                        </TableCell>
                        <TableCell className="border-r">
                          {d.dosen?.nama ?? "-"}
                        </TableCell>
                        <TableCell className="border-r">{d.jabatan}</TableCell>
                        <TableCell className="text-center">
                          {d.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {rekapPenilaian.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-semibold">
                    {rekapPenilaian
                      .reduce((sum, d) => sum + d.total, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Rata-rata
                  </span>
                  <span className="text-lg font-semibold">
                    {(
                      rekapPenilaian.reduce((sum, d) => sum + d.total, 0) /
                      rekapPenilaian.length
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Nilai Huruf
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white font-semibold">
                    {getNilaiHuruf(
                      rekapPenilaian.reduce((sum, d) => sum + d.total, 0) /
                        rekapPenilaian.length
                    )}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="default"
              onClick={() => dispatchModal({ type: "CLOSE_REKAP" })}
            >
              Tutup
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
