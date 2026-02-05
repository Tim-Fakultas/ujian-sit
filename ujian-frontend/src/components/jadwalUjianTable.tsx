"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState, useMemo, useEffect } from "react";
import { DataTableFilter } from "@/components/data-table/DataTableFilter";
import TableGlobal from "@/components/tableGlobal";
import { Penguji, Ujian } from "@/types/Ujian";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/custom-toast";
import {
  Eye,
  MoreHorizontal,
  Users,
  FileDown,
  X,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { daftarKehadiran } from "@/types/DaftarKehadiran";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getJenisUjianColor } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { setUjianSelesai, setUjianDijadwalkan } from "@/actions/jadwalUjian";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataCard } from "@/components/common/DataCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUrlFilter } from "@/hooks/use-url-filter";
import { useDebounce } from "@/hooks/use-debounce";

/** 🔹 Modal Wrapper (Custom implementation) */
const Modal = ({
  open,
  onClose,
  children,
  title,
  width = "max-w-3xl",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: string;
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 dark:bg-neutral-900/80 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-neutral-900 w-full ${width} mx-4 rounded-xl shadow-2xl border dark:border-neutral-800 animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-neutral-800 bg-gray-50/50 dark:bg-[#1f1f1f] shrink-0 rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// ... existing imports

export default function JadwalUjianTable({
  jadwalUjian,
  daftarHadir,
  userRole,
}: {
  jadwalUjian: Ujian[];
  daftarHadir: daftarKehadiran[] | null;
  userRole?: string;
}) {
  const { user } = useAuthStore();
  /* State for detail dialog (modern) */
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<Ujian | null>(null);

  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  const [selectedDaftarHadir, setSelectedDaftarHadir] = useState<Ujian | null>(
    null
  );

  const [filterNama, setFilterNama] = useState("");
  const debouncedNama = useDebounce(filterNama, 300);
  const [filterJenis, setFilterJenis] = useUrlFilter("jenis", "all");
  const [openFilter, setOpenFilter] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  // daftar ujian yg ditandai selesai (lokal/optimistic)
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const [sortField, setSortField] = useState<"nama" | "judul" | "waktu" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  // View mode for students: 'all' or 'mine'
  const [scheduleView, setScheduleView] = useState<"all" | "mine">("all");

  // Ubah state statusTab ke "all" | "dijadwalkan" | "selesai"
  const [statusTab, setStatusTab] = useState<"all" | "dijadwalkan" | "selesai">(
    "all"
  );

  const filteredData = useMemo(() => {
    let data = jadwalUjian.filter((ujian) => {
      // 1. Filter by view mode (for students)
      if (userRole === "mahasiswa" && scheduleView === "mine" && user) {
        // Checking against multiple possible identifiers
        const userNIM = user.nim || user.nip_nim;
        if (userNIM && ujian.mahasiswa.nim !== userNIM) {
          return false;
        }
      }

      // Filter status ujian sesuai tab
      if (statusTab === "dijadwalkan") {
        if (
          completedIds.includes(ujian.id) ||
          ujian.pendaftaranUjian.status === "selesai"
        )
          return false;
      } else if (statusTab === "selesai") {
        if (
          !(
            completedIds.includes(ujian.id) ||
            ujian.pendaftaranUjian.status === "selesai"
          )
        )
          return false;
      }

      const matchNama =
        ujian.mahasiswa.nama
          .toLowerCase()
          .includes(debouncedNama.toLowerCase()) ||
        ujian.mahasiswa.nim
          .toLowerCase()
          .includes(debouncedNama.toLowerCase());

      const matchJenis =
        filterJenis === "all"
          ? true
          : ujian.jenisUjian.namaJenis === filterJenis;

      const matchDate =
        date?.from
          ? (() => {
            if (!ujian.jadwalUjian) return false;
            const uDate = new Date(ujian.jadwalUjian);
            uDate.setHours(0, 0, 0, 0);
            const from = new Date(date.from);
            from.setHours(0, 0, 0, 0);

            if (date.to) {
              const to = new Date(date.to);
              to.setHours(23, 59, 59, 999);
              return uDate >= from && uDate <= to;
            }
            return uDate.getTime() === from.getTime();
          })()
          : true;

      return matchNama && matchJenis && matchDate;
    });

    if (sortField) {
      data = [...data].sort((a, b) => {
        if (sortField === "nama") {
          const namaA = a.mahasiswa.nama.toLowerCase();
          const namaB = b.mahasiswa.nama.toLowerCase();
          if (namaA < namaB) return sortOrder === "asc" ? -1 : 1;
          if (namaA > namaB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }

        if (sortField === "judul") {
          const judulA = (a.judulPenelitian || "").toLowerCase();
          const judulB = (b.judulPenelitian || "").toLowerCase();
          if (judulA < judulB) return sortOrder === "asc" ? -1 : 1;
          if (judulA > judulB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }

        if (sortField === "waktu") {
          const tglA = new Date(a.jadwalUjian).getTime();
          const tglB = new Date(b.jadwalUjian).getTime();
          if (tglA < tglB) return sortOrder === "asc" ? -1 : 1;
          if (tglA > tglB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }

        return 0;
      });
    }

    return data;
  }, [
    jadwalUjian,
    debouncedNama,
    filterJenis,
    date,
    sortField,
    sortOrder,
    statusTab,
    completedIds,
    scheduleView,
    user,
  ]);

  // ===========================================
  // Pagination
  // ===========================================
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedNama, filterJenis]);

  useEffect(() => {
    if (page > totalPage) {
      setPage(totalPage || 1);
    }
  }, [totalPage, page]);

  async function handleToggleStatusUjian(ujian: Ujian) {
    try {
      if (completedIds.includes(ujian.id)) {
        await setUjianDijadwalkan(ujian.pendaftaranUjian.id);
        setCompletedIds((prev) => prev.filter((id) => id !== ujian.id));
        showToast.success("Status ujian dikembalikan ke Dijadwalkan");
      } else {
        await setUjianSelesai(ujian.pendaftaranUjian.id);
        setCompletedIds((prev) => [...prev, ujian.id]);
        showToast.success("Berhasil menandai ujian selesai");
      }
    } catch (error) {
      console.error(error);
      showToast.error("Gagal mengubah status ujian");
    }
  }



  // Table columns for TableGlobal
  const cols = [
    {
      id: "no",
      header: "No",
      cell: ({ row, table }: any) => {
        const index =
          (table.getState().pagination?.pageIndex ?? 0) *
          (table.getState().pagination?.pageSize ?? 10) +
          row.index +
          1;
        return <div className="text-center">{index}</div>;
      },
      size: 36,
    },
    {
      accessorFn: (row: Ujian) => row.mahasiswa.nama ?? "-",
      id: "nama",
      header: "Nama Mahasiswa",
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.getValue("nama")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.mahasiswa.nim}
          </div>
        </div>
      ),
      size: 150,
    },
    {
      id: "waktu",
      header: "Waktu",
      cell: ({ row }: any) => {
        const jadwal = row.original.jadwalUjian;
        const mulai = row.original.waktuMulai?.slice(0, 5);
        const selesai = row.original.waktuSelesai?.slice(0, 5);

        if (!jadwal) return <span className="text-gray-400">-</span>;

        return (
          <div className="text-sm">
            <div className="font-medium">
              {new Date(jadwal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </div>
            <div className="text-muted-foreground">
              {mulai && selesai ? `${mulai} - ${selesai}` : "-"}
            </div>
          </div>
        );
      },
      size: 100,
    },
    {
      id: "ruangan",
      header: "Ruangan",
      cell: ({ row }: any) => (
        <div className="text-sm font-medium">
          {row.original.ruangan?.namaRuangan ?? "-"}
        </div>
      ),
      size: 100,
    },
    {
      accessorFn: (row: Ujian) => row.judulPenelitian ?? "-",
      id: "judul",
      header: "Judul Penelitian",
      cell: ({ row }: any) => (
        <div className="truncate max-w-[200px] text-sm ">
          {row.getValue("judul")}
        </div>
      ),
      size: 200,
    },
    {
      id: "penguji",
      header: "Tim Penguji",
      cell: ({ row }: any) => {
        const penguji: Penguji[] = row.original.penguji || [];
        if (penguji.length === 0) return <span className="text-gray-400 text-xs italic">Belum ditentukan</span>;

        const displayLimit = 3;
        const remainingCount = Math.max(0, penguji.length - displayLimit);
        const displayPenguji = penguji.slice(0, displayLimit);

        return (
          <Popover>
            <PopoverTrigger asChild>
              <button className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="flex -space-x-2.5">
                  {displayPenguji.map((p, i) => {
                    const initials = p.nama
                      ? p.nama
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                      : "?";
                    // Generate pseudo-random color based on name length
                    const colors = [
                      "bg-blue-100 text-blue-700 border-blue-200",
                      "bg-indigo-100 text-indigo-700 border-indigo-200",
                      "bg-emerald-100 text-emerald-700 border-emerald-200",
                      "bg-amber-100 text-amber-700 border-amber-200",
                      "bg-rose-100 text-rose-700 border-rose-200",
                    ];
                    const colorClass = colors[(p.nama?.length || 0) % colors.length];

                    return (
                      <div
                        key={i}
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-neutral-900 ${colorClass} shadow-sm text-[10px] font-bold ring-0 transition-transform group-hover:scale-105 group-hover:z-10`}
                        title={p.nama}
                      >
                        {initials}
                      </div>
                    );
                  })}
                  {remainingCount > 0 && (
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-neutral-900 bg-gray-100 text-gray-600 font-bold text-[10px] shadow-sm">
                      +{remainingCount}
                    </div>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded-md group-hover:bg-muted transition-colors">
                  <span>Lihat</span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 shadow-xl border-border/50" align="end" sideOffset={8}>
              <div className="bg-muted/40 p-4 border-b">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <span className="p-1.5 bg-primary/10 rounded-md text-primary">
                    <Users size={14} />
                  </span>
                  Tim Penguji
                </h4>
                <p className="text-[10px] text-muted-foreground mt-1 ml-9">
                  Daftar dosen penguji untuk ujian ini.
                </p>
              </div>
              <div className="p-2">
                {penguji.map((p, idx) => {
                  const roleMap: Record<string, string> = {
                    ketua_penguji: "Ketua Penguji",
                    sekretaris_penguji: "Sekretaris Penguji",
                    penguji_1: "Penguji I",
                    penguji_2: "Penguji II",
                  };
                  const label = roleMap[p.peran] || p.peran;
                  // Cek kehadiran
                  const hadir = daftarHadir?.some(
                    (d) =>
                      d.dosenId === p.id &&
                      d.statusKehadiran === "hadir" &&
                      d.ujianId === row.original.id
                  );

                  return (
                    <div
                      key={idx}
                      className="group flex flex-col gap-1 p-2.5 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0
                                ${hadir ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}
                            `}>
                            {p.nama ? p.nama.substring(0, 2).toUpperCase() : "??"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-none truncate w-full" title={p.nama}>
                              {p.nama ?? "-"}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1 font-medium bg-muted inline-block px-1.5 py-0.5 rounded">
                              {label}
                            </p>
                          </div>
                        </div>

                        {hadir && (
                          <span className="shrink-0 text-xs font-medium px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                            Hadir
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        );
      },
      size: 180,
    },
  ];

  // TableGlobal setup
  const table = {
    getRowModel: () => ({
      rows: paginatedData.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari error TS dengan casting ke any
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getHeaderGroups: () => [
      {
        id: "main",
        headers: cols.map((col) => ({
          id: col.id,
          isPlaceholder: false,
          column: { columnDef: col },
          getContext: () => ({ table }),
        })),
      },
    ],
    previousPage: () => setPage((p) => Math.max(1, p - 1)),
    nextPage: () => setPage((p) => Math.min(totalPage, p + 1)),
    getCanPreviousPage: () => page > 1,
    getCanNextPage: () => page < totalPage,
    getFilteredRowModel: () => ({
      rows: filteredData.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari error TS dengan casting ke any
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getPreFilteredRowModel: () => ({
      rows: jadwalUjian.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari error TS dengan casting ke any
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getState: () => ({
      pagination: { pageIndex: page - 1, pageSize },
    }),
    getPageCount: () => totalPage,
    setPageIndex: (p: number) => setPage(p + 1),
  };

  // Function to export to PDF
  // Function to export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");

    // Initial Y position
    let finalY = 15;

    // Define categories and their display titles
    const categories = [
      { key: "Ujian Proposal", title: "SEMINAR PROPOSAL" },
      { key: "Ujian Hasil", title: "UJIAN HASIL" },
      { key: "Ujian Skripsi", title: "UJIAN SKRIPSI" },
    ];

    let hasPrintedAny = false;

    categories.forEach((cat) => {
      // Filter data for this category
      const catData = filteredData.filter(u => u.jenisUjian.namaJenis === cat.key);

      if (catData.length === 0) return;

      hasPrintedAny = true;

      // Add spacing or new page if needed
      if (finalY > 15) {
        finalY += 15;
        // Check if we need a new page (A4 landscape height ~210mm)
        if (finalY > 180) {
          doc.addPage();
          finalY = 15;
        }
      }

      // Section Title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(cat.title, 14, finalY);

      // Reset font
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      // Prepare table data
      const tableData = catData.map((ujian, index) => {
        // Helper to find examiner by role
        const getPengujiName = (role: string) => {
          const p = ujian.penguji?.find((p) => p.peran === role);
          return p ? p.nama : "";
        };

        const ketua = getPengujiName("ketua_penguji");
        const sekretaris = getPengujiName("sekretaris_penguji");
        const penguji1 = getPengujiName("penguji_1");
        const penguji2 = getPengujiName("penguji_2");

        return [
          index + 1,
          ujian.mahasiswa.nim || "-",
          ujian.mahasiswa.nama || "-",
          ujian.jadwalUjian
            ? `${new Date(ujian.jadwalUjian).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}\n${ujian.waktuMulai?.slice(0, 5)} s.d ${ujian.waktuSelesai?.slice(0, 5)}`
            : "Belum dijadwalkan",
          `${ujian.ruangan?.namaRuangan || "-"}\n(Ruang Ujian)`,
          ujian.judulPenelitian || "-",
          ketua,
          sekretaris,
          penguji1,
          penguji2,
        ];
      });

      // Render Table
      autoTable(doc, {
        head: [
          [
            "NO",
            "NIM",
            "NAMA",
            "WAKTU",
            "Ruang",
            "JUDUL",
            "KETUA PENGUJI",
            "SEKRETARIS PENGUJI",
            "PENGUJI I",
            "PENGUJI II",
          ],
        ],
        body: tableData,
        startY: finalY + 5,
        theme: "grid",
        styles: {
          fontSize: 7,
          cellPadding: 2,
          valign: "middle",
          halign: "left",
          font: "helvetica",
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0],
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [100, 149, 237],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          halign: "center",
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
        columnStyles: {
          0: { cellWidth: 8, halign: "center" },
          1: { cellWidth: 20 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 15, halign: "center" },
          5: { cellWidth: 50 },
          6: { cellWidth: 30 },
          7: { cellWidth: 30 },
          8: { cellWidth: 30 },
          9: { cellWidth: 30 },
        },
      });

      // Update finalY for next iteration
      finalY = (doc as any).lastAutoTable.finalY;
    });

    if (!hasPrintedAny) {
      doc.text("Tidak ada data jadwal ujian yang ditampilkan.", 14, 15);
    }

    doc.save("jadwal-ujian-skripsi.pdf");
  };

  // Toggle UI Component
  const scheduleToggle = (
    <div className="h-9 bg-muted/50 p-1 rounded-lg flex items-center relative border border-border/50 w-[220px]">
      <div
        className={`absolute inset-y-1 rounded-md bg-white dark:bg-neutral-800 shadow-sm transition-all duration-300 ease-out
            ${scheduleView === 'all' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-6px)]'}
          `}
      />
      <button
        onClick={() => setScheduleView("all")}
        className={`flex-1 relative z-10 h-full text-xs font-medium transition-colors duration-200 rounded-md flex items-center justify-center ${scheduleView === "all" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground/80"
          }`}
      >
        Semua Jadwal
      </button>
      <button
        onClick={() => setScheduleView("mine")}
        className={`flex-1 relative z-10 h-full text-xs font-medium transition-colors duration-200 rounded-md flex items-center justify-center ${scheduleView === "mine" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground/80"
          }`}
      >
        Jadwal Saya
      </button>
    </div>
  );

  return (
    <DataCard>


      <DataTableFilter
        searchPlaceholder="Cari berdasarkan Nama atau NIM"
        searchValue={filterNama}
        onSearchChange={setFilterNama}
        filters={[
          {
            key: "jenis",
            title: "Jenis Ujian",
            value: filterJenis,
            onChange: setFilterJenis,
            options: [
              { value: "all", label: "Semua" },
              { value: "Ujian Proposal", label: "Seminar Proposal" },
              { value: "Ujian Hasil", label: "Ujian Hasil" },
              { value: "Ujian Skripsi", label: "Ujian Skripsi" },
            ],
          },

        ]}
        date={(userRole === "kaprodi" || userRole === "sekprodi") ? date : undefined}
        onDateChange={(userRole === "kaprodi" || userRole === "sekprodi") ? setDate : undefined}
        onExport={(userRole === "kaprodi" || userRole === "sekprodi") ? handleExportPDF : undefined}
        actions={
          userRole === "mahasiswa" ? (
            <div className="hidden lg:block ml-2">
              {scheduleToggle}
            </div>
          ) : undefined
        }
      />

      {userRole === "mahasiswa" && (
        <div className="lg:hidden mb-4 flex justify-end">
          {scheduleToggle}
        </div>
      )}
      <div className="mt-4">
        <TableGlobal table={table} cols={cols} />
      </div>
    </DataCard>
  );
}