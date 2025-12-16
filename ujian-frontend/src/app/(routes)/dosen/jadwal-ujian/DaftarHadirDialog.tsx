import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ujian } from "@/types/Ujian";
import { X } from "lucide-react";

export default function DaftarHadirDialog({
  openDaftarHadir,
  setOpenDaftarHadir,
  ujian,
  getPengujiList,
  sudahHadir,
  handleHadir,
  hadirLoading,
  currentDosenId,
}: {
  openDaftarHadir: boolean;
  setOpenDaftarHadir: (open: boolean) => void;
  ujian: Ujian;
  getPengujiList: (ujian: Ujian) => {
    id: number;
    nama: string | null;
    nip: string | null;
    nidn: string | null;
    label: string;
  }[];
  sudahHadir: (ujianId: number, dosenId: number) => boolean;
  handleHadir: (dosenId: number, ujianId: number) => void;
  hadirLoading: number | null;
  currentDosenId: number | null;
}) {
  if (!openDaftarHadir) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpenDaftarHadir(false)}
      />
      <div
        className="relative z-10 w-full max-w-xl mx-2 sm:mx-4 h-[90vh] sm:h-[90vh] flex"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="rounded-xl shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 h-full flex flex-col w-full">
          {/* Tombol close di atas kanan */}
          <button
            type="button"
            className="absolute top-3 right-3 z-20 bg-white dark:bg-neutral-900 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            aria-label="Tutup"
            onClick={() => setOpenDaftarHadir(false)}
          >
            <X size={18} />
          </button>
          <CardHeader className="flex items-center justify-between pb-2 border-b">
            <CardTitle className="font-bold text-lg tracking-tight">
              Daftar Hadir {ujian.jenisUjian?.namaJenis}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4 px-2 sm:px-6 flex-1 flex flex-col min-h-0">
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="text-xs">
                <span className="text-sm text-muted-foreground">
                  Hari/Tanggal:
                </span>{" "}
                <span>
                  {ujian.hariUjian
                    ? ujian.hariUjian.charAt(0).toUpperCase() +
                      ujian.hariUjian.slice(1)
                    : "-"}
                </span>{" "}
                / <span>{ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Ruangan:</span>{" "}
                <span>{ujian.ruangan.namaRuangan ?? "-"}</span>
              </div>
            </div>
            <ScrollArea className="rounded-xl border bg-white dark:bg-neutral-900 flex-1 px-2 py-2 min-h-0 max-h-full">
              <div className="flex flex-col gap-3">
                {getPengujiList(ujian).map((penguji) => {
                  const hadir = sudahHadir(ujian.id, penguji.id);
                  const isCurrent = penguji.id === currentDosenId;
                  return (
                    <div
                      key={penguji.id}
                      className="rounded-xl border bg-muted/40 dark:bg-neutral-800 px-3 py-3 flex flex-col gap-2"
                    >
                      <span
                        className={`inline-block px-4 py-2 rounded-xl text-xs font-semibold mb-1
                          ${
                            penguji.label === "Ketua Penguji"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                              : penguji.label === "Sekretaris Penguji"
                              ? "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100"
                              : penguji.label === "Penguji 1"
                              ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100"
                              : penguji.label === "Penguji 2"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                      >
                        {penguji.label}
                      </span>
                      <span className="font-medium text-sm pl-2  break-words">
                        {penguji.nama ?? "-"}
                      </span>
                      {isCurrent ? (
                        <Button
                          size="sm"
                          className={
                            hadir
                              ? "bg-green-100 text-green-700 text-xs font-semibold px-4 py-1 rounded-full cursor-default shadow-none mt-2"
                              : "bg-green-600 text-white hover:bg-green-700 text-xs transition px-4 py-1 rounded-full shadow mt-2"
                          }
                          disabled={hadirLoading === ujian.id || hadir}
                          onClick={() => handleHadir(currentDosenId!, ujian.id)}
                        >
                          {hadirLoading === ujian.id
                            ? "Loading..."
                            : hadir
                            ? "Sudah Hadir"
                            : "Hadir"}
                        </Button>
                      ) : (
                        <span
                          className={`inline-block px-4 py-1 rounded-full text-xs font-semibold mt-2 ${
                            hadir
                              ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800"
                              : "bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                          }`}
                        >
                          {hadir ? "Sudah Hadir" : "-"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
