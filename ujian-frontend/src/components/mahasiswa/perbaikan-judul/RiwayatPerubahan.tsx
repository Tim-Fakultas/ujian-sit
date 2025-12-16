"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { History, CheckCircle2, Circle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tipe data mock untuk riwayat (nanti diganti dengan data real dari API)
interface HistoryItem {
  id: number;
  judul: string;
  tanggal: string;
  status: "disetujui" | "diajukan" | "ditolak";
  keterangan?: string;
}

// Mock Data
const mockHistory: HistoryItem[] = [
  // Contoh data dummy untuk visualisasi
  // {
  //   id: 1,
  //   judul: "Implementasi Algoritma Genetic pada Penjadwalan Mata Kuliah",
  //   tanggal: "2024-01-20",
  //   status: "disetujui",
  //   keterangan: "Judul awal disetujui saat seminar proposal"
  // }
];

interface RiwayatPerubahanProps {
    currentJudul: string;
    updatedAt?: string | null;
    className?: string;
}

export default function RiwayatPerubahan({ currentJudul, updatedAt, className }: RiwayatPerubahanProps) {
    // Jika ada backend history, kita mapping disini. 
    // Untuk sekarang, kita gabungkan mock history dengan 'state' saat ini jika perlu, 
    // atau sekedar menampilkan list kosong jika belum ada fitur history di backend.
    
    // Kita simulasi history dengan memasukkan judul saat ini sebagai "Terbaru"
    // jika data mock kosong (karena fitur log belum ada di BE).
    const displayHistory = [
        {
            id: 999,
            judul: currentJudul,
            tanggal: updatedAt ? new Date(updatedAt).toLocaleDateString("id-ID", {
                day: 'numeric', month: 'long', year: 'numeric'
            }) : "Saat ini",
            status: "disetujui" as const,
            keterangan: "Judul aktif saat ini"
        },
        ...mockHistory
    ];

  return (
    <Card className={`border-l-4 border-l-indigo-500 shadow-sm bg-white dark:bg-neutral-900 flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-indigo-500" />
          Riwayat Perubahan Judul
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        {displayHistory.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">
            Belum ada riwayat perubahan judul.
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 space-y-8 my-2">
              {displayHistory.map((item, index) => (
                <div key={item.id} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-neutral-900 
                    ${index === 0 ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}
                  `} />
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                         <span className="text-xs font-semibold text-muted-foreground bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                            {item.tanggal}
                         </span>
                         {index === 0 && (
                             <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                                 Aktif
                             </span>
                         )}
                    </div>
                    
                    <h4 className={`text-sm font-medium leading-snug mt-1 ${index === 0 ? "text-gray-900 dark:text-gray-100 font-semibold" : "text-gray-600 dark:text-gray-400"}`}>
                      {item.judul}
                    </h4>

                    {item.keterangan && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            "{item.keterangan}"
                        </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
