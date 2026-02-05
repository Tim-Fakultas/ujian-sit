"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { History, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPerbaikanJudulByMahasiswa } from "@/actions/perbaikanJudul";
import { PerbaikanJudul } from "@/types/PerbaikanJudul";

interface RiwayatPerubahanProps {
  currentJudul: string;
  updatedAt?: string | null;
  mahasiswaId: number;
  className?: string;
}

export default function RiwayatPerubahan({ currentJudul, updatedAt, mahasiswaId, className }: RiwayatPerubahanProps) {
  const [history, setHistory] = useState<PerbaikanJudul[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (mahasiswaId) {
        const res = await getPerbaikanJudulByMahasiswa(mahasiswaId);
        setHistory(res);
      }
      setLoading(false);
    };
    fetchData();
  }, [mahasiswaId]);

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <Card className={`shadow-sm bg-white dark:bg-neutral-900 flex flex-col max-h-[calc(100vh-12rem)] ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Riwayat Perubahan Judul
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full pr-4">
          <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 space-y-8 my-2">

            {/* Current Active Title */}
            <div className="relative pl-8">
              <div className="absolute -left-[9px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-neutral-900 bg-emerald-500" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    {formatDate(updatedAt || new Date().toISOString())}
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 capitalize dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                    Aktif
                  </span>
                </div>
                <h4 className="text-sm font-semibold leading-snug mt-1 text-gray-900 dark:text-gray-100">
                  {currentJudul}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 italic">
                  "Judul aktif saat ini"
                </p>
              </div>
            </div>

            {/* History Items */}
            {history.map((item) => (
              <div key={item.id} className="relative pl-8">
                <div className={`absolute -left-[9px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-neutral-900 
                                    ${item.status === 'diterima' ? 'bg-primary' :
                    item.status === 'ditolak' ? 'bg-red-500' : 'bg-gray-300'}
                                `} />

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                      {formatDate(item.tanggalPerbaikan)}
                    </span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border capitalize
                                            ${item.status === 'diterima' ? 'text-primary bg-primary/5 border-primary/20 dark:text-primary dark:border-primary/20' :
                        item.status === 'ditolak' ? 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' :
                          'text-gray-700 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'}
                                        `}>
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-2 space-y-2">
                    {/* Judul Baru */}
                    <div className="bg-primary/5 dark:bg-primary/10 p-2 rounded border border-primary/10 dark:border-primary/20">
                      <p className="text-[10px] uppercase font-bold text-primary dark:text-primary mb-0.5">Usulan Baru</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
                        {item.judulBaru}
                      </p>
                    </div>

                    {/* Judul Lama */}
                    <div className="bg-gray-50 dark:bg-neutral-800/50 p-2 rounded border border-gray-100 dark:border-neutral-800">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Sebelumnya</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug line-through decoration-gray-400/50">
                        {item.judulLama}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {history.length === 0 && !loading && (
              <div className="pl-8 text-xs text-muted-foreground py-2 italic">
                Tidak ada riwayat pengajuan perubahan sebelumnya.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
