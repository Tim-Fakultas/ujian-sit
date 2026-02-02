/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo, useEffect } from "react";
import TableGlobal from "@/components/tableGlobal";
import { Penguji, Ujian } from "@/types/Ujian";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/custom-toast";
import {
  Eye,
  Search,
  MoreHorizontal,
  Check,
  LayoutGrid,
  List,
  Settings2,
  CalendarClock,
  X,
  Users,
  FileDown,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { daftarKehadiran } from "@/types/DaftarKehadiran";
import { Input } from "@/components/ui/input";

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataCard } from "@/components/common/DataCard";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  /* State for detail dialog (modern) */
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<Ujian | null>(null);

  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  const [selectedDaftarHadir, setSelectedDaftarHadir] = useState<Ujian | null>(
    null
  );

  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
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



  // Ubah state statusTab ke "all" | "dijadwalkan" | "selesai"
  const [statusTab, setStatusTab] = useState<"all" | "dijadwalkan" | "selesai">(
    "all"
  );

  const filteredData = useMemo(() => {
    let data = jadwalUjian.filter((ujian) => {
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
          .includes(filterNama.toLowerCase()) ||
        ujian.mahasiswa.nim
          .toLowerCase()
          .includes(filterNama.toLowerCase());

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
    filterNama,
    filterJenis,
    date,
    sortField,
    sortOrder,
    statusTab,
    completedIds,
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
  }, [filterNama, filterJenis]);

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
      header: "Penguji",
      cell: ({ row }: any) => {
        const penguji: Penguji[] = row.original.penguji || [];
        if (penguji.length === 0) return <span className="text-gray-400 text-xs">-</span>;

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm" className="h-7 text-xs gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-700">
                <Users size={12} />
                Lihat Penguji
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end">
              <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 border-b border-gray-100 dark:border-neutral-800">
                <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <Users size={14} className="text-blue-500" />
                  Tim Penguji
                </h4>
              </div>
              <div className="p-4 space-y-0">
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
                      className="relative pl-6 pb-4 border-l-2 border-gray-100 dark:border-neutral-800 last:border-0 last:pb-0"
                    >
                      {/* Dot Indicator */}
                      <div
                        className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-neutral-900
                            ${hadir ? "bg-emerald-500" : "bg-gray-300 dark:bg-neutral-600"}
                        `}
                      ></div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                          {p.nama ?? "-"}
                        </p>
                        <div className="flex items-center justify-between mt-1 gap-2">
                          <span className="text-xs text-gray-500 capitalize">
                            {label}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                              ${hadir
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                : "bg-gray-50 text-gray-500 border-gray-100 dark:bg-neutral-800 dark:text-gray-400 dark:border-neutral-700"
                              }
                            `}
                          >
                            {hadir ? "Hadir" : "Belum"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        );
      },
      size: 130,
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

  return (
    <DataCard>

      {/* Header bar: Search, Filter, View Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-4 w-full">
        <div className="relative flex-1 w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <Input
            placeholder="Cari berdasarkan Nama atau NIM"
            value={filterNama}
            onChange={(e) => setFilterNama(e.target.value)}
            className="pl-10 w-full bg-white dark:bg-neutral-800 h-10 lg:h-9"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">

          {/* Date Range Picker & Export PDF - Only for Kaprodi/Sekprodi */}
          {(userRole === "kaprodi" || userRole === "sekprodi") && (
            <>
              <div className={cn("grid gap-2")}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      size="sm"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal h-10 lg:h-9",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "dd LLL y", { locale: id })} -{" "}
                            {format(date.to, "dd LLL y", { locale: id })}
                          </>
                        ) : (
                          format(date.from, "dd LLL y", { locale: id })
                        )
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                size="sm"
                className="h-10 lg:h-9 gap-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700"
                onClick={handleExportPDF}
              >
                <FileDown size={14} />
                <span className="hidden sm:inline">Export PDF</span>
              </Button>
            </>
          )}



          {/* Tombol filter Jenis, Bulan, Tahun */}
          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            {/* ... Popover implementation remains SAME ... */}
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 w-10 lg:h-9 lg:w-9 flex items-center justify-center rounded-md"
              >
                <Settings2 size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 rounded-lg" align="end">
              <ScrollArea className="max-h-[300px] p-1">
                <div className="p-1">
                  <div className="font-semibold text-xs mb-2 text-muted-foreground px-2 pt-1">
                    Jenis Ujian
                  </div>
                  <div className="flex flex-col gap-1 mb-3">
                    {["all", "Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"].map(
                      (item) => (
                        <Button
                          key={item}
                          variant={filterJenis === item ? "secondary" : "ghost"}
                          size="sm"
                          className={`w-full justify-between rounded-md text-left ${filterJenis === item ? "font-semibold bg-accent text-accent-foreground" : ""
                            }`}
                          onClick={() => {
                            setFilterJenis(item);
                            setOpenFilter(false);
                          }}
                        >
                          <span className="text-sm">
                            {item === "all" ? "Semua" : item === "Ujian Proposal" ? "Seminar Proposal" : item}
                          </span>
                          {filterJenis === item && (
                            <Check size={14} className="ml-2" />
                          )}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tabs for status filtering */}
      <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as any)} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-muted p-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md px-3 text-sm">Semua</TabsTrigger>
            <TabsTrigger value="dijadwalkan" className="rounded-md px-3 text-sm">Dijadwalkan</TabsTrigger>
            <TabsTrigger value="selesai" className="rounded-md px-3 text-sm">Selesai</TabsTrigger>
          </TabsList>
        </div>

        {/* Content - Just TableGlobal */}
        <TabsContent value="all" className="mt-0">
          <TableGlobal table={table} cols={cols} />
        </TabsContent>
        <TabsContent value="dijadwalkan" className="mt-0">
          <TableGlobal table={table} cols={cols} />
        </TabsContent>
        <TabsContent value="selesai" className="mt-0">
          <TableGlobal table={table} cols={cols} />
        </TabsContent>
      </Tabs>

    </DataCard>
  )
}