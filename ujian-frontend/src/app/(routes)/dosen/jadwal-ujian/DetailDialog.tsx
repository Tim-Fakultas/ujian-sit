/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPengujiList } from "@/lib/ujian/helpers";
import { Ujian } from "@/types/Ujian";
import { Calendar, Clock, MapPin, X } from "lucide-react";

export default function DetailDialog({
  dispatchModal,
  ujian,
}: {
  dispatchModal: React.Dispatch<any>;
  ujian: Ujian;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === "Escape") dispatchModal({ type: "CLOSE_DETAIL" });
      }}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => dispatchModal({ type: "CLOSE_DETAIL" })}
      />
      <div
        className="relative z-10 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <CardHeader className="flex items-start justify-between gap-4">
            <div className="text-left">
              <h3 className="text-lg font-semibold">
                {ujian.mahasiswa?.nama ?? "-"}
              </h3>
              <div className="text-sm text-muted-foreground">
                {ujian.mahasiswa?.nim ?? "-"} •{" "}
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} />{" "}
                  {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                dispatchModal({
                  type: "CLOSE_DETAIL",
                })
              }
              aria-label="Tutup detail"
            >
              <X size={16} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 text-left gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Judul Penelitian
                  </div>
                  <div className="mt-1 text-sm font-medium whitespace-pre-wrap break-words break-all max-w-full">
                    {ujian.judulPenelitian ?? "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Jenis Ujian
                  </div>
                  <div className="mt-1 inline-flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded font-semibold text-xs ${
                        ujian.jenisUjian?.namaJenis === "Ujian Proposal"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                          : ujian.jenisUjian?.namaJenis === "Ujian Hasil"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                          : "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                      }`}
                    >
                      {ujian.jenisUjian?.namaJenis ?? "-"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Waktu & Ruangan
                  </div>
                  <div className="mt-1 text-sm flex flex-col gap-1">
                    <div className="inline-flex items-center gap-2">
                      <Calendar size={14} />
                      <span>
                        {ujian.hariUjian ?? "-"} ,{" "}
                        {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <Clock size={14} />
                      <span>
                        {ujian.waktuMulai?.slice(0, 5) ?? "-"} -{" "}
                        {ujian.waktuSelesai?.slice(0, 5) ?? "-"}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <MapPin size={14} />
                      <span>{ujian.ruangan?.namaRuangan ?? "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">Penguji</div>
                  <div className="mt-2 space-y-2">
                    {getPengujiList(ujian).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs text-muted-foreground">
                            {p.label}
                          </div>
                          <div className="text-sm font-medium">
                            {p.nama ?? "-"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
