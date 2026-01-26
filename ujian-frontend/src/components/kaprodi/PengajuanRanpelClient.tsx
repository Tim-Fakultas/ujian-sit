/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import TableGlobal from "@/components/tableGlobal";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import PDFPreviewModal from "../../app/(routes)/dosen/penilaian-ujian/PDFPreviewModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Eye,
  Search,
  ListFilter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Check,
  Calendar as CalendarIcon,
  X,
  MessageSquareText,
} from "lucide-react";
import { truncateTitle } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataCard } from "@/components/common/DataCard";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import StudentDetailModal from "@/components/common/StudentDetailModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import CatatanDialog from "./CatatanDialog";

export default function PengajuanTableClient({
  pengajuanRanpel,
}: {
  pengajuanRanpel: PengajuanRanpel[];
}) {
  // preview modal
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // modal state for student detail
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const handleStudentClick = (mahasiswaId: number) => {
    setSelectedStudentId(mahasiswaId);
    setIsStudentModalOpen(true);
  };

  // view mode + sorting state for react-table
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [sorting, setSorting] = React.useState<SortingState>([]);


  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAngkatan, setFilterAngkatan] = useState("all");
  const [date, setDate] = useState<DateRange | undefined>();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // Year range for slider
  const currentYear = new Date().getFullYear();
  const minYear = 2015;
  const maxYear = currentYear + 1;

  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "diterima", label: "Diterima" },
    { value: "diverifikasi", label: "Diverifikasi" },
    { value: "ditolak", label: "Ditolak" },
  ];

  const sortOptions = [
    { value: "tanggal:desc", label: "Tanggal terbaru" },
    { value: "tanggal:asc", label: "Tanggal terlama" },
    { value: "nama:asc", label: "Nama A–Z" },
    { value: "nama:desc", label: "Nama Z–A" },
  ];
  const isSortActive = (val: string) => {
    if (!sorting?.length) return false;
    const s = sorting[0] as any;
    return `${s.id}:${s.desc ? "desc" : "asc"}` === val;
  };
  const handleSortSelect = (val: string) => {
    if (val === "none") {
      setSorting([]);
      return;
    }
    const [id, order] = val.split(":");
    setSorting([{ id, desc: order === "desc" }]);
  };

  //* filtered data (global search across nama, judul, status, tanggal)
  const filteredData = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (pengajuanRanpel || []).filter((p) => {
      const nama = (p.mahasiswa?.nama ?? "").toLowerCase();
      const judul = (p.ranpel?.judulPenelitian ?? "").toLowerCase();
      const status = (p.status ?? "").toLowerCase();
      const tanggal = (p.tanggalPengajuan ?? "").toString().toLowerCase();
      const angkatan = (p.mahasiswa?.angkatan ?? "").toString();

      const statusMatch =
        filterStatus === "all" ? true : status === filterStatus;
      const angkatanMatch =
        filterAngkatan === "all" ? true : angkatan === filterAngkatan;

      let dateMatch = true;
      if (date?.from) {
        const itemDate = new Date(tanggal);
        // Reset time to 00:00:00 for accurate date comparison
        const fromDate = new Date(date.from);
        fromDate.setHours(0, 0, 0, 0);

        if (date.to) {
          const toDate = new Date(date.to);
          toDate.setHours(23, 59, 59, 999);
          dateMatch = itemDate >= fromDate && itemDate <= toDate;
        } else {
          dateMatch = itemDate >= fromDate;
        }
      }

      const qEmpty = q === "";
      const matchesQ =
        qEmpty ||
        nama.includes(q) ||
        judul.includes(q) ||
        status.includes(q) ||
        tanggal.includes(q);
      return matchesQ && statusMatch && angkatanMatch && dateMatch;
    });
  }, [pengajuanRanpel, search, filterStatus, filterAngkatan, date]);

  // table state (sorting state already declared above)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // handlers
  const handleLihatClick = React.useCallback((p: PengajuanRanpel) => {
    setSelectedPengajuan(p);
    setIsModalOpen(true);
  }, []);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPengajuan(null);
  };

  // columns
  const cols: ColumnDef<PengajuanRanpel>[] = useMemo(
    () => [

      {
        id: "no",
        header: "No",
        cell: ({ row, table }) => {
          const index =
            (table.getState().pagination?.pageIndex ?? 0) *
            (table.getState().pagination?.pageSize ?? 10) +
            row.index +
            1;
          return <div className="text-center">{index}</div>;
        },
      },
      {
        accessorFn: (row) => row.mahasiswa?.nama ?? "-",
        id: "nama",
        header: () => (
          <div className="flex items-center gap-1">
            <span>Mahasiswa</span>
          </div>
        ),
        cell: ({ row }) => (
          <div
            className="flex flex-col cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors group"
            onClick={() => {
              if (row.original.mahasiswa?.id) {
                handleStudentClick(row.original.mahasiswa.id);
              }
            }}
          >
            <span
              className="font-medium max-w-[140px] truncate text-blue-600 group-hover:text-blue-800 transition-colors"
              title={String(row.getValue("nama"))}
            >
              {String(row.getValue("nama"))}
            </span>
            <span className="text-xs text-muted-foreground group-hover:text-gray-600">
              {row.original.mahasiswa?.nim ?? "-"}
            </span>
          </div>
        ),
      },
      {
        accessorFn: (row) => row.ranpel?.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul",
        cell: ({ row }) => (
          <div
            className="max-w-[200px] truncate"
            title={String(row.getValue("judul"))}
          >
            {truncateTitle(String(row.getValue("judul")), 40)}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.tanggalPengajuan ?? "",
        id: "tanggal",
        header: () => <div className="text-center">Tanggal Pengajuan</div>,
        cell: ({ row }) => {
          const val = row.getValue("tanggal") as string;
          try {
            return (
              <div className="text-center">
                {new Date(val).toLocaleDateString("id-ID")}
              </div>
            );
          } catch {
            return <div className="text-center">{val}</div>;
          }
        },
      },
      {
        id: "tanggalKeputusan",
        header: () => <div className="text-center">Tanggal Diterima / Ditolak</div>,
        cell: ({ row }) => {
          const status = row.original.status;
          let dateVal = null;

          if (status === "diterima") dateVal = row.original.tanggalDiterima;
          else if (status === "ditolak") dateVal = row.original.tanggalDitolak;

          if (!dateVal) return <div className="text-center">-</div>;

          try {
            return (
              <div className="text-center">
                {new Date(dateVal).toLocaleDateString("id-ID")}
              </div>
            );
          } catch {
            return <div className="text-center">-</div>;
          }
        },
      },
      {
        accessorFn: (row) => row.status ?? "-",
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = String(row.getValue("status"));
          const cls =
            s === "menunggu"
              ? "bg-yellow-100 text-yellow-800"
              : s === "diterima"
                ? "bg-green-100 text-green-800"
                : s === "ditolak"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800";
          return (
            <span className={`px-2 py-1 rounded text-sm ${cls}`}>{s}</span>
          );
        },
      },
      {
        id: "catatan",
        header: () => <div className="text-center">Catatan</div>,
        cell: ({ row }) => {
          return (
            <div className="flex justify-center">
              <CatatanDialog pengajuan={row.original} />
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                onClick={() => handleLihatClick(item)}
              >
                <Eye size={18} />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleLihatClick]
  );

  const table = useReactTable({
    data: filteredData,
    columns: cols,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // reset page when search/filter change
  // reset page when search/filter change
  useEffect(() => {
    try {
      table.setPageIndex?.(0);
    } catch { }
  }, [search, filterStatus, filterAngkatan]); // eslint-disable-line

  return (
    <>
      <DataCard>
        {/* Header */}

        {/* Controls: search, status filter (with colored dots), sort dropdown, view tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-muted-foreground" />
              </div>
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 bg-white dark:bg-neutral-800"
              />
            </div>
          </div>

          {/* Unified Filter Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 border-dashed gap-2"
              >
                <ListFilter size={16} />
                <span className="text-sm font-medium">Filter</span>
                {(filterStatus !== "all" ||
                  filterAngkatan !== "all" ||
                  date) && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {(filterStatus !== "all" ? 1 : 0) +
                        (filterAngkatan !== "all" ? 1 : 0) +
                        (date ? 1 : 0)}
                    </span>
                  )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" side="top" className="w-[320px] p-4">
              <ScrollArea className="h-80 -mr-4 pr-4">
                <div className="space-y-4">
                  {/* Header & Reset */}
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-semibold leading-none">Filter Data</h4>
                    {(filterStatus !== "all" ||
                      filterAngkatan !== "all" ||
                      date) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFilterStatus("all");
                            setFilterAngkatan("all");
                            setDate(undefined);
                          }}
                          className="h-auto px-2 py-0 text-xs text-muted-foreground hover:text-red-500"
                        >
                          Reset
                        </Button>
                      )}
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Status Pengajuan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {statusOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => setFilterStatus(opt.value)}
                          className={`
                          cursor-pointer rounded-md border px-3 py-2 text-xs font-medium transition-all
                          flex items-center gap-2
                          ${filterStatus === opt.value
                              ? "bg-primary/5 border-primary text-primary"
                              : "hover:bg-muted/50 border-transparent bg-muted/20"
                            }
                        `}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${opt.value === "menunggu"
                              ? "bg-yellow-500"
                              : opt.value === "diterima"
                                ? "bg-green-500"
                                : opt.value === "ditolak"
                                  ? "bg-red-500"
                                  : opt.value === "diverifikasi"
                                    ? "bg-blue-500"
                                    : "bg-gray-400"
                              }`}
                          />
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Angkatan Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-muted-foreground">
                        Tahun Angkatan
                      </label>
                      <span className="text-xs font-bold">
                        {filterAngkatan === "all" ? "Semua" : filterAngkatan}
                      </span>
                    </div>
                    <Slider
                      min={minYear}
                      max={maxYear}
                      step={1}
                      value={[
                        filterAngkatan === "all"
                          ? minYear
                          : parseInt(filterAngkatan),
                      ]}
                      onValueChange={(val) => setFilterAngkatan(String(val[0]))}
                      className="py-1 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                      <span>{minYear}</span>
                      <span>{maxYear}</span>
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Tanggal Pengajuan
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsDateModalOpen(true);
                        // We can close the popover here if we want, but typically 
                        // the date modal will appear on top.
                      }}
                      className={`w-full justify-start text-left font-normal h-9 ${!date && "text-muted-foreground"
                        }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "dd/MM/y")} -{" "}
                            {format(date.to, "dd/MM/y")}
                          </>
                        ) : (
                          format(date.from, "dd/MM/y")
                        )
                      ) : (
                        "Pilih rentang tanggal"
                      )}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>



          {/* view tabs */}
          <div>
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "table" | "card")}
              className="h-8"
            >
              <TabsList className="rounded-md bg-muted p-1 gap-1">
                <TabsTrigger value="table" className="h-7 px-2 rounded-md">
                  <LayoutGrid size={14} />
                </TabsTrigger>
                <TabsTrigger value="card" className="h-7 px-2 rounded-md">
                  <List size={14} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Table or Card view */}
        {filteredData.length === 0 ? (
          <div className="p-6 flex flex-col items-center justify-center gap-3">
            <div className="text-sm text-muted-foreground text-center">
              Tidak ada data pengajuan rancangan penelitian.
            </div>
            <div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFilterStatus("all");
                  setFilterAngkatan("all");
                  setDate(undefined);
                  setSearch("");
                }}
              >
                Reset filter
              </Button>
            </div>
          </div>
        ) : viewMode === "table" ? (
          <TableGlobal table={table} cols={cols} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredData.map((item, idx) => {
              const key = (item as any).id ?? idx;
              const nama = item.mahasiswa?.nama ?? "-";
              const nim = item.mahasiswa?.nim ?? "-";
              const judul = item.ranpel?.judulPenelitian ?? "-";
              const tanggal = item.tanggalPengajuan ?? "";
              const status = item.status ?? "-";

              const statusColor =
                status === "menunggu"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
                  : status === "diterima"
                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                    : status === "ditolak"
                      ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                      : status === "diverifikasi"
                        ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                        : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-neutral-800 dark:text-gray-400";

              return (
                <div
                  key={key}
                  className={`group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}
                >
                  <div className="p-5 flex flex-col gap-4 flex-1">
                    {/* Header: Date & Status */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <CalendarIcon size={13} />
                        <span>
                          {new Date(String(tanggal)).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Content: Title & Name */}
                    <div className="space-y-2">
                      <h3
                        className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-3"
                        title={judul}
                      >
                        {judul || "Judul tidak tersedia"}
                      </h3>

                      <div className="flex items-center gap-2 pt-1 border-t border-gray-50 dark:border-neutral-800 mt-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 mt-2">
                          {nama.charAt(0)}
                        </div>
                        <div className="flex flex-col mt-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                            {nama}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {nim}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLihatClick(item)}
                      className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    >
                      <Eye size={14} className="mr-1.5" /> Preview
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DataCard>

      {/* PDF Preview Modal */}
      {selectedPengajuan && (
        <PDFPreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pengajuan={selectedPengajuan}
        />
      )}

      {/* Custom Date Picker Modal */}
      {isDateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsDateModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Modal Content */}
          <div
            className="relative bg-white dark:bg-zinc-950 rounded-lg shadow-xl max-w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsDateModalOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            {/* Modal Body */}
            <div className="p-6">
              <div className="pb-4 border-b mb-4">
                <h2 className="text-lg font-semibold">Pilih Rentang Tanggal</h2>
              </div>
              <div className="flex justify-center">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  pagedNavigation
                  showOutsideDays={false}
                  className="p-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        mahasiswaId={selectedStudentId}
      />
    </>
  );
}
