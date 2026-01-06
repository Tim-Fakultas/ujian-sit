/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import TableGlobal from "@/components/tableGlobal";
import { showToast } from "@/components/ui/custom-toast";

import { useState, useEffect, useReducer, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pencil,
  Eye,
  SearchIcon,
  MoreHorizontal,
  Check,
  NotebookPen,
  Gavel,
  Settings2,
  LayoutGrid,
  List,
  Calendar,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import { IconClipboardText } from "@tabler/icons-react";
import { UserCheck } from "lucide-react";
import PenilaianModal from "./PenilaianModal";

import { Button } from "../../../../components/ui/button";
import { getHadirUjian, setHadirUjian } from "@/actions/daftarHadirUjian";
import { Input } from "../../../../components/ui/input";
import { getPenilaianByUjianId } from "@/actions/penilaian";
import { postCatatanByUjianId } from "@/actions/catatan";
import { postKeputusanByUjianId } from "@/actions/keputusan";
import { getAllPenilaian } from "@/actions/penilaian";
import CatatanSheet from "./CatatanSheet";
import KeputusanSheet from "./KeputusanSheet";
import { Dosen } from "@/types/Dosen";
import { PenilaianItem } from "@/types/Penilaian";
import { HadirUjian } from "@/types/DaftarKehadiran";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DaftarHadirDialog from "./DaftarHadirDialog";
import {
  getPengujiList,
  getPeranPenguji,
  sudahHadir,
} from "@/lib/ujian/helpers";
import { JadwalUjianTableProps } from "@/types/props/Ujian";
import { modalReducer, initialModalState } from "./jadwalUjianModalReducer";
import {
  getPeranPengujiClass,
  getStatusUjianClass,
  keputusanOptions,
  peranPengujiOptions,
} from "@/lib/ujian/constants";
import DetailDialog from "./DetailDialog";
import RekapitulasiNilaiModal from "./RekapitulasiNilaiModal";
import { DataCard } from "@/components/common/DataCard";

function ActionCell({
  ujian,
  dispatchModal,
  currentDosenId,
  hadirData,
}: {
  ujian: any;
  dispatchModal: any;
  currentDosenId: any;
  hadirData: HadirUjian[];
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Aksi"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-all"
          >
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          className="w-56 p-2 rounded-xl border border-muted/20 shadow-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
        >
          <div className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1.5 mb-1">
            Menu Aksi
          </div>
          <DropdownMenuItem
            onClick={() => dispatchModal({ type: "OPEN_DETAIL", ujian })}
            className="cursor-pointer group flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:bg-primary/10 focus:text-primary hover:bg-primary/10 hover:text-primary hover:translate-x-1"
          >
            <Eye
              size={18}
              className="text-muted-foreground/70 group-hover:text-primary group-focus:text-primary transition-colors"
            />
            Detail ujian
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => dispatchModal({ type: "OPEN_DAFTAR_HADIR", ujian })}
            className="cursor-pointer group flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:bg-primary/10 focus:text-primary hover:bg-primary/10 hover:text-primary hover:translate-x-1"
          >
            <UserCheck
              size={18}
              className="text-muted-foreground/70 group-hover:text-primary group-focus:text-primary transition-colors"
            />
            Absensi Kehadiran
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => dispatchModal({ type: "OPEN_PENILAIAN", ujian })}
            className="cursor-pointer group flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:bg-primary/10 focus:text-primary hover:bg-primary/10 hover:text-primary hover:translate-x-1"
          >
            <Pencil
              size={18}
              className="text-muted-foreground/70 group-hover:text-primary group-focus:text-primary transition-colors"
            />
            Penilaian
          </DropdownMenuItem>
          {/* role check */}
          {(() => {
            const roleSaya = ujian.penguji?.find(
              (p: any) => p.id === Number(currentDosenId)
            )?.peran;
            const isKetua = roleSaya === "ketua_penguji";
            const isSekretaris = roleSaya === "sekretaris_penguji";

            // cek sekretaris hadir
            const sekretaris = ujian.penguji?.find(
              (p: any) => p.peran === "sekretaris_penguji"
            );
            const sekretarisId = sekretaris?.id;
            const isSekretarisHadir = sekretarisId
              ? sudahHadir(ujian.id, sekretarisId, hadirData)
              : false;

            // Logic Catatan:
            // 1. Sekretaris: selalu boleh
            // 2. Ketua: boleh HANYA JIKA sekretaris tidak hadir
            const canAccessCatatan =
              isSekretaris || (isKetua && !isSekretarisHadir);
            const isMenuVisible = isKetua || isSekretaris;

            const jenis = ujian.jenisUjian?.namaJenis ?? "";
            const isJenisUntukKeputusan =
              jenis === "Ujian Hasil" || jenis === "Ujian Skripsi";

            return (
              isMenuVisible && (
                <>
                  <div className="h-[1px] bg-muted/20 my-1 mx-2" />
                  {/* Wrap disabled item in tooltip (or conditional rendering) */}
                  {!canAccessCatatan ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full">
                            <DropdownMenuItem
                              disabled
                              className="cursor-pointer group flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
                            >
                              <NotebookPen
                                size={18}
                                className="text-muted-foreground/70"
                              />
                              Catatan
                            </DropdownMenuItem>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-[200px]">
                          Sekretaris Penguji sedang hadir. Pengisian catatan
                          dilakukan oleh Sekretaris.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <DropdownMenuItem
                      onClick={() =>
                        dispatchModal({ type: "OPEN_CATATAN", ujian })
                      }
                      className="cursor-pointer group flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:bg-primary/10 focus:text-primary hover:bg-primary/10 hover:text-primary hover:translate-x-1"
                    >
                      <NotebookPen
                        size={18}
                        className="text-muted-foreground/70 group-hover:text-primary group-focus:text-primary transition-colors"
                      />
                      Catatan
                    </DropdownMenuItem>
                  )}
                  {isJenisUntukKeputusan && (
                    <DropdownMenuItem
                      onClick={() => {
                        const initId =
                          (ujian as any).keputusanId ??
                          keputusanOptions.find((o) => o.label === ujian.hasil)
                            ?.id ??
                          null;
                        dispatchModal({
                          type: "OPEN_KEPUTUSAN",
                          ujian,
                          keputusanChoice: initId,
                        });
                      }}
                      className="cursor-pointer group flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:bg-primary/10 focus:text-primary hover:bg-primary/10 hover:text-primary hover:translate-x-1"
                    >
                      <Gavel
                        size={18}
                        className="text-muted-foreground/70 group-hover:text-primary group-focus:text-primary transition-colors"
                      />
                      <span className="mr-2">Keputusan</span>
                    </DropdownMenuItem>
                  )}
                </>
              )
            );
          })()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function PenilaianUjianTable({
  jadwalUjian,
  currentDosenId,
}: JadwalUjianTableProps) {
  const [dataUjian, setDataUjian] = useState(jadwalUjian);

  useEffect(() => {
    setDataUjian(jadwalUjian);
  }, [jadwalUjian]);

  const [modal, dispatchModal] = useReducer(modalReducer, initialModalState);
  const [hadirLoading, setHadirLoading] = useState<number | null>(null);

  const [rekapPenilaian, setRekapPenilaian] = useState<PenilaianItem[]>([]);
  const [rekapLoading, setRekapLoading] = useState(false);
  const [hadirData, setHadirData] = useState<HadirUjian[]>([]);
  const [catatanText, setCatatanText] = useState<string>("");

  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  async function handleHadir(currentDosenId: number, ujianId: number) {
    setHadirLoading(ujianId);
    try {
      await setHadirUjian(currentDosenId, ujianId);
      setHadirData((prev) => [
        ...prev,
        {
          ujianId,
          dosenId: currentDosenId,
          statusKehadiran: "hadir",
        } as HadirUjian,
      ]);
      showToast.success("Kehadiran Anda telah tercatat.");
    } catch (err) {
      console.error("Error mencatat kehadiran:", err);
      showToast.error("Terjadi kesalahan saat mencatat kehadiran.");
    } finally {
      setHadirLoading(null);
    }
  }

  const [filterPeran, setFilterPeran] = useState("all");
  const [search, setSearch] = useState("");
  const [filterJenisUjian, setFilterJenisUjian] = useState("all");

  const jenisUjianList = ["Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"];

  const filteredData = dataUjian.filter((ujian) => {
    let matchPeran = true;
    if (filterPeran !== "all") {
      const peran = getPeranPenguji(ujian, currentDosenId);
      matchPeran = peran === filterPeran;
    }
    let matchJenis = true;
    if (filterJenisUjian !== "all") {
      matchJenis = ujian.jenisUjian?.namaJenis === filterJenisUjian;
    }
    const q = search.toLowerCase();
    const matchSearch =
      (ujian.mahasiswa?.nama?.toLowerCase() ?? "").includes(q) ||
      (ujian.judulPenelitian?.toLowerCase() ?? "").includes(q) ||
      (ujian.ruangan?.namaRuangan?.toLowerCase() ?? "").includes(q);
    return matchPeran && matchJenis && matchSearch;
  });

  useEffect(() => {
    getHadirUjian().then((data) => setHadirData(data ?? []));
  }, []); //

  useEffect(() => {
    if (modal.openRekapitulasi && modal.selected?.id) {
      setRekapLoading(true);
      getPenilaianByUjianId(modal.selected.id)
        .then((data) => {
          // Group by dosenId
          const group: Record<
            number,
            { dosen: Dosen; jabatan: string; total: number }
          > = {};

          data.forEach((item: any) => {
            // Tentukan jabatan dosen
            const pengujiFound = modal?.selected?.penguji.find(
              (p) => p.id === item.dosenId
            );

            let jabatan = "-";
            if (pengujiFound) {
              switch (pengujiFound.peran) {
                case "ketua_penguji":
                  jabatan = "Ketua Penguji";
                  break;
                case "sekretaris_penguji":
                  jabatan = "Sekretaris Penguji";
                  break;
                case "penguji_1":
                  jabatan = "Penguji I";
                  break;
                case "penguji_2":
                  jabatan = "Penguji II";
                  break;
              }
            }

            // Hitung bobot * nilai / 100
            const bobot = item.komponenPenilaian?.bobot ?? 0;
            const nilai = item.nilai ?? 0;
            const subtotal = (nilai * bobot) / 100;
            if (!group[item.dosenId]) {
              group[item.dosenId] = {
                dosen: item.dosen,
                jabatan,
                total: 0,
              };
            }
            group[item.dosenId].total += subtotal;
          });

          // Convert to array & urutkan sesuai jabatan
          const jabatanOrder = [
            "Ketua Penguji",
            "Sekretaris Penguji",
            "Penguji I",
            "Penguji II",
          ];
          const arr = Object.values(group).sort(
            (a, b) =>
              jabatanOrder.indexOf(a.jabatan) - jabatanOrder.indexOf(b.jabatan)
          );
          setRekapPenilaian(arr);
        })
        .finally(() => setRekapLoading(false));
    } else {
      setRekapPenilaian([]);
    }
  }, [modal.openRekapitulasi, modal.selected]);

  useEffect(() => {
    if (modal.openCatatan && modal.selected) {
      setCatatanText(modal.selected.catatan ?? "");
    }
  }, [modal.openCatatan, modal.selected]);

  const handleSaveCatatan = async () => {
    try {
      await postCatatanByUjianId(modal.selected?.id ?? null, catatanText);

      // Update local state 'dataUjian' so the change is reflected immediately
      setDataUjian((prev) =>
        prev.map((u) =>
          u.id === modal.selected?.id ? { ...u, catatan: catatanText } : u
        )
      );

      showToast.success("Catatan disimpan.");
      dispatchModal({ type: "CLOSE_CATATAN" });
    } catch (e) {
      console.error(e);
      showToast.error("Gagal menyimpan catatan.");
    }
  };

  // keputusanId adalah numeric (1..4). UI tetap menampilkan teks label.
  const handleSetKeputusan = async (ujianId: number, keputusanId: number) => {
    // cari label untuk ditampilkan
    const opt = keputusanOptions.find((o) => o.id === keputusanId);
    const label = opt ? opt.label : String(keputusanId);

    // optimistik update selected: simpan hasil sebagai label (tampilan tetap string) dan simpan keputusanId
    if (modal.selected) {
      dispatchModal({
        type: "OPEN_KEPUTUSAN",
        ujian: { ...modal.selected, hasil: label },
        keputusanChoice: keputusanId,
      });
    }

    try {
      await postKeputusanByUjianId(ujianId, keputusanId);
      showToast.success("Keputusan berhasil disimpan.");
    } catch (err) {
      console.error("Gagal menyimpan keputusan:", err);
      showToast.error("Gagal menyimpan keputusan.");
    }
  };

  const [penilaianMap, setPenilaianMap] = useState<Record<number, Set<number>>>(
    {}
  );
  const [loadingPenilaianMap, setLoadingPenilaianMap] = useState(true);

  // Fetch all penilaian once
  useEffect(() => {
    let mounted = true;
    getAllPenilaian().then((data) => {
      if (mounted) {
        // Build map: ujianId -> Set of dosenIds
        const map: Record<number, Set<number>> = {};
        if (Array.isArray(data)) {
          data.forEach((p: any) => {
            if (!map[p.ujianId]) {
              map[p.ujianId] = new Set();
            }
            map[p.ujianId].add(p.dosenId);
          });
        }
        setPenilaianMap(map);
        setLoadingPenilaianMap(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Table columns for TableGlobal
  const cols = [
    {
      id: "no",
      header: () => <div className="text-center">No</div>,
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
      accessorFn: (row: any) => row.mahasiswa?.nama ?? "-",
      id: "nama",
      header: "Nama Mahasiswa",
      cell: ({ row }: any) => <div>{row.getValue("nama")}</div>,
      size: 120,
    },
    {
      accessorFn: (row: any) => row.jenisUjian?.namaJenis ?? "-",
      id: "jenis",
      header: "Jenis Ujian",
      cell: ({ row }: any) => (
        <span
          className={`px-2 py-1 rounded font-semibold ${
            row.original.jenisUjian?.namaJenis === "Ujian Proposal"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
              : row.original.jenisUjian?.namaJenis === "Ujian Hasil"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
              : row.original.jenisUjian?.namaJenis === "Ujian Skripsi"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
          }`}
        >
          {row.getValue("jenis")}
        </span>
      ),
      size: 90,
    },

    {
      accessorFn: (row: any) => {
        const peran = getPeranPenguji(row, currentDosenId);
        return peran ?? "-";
      },
      id: "peran",
      header: "Peran Anda",
      cell: ({ row }: any) => {
        const peranPenguji = row.getValue("peran");
        return (
          <span
            className={`px-2 py-1 rounded font-semibold ${getPeranPengujiClass(
              peranPenguji
            )}`}
          >
            {peranPenguji}
          </span>
        );
      },
      size: 90,
    },
    {
      accessorFn: (row: any) => row.nilaiAkhir ?? "-",
      id: "nilai",
      header: () => (
        <div className="flex items-center justify-center gap-1">
          Nilai Akhir
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle size={14} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-center">
                  Nilai ini merupakan total keseluruhan dari penilaian seluruh
                  penguji, bukan per dosen.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: ({ row }: any) => (
        <div className="text-center">{row.getValue("nilai")}</div>
      ),
      size: 70,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Aksi</div>,
      cell: ({ row }: any) => (
        <ActionCell
          ujian={row.original}
          dispatchModal={dispatchModal}
          currentDosenId={currentDosenId}
          hadirData={hadirData}
        />
      ),
      size: 90,
    },
  ];

  // Component to display evaluation status of each examiner for a specific exam
  function StatusPenilaianPenguji({
    ujianId,
    penguji,
    onOpenRekap,
    submittedDosenIds,
  }: {
    ujianId: number;
    penguji: any[];
    onOpenRekap: () => void;
    submittedDosenIds: Set<number>;
  }) {
    if (loadingPenilaianMap)
      return (
        <div className="text-xs text-muted-foreground animate-pulse">
          Menunggu...
        </div>
      );

    return (
      <div className="flex items-center justify-center gap-3">
        <div className="flex -space-x-2 overflow-hidden items-center justify-center">
          {penguji.map((p) => {
            const isDone = submittedDosenIds?.has(p.id) ?? false;
            return (
              <TooltipProvider key={p.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white dark:ring-neutral-900 text-[10px] font-bold cursor-help
                        ${
                          isDone
                            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-gray-500"
                        }
                      `}
                    >
                      {isDone ? <Check size={14} /> : p.nama.charAt(0)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      <span className="font-bold">{p.nama}</span>
                      <br />
                      Status: {isDone ? "Sudah Menilai" : "Belum Menilai"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenRekap}
                className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              >
                <Eye size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Lihat detail nilai semua penguji</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Inject the new column before 'nilai' or wherever appropriate
  // Inserting at index 4 (Status Penguji)
  if (!cols.find((c) => c.id === "status_penguji")) {
    const statusCol = {
      id: "status_penguji",
      header: () => <div className="text-center">Nilai penguji</div>,
      cell: ({ row }: any) => (
        <StatusPenilaianPenguji
          ujianId={row.original.id}
          penguji={row.original.penguji || []}
          onOpenRekap={() =>
            dispatchModal({ type: "OPEN_REKAP", ujian: row.original })
          }
          submittedDosenIds={penilaianMap[row.original.id] || new Set()}
        />
      ),
      size: 160,
    };

    // Insert before 'nilai' column which is currently at index 3 (0-based: no, nama, jenis, peran, nilai, actions)
    // Current indices: 0:no, 1:nama, 2:jenis, 3:peran, 4:nilai, 5:actions
    // We want it after 'peran'
    const peranIndex = cols.findIndex((c) => c.id === "peran");
    if (peranIndex !== -1) {
      cols.splice(peranIndex + 1, 0, statusCol as any);
    }
  }

  // TableGlobal setup
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

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
    getPageCount: () => totalPage,
    setPageIndex: (index: number) => setPage(index + 1),
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
  };

  return (
    <DataCard>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-4 w-full">
        {/* Search bar */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={16} className="text-muted-foreground" />
          </div>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 bg-white dark:bg-neutral-800"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 flex items-center justify-center rounded-md"
                aria-label="Filter"
              >
                <Settings2 size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="min-w-[150px] w-[200px] p-3 rounded-xl border border-muted shadow-lg bg-white dark:bg-neutral-800 max-h-[300px] overflow-y-auto"
            >
              <div className="mb-2 text-xs font-semibold text-muted-foreground">
                Peran Anda
              </div>
              <div className="flex flex-col gap-1">
                {peranPengujiOptions.map((item) => (
                  <Button
                    key={item.value}
                    variant={filterPeran === item.value ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-between rounded-md"
                    onClick={() => setFilterPeran(item.value)}
                  >
                    <span>{item.label}</span>
                    {filterPeran === item.value && <Check size={16} />}
                  </Button>
                ))}
              </div>
              <div className="mt-4 mb-2 text-xs font-semibold text-muted-foreground border-t pt-2">
                Jenis Ujian
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  variant={filterJenisUjian === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-between rounded-md"
                  onClick={() => setFilterJenisUjian("all")}
                >
                  <span>Semua</span>
                  {filterJenisUjian === "all" && <Check size={16} />}
                </Button>
                {jenisUjianList.map((jenis) => (
                  <Button
                    key={jenis}
                    variant={filterJenisUjian === jenis ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-between rounded-md"
                    onClick={() => setFilterJenisUjian(jenis)}
                  >
                    <span>{jenis}</span>
                    {filterJenisUjian === jenis && <Check size={16} />}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "table" | "card")}
            className="h-9"
          >
            <TabsList className="rounded-md bg-muted p-1 gap-1 h-9">
              <TabsTrigger
                value="table"
                className="inline-flex items-center gap-2 h-7 px-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-foreground shadow-sm"
                aria-label="Table view"
              >
                <LayoutGrid size={16} />
              </TabsTrigger>
              <TabsTrigger
                value="card"
                className="inline-flex items-center gap-2 h-7 px-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-foreground shadow-sm"
                aria-label="Card view"
              >
                <List size={16} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs
        value={viewMode}
        onValueChange={(v) => setViewMode(v as "table" | "card")}
      >
        <TabsContent value="table">
          <TableGlobal table={table} cols={cols} />
        </TabsContent>

        <TabsContent value="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-8">
                Tidak ada jadwal ujian
              </div>
            ) : (
              filteredData.map((ujian) => {
                const waktuMulai = ujian.waktuMulai?.slice(0, 5) ?? "-";
                const waktuSelesai = ujian.waktuSelesai?.slice(0, 5) ?? "-";
                const tanggal = ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-";
                function capitalize(str: string) {
                  return str.charAt(0).toUpperCase() + str.slice(1);
                }
                const peranPenguji = getPeranPenguji(ujian, currentDosenId);
                const resultStatus = ujian.hasil ?? "-";

                // Format Date
                const tanggalObj = ujian.jadwalUjian
                  ? new Date(ujian.jadwalUjian)
                  : null;
                const tanggalStr = tanggalObj
                  ? tanggalObj.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-";

                let statusColor =
                  "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
                if (resultStatus.toLowerCase() === "lulus")
                  statusColor =
                    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
                else if (resultStatus.toLowerCase() === "tidak lulus")
                  statusColor =
                    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";

                return (
                  <div
                    key={ujian.id}
                    className={`group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}
                  >
                    <div className="p-5 flex flex-col gap-4 flex-1">
                      {/* Header: Date & Result Status */}
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            {ujian.jenisUjian?.namaJenis ?? "-"}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                            <Calendar size={13} />
                            <span>
                              {capitalize(ujian.hariUjian ?? "-")}, {tanggalStr}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}
                        >
                          {resultStatus}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2"
                        title={ujian.judulPenelitian}
                      >
                        {ujian.judulPenelitian || "Judul tidak tersedia"}
                      </h3>

                      {/* Details */}
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold text-xs bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-gray-500">
                            Mahasiswa
                          </span>
                          <span className="truncate">
                            {ujian.mahasiswa?.nama ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold text-xs bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-gray-500">
                            Peran
                          </span>
                          <span
                            className={`text-xs font-bold ${getPeranPengujiClass(
                              peranPenguji ?? undefined
                            )} px-1.5 py-0.5 rounded`}
                          >
                            {peranPenguji ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold text-xs bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-gray-500">
                            Nilai
                          </span>
                          <span className="font-bold">
                            {ujian.nilaiAkhir ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>
                            {waktuMulai} - {waktuSelesai}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                          >
                            <MoreHorizontal size={14} className="mr-1.5" /> Aksi
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              dispatchModal({ type: "OPEN_DETAIL", ujian })
                            }
                            className=""
                          >
                            <Eye size={16} className="mr-2" /> Detail
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              dispatchModal({
                                type: "OPEN_DAFTAR_HADIR",
                                ujian,
                              })
                            }
                          >
                            <UserCheck size={16} className="mr-2" /> Daftar
                            Hadir
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              dispatchModal({
                                type: "OPEN_PENILAIAN",
                                ujian,
                              })
                            }
                          >
                            <Pencil size={16} className="mr-2" /> Penilaian
                          </DropdownMenuItem>
                          {/* role check */}
                          {(() => {
                            const isKetuaAtauSek = ujian.penguji?.some(
                              (p) =>
                                p.id === Number(currentDosenId) &&
                                (p.peran === "ketua_penguji" ||
                                  p.peran === "sekretaris_penguji")
                            );
                            const jenis = ujian.jenisUjian?.namaJenis ?? "";
                            const isJenisUntukKeputusan =
                              jenis === "Ujian Hasil" ||
                              jenis === "Ujian Skripsi";
                            return (
                              isKetuaAtauSek && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      dispatchModal({
                                        type: "OPEN_CATATAN",
                                        ujian,
                                      })
                                    }
                                  >
                                    <NotebookPen size={16} className="mr-2" />{" "}
                                    Catatan
                                  </DropdownMenuItem>
                                  {isJenisUntukKeputusan && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        const initId =
                                          (ujian as any).keputusanId ??
                                          keputusanOptions.find(
                                            (o) => o.label === ujian.hasil
                                          )?.id ??
                                          null;
                                        dispatchModal({
                                          type: "OPEN_KEPUTUSAN",
                                          ujian,
                                          keputusanChoice: initId,
                                        });
                                      }}
                                    >
                                      <Gavel size={16} className="mr-2" />{" "}
                                      <span className="mr-2">Keputusan</span>
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )
                            );
                          })()}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>

        {modal.openDetail && modal.selected && (
          <DetailDialog dispatchModal={dispatchModal} ujian={modal.selected} />
        )}
        {modal.openRekapitulasi && modal.selected && (
          <RekapitulasiNilaiModal
            dispatchModal={dispatchModal}
            ujian={modal.selected}
            rekapPenilaian={rekapPenilaian}
            rekapLoading={rekapLoading}
          />
        )}
        <DaftarHadirDialog
          openDaftarHadir={modal.openDaftarHadir}
          setOpenDaftarHadir={(open) =>
            open && modal.selected
              ? dispatchModal({
                  type: "OPEN_DAFTAR_HADIR",
                  ujian: modal.selected!,
                })
              : dispatchModal({ type: "CLOSE_DAFTAR_HADIR" })
          }
          ujian={modal.selected!}
          getPengujiList={getPengujiList}
          sudahHadir={(ujianId, dosenId) =>
            sudahHadir(ujianId, dosenId, hadirData)
          }
          handleHadir={handleHadir}
          hadirLoading={hadirLoading}
          currentDosenId={currentDosenId ?? null}
        />
        {modal.selected && (
          <PenilaianModal
            open={modal.openPenilaian}
            onClose={() => dispatchModal({ type: "CLOSE_PENILAIAN" })}
            ujian={modal.selected}
            currentDosenId={currentDosenId}
            onSuccess={(dosenId) => {
              if (modal.selected?.id) {
                setPenilaianMap((prev) => {
                  const newMap = { ...prev };
                  if (!newMap[modal.selected!.id]) {
                    newMap[modal.selected!.id] = new Set();
                  }
                  newMap[modal.selected!.id] = new Set(
                    newMap[modal.selected!.id]
                  );
                  newMap[modal.selected!.id].add(dosenId);
                  return newMap;
                });
              }
            }}
          />
        )}
        <CatatanSheet
          openCatatan={modal.openCatatan}
          setOpenCatatan={(open) =>
            open && modal.selected
              ? dispatchModal({ type: "OPEN_CATATAN", ujian: modal.selected })
              : dispatchModal({ type: "CLOSE_CATATAN" })
          }
          selected={modal.selected}
          ujian={modal.selected!}
          catatanText={catatanText}
          setCatatanText={setCatatanText}
          handleSaveCatatan={handleSaveCatatan}
        />
        {modal.selected && (
          <KeputusanSheet
            openKeputusan={modal.openKeputusan}
            setOpenKeputusan={(open) =>
              open
                ? dispatchModal({
                    type: "OPEN_KEPUTUSAN",
                    ujian: modal.selected!,
                    keputusanChoice: modal.keputusanChoice,
                  })
                : dispatchModal({ type: "CLOSE_KEPUTUSAN" })
            }
            selected={modal.selected}
            ujian={modal.selected}
            keputusanOptions={keputusanOptions}
            keputusanChoice={modal.keputusanChoice}
            setKeputusanChoice={(val) =>
              dispatchModal({
                type: "SET_KEPUTUSAN_CHOICE",
                keputusanChoice: val,
              })
            }
            handleSetKeputusan={handleSetKeputusan}
          />
        )}
      </Tabs>
    </DataCard>
  );
}
