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
  NotebookPen,
  Gavel,
  Calendar,
  MoreVertical,
  AlertCircle,
  Clock,
  MapPin,
} from "lucide-react";
import { IconClipboardText } from "@tabler/icons-react";
import { UserCheck } from "lucide-react";
import PenilaianModal from "./PenilaianModal";

import { Button } from "../../../../components/ui/button";
import { getHadirUjian, setHadirUjian } from "@/actions/daftarHadirUjian";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { useUrlFilter } from "@/hooks/use-url-filter";
import { useDebounce } from "@/hooks/use-debounce";
import SearchInput from "@/components/common/Search";

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
          {/* Penilaian: Hanya aktif jika sudah absensi */}
          {!sudahHadir(ujian.id, currentDosenId, hadirData) ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <DropdownMenuItem
                      disabled
                      className="group flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
                    >
                      <Pencil size={18} className="text-muted-foreground/70" />
                      Penilaian
                    </DropdownMenuItem>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[200px]">
                  Anda belum melakukan absensi kehadiran.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
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
          )}
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
                              className="group flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
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


  const [refreshKey, setRefreshKey] = useState(0);

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


  // const { search } = useUrlSearch();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [filterJenisUjian, setFilterJenisUjian] = useUrlFilter("jenis", "all");

  const jenisUjianList = ["Seminar Proposal", "Ujian Hasil", "Ujian Skripsi"];

  const filteredData = dataUjian.filter((ujian) => {
    let matchPeran = true;
    let matchJenis = true;
    if (filterJenisUjian !== "all") {
      matchJenis = ujian.jenisUjian?.namaJenis === filterJenisUjian;
    }
    const q = debouncedSearch.toLowerCase();
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
            { dosen: Dosen; jabatan: string; total: number; details?: any[] }
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
                details: [],
              };
            }
            group[item.dosenId].total += subtotal;
            group[item.dosenId].details!.push({
              id: item.id,
              komponen: item.komponenPenilaian?.namaKomponen ?? "Komponen",
              bobot: bobot,
              nilai: nilai,
            });
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
  }, [modal.openRekapitulasi, modal.selected, refreshKey]);

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
      header: () => <div className="text-center py-2">No</div>,
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
      header: () => <div className="py-2">Nama Mahasiswa</div>,
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.getValue("nama")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.mahasiswa?.nim || "-"}
          </div>
        </div>
      ),
      size: 150,
    },
    {
      accessorFn: (row: any) => row.judulPenelitian ?? "-",
      id: "judul",
      header: () => <div className="py-2">Judul Penelitian</div>,
      cell: ({ row }: any) => (
        <div className="text-sm line-clamp-2" title={row.getValue("judul")}>
          {row.getValue("judul")}
        </div>
      ),
      size: 200,
    },
    {
      accessorFn: (row: any) => row.jenisUjian?.namaJenis ?? "-",
      id: "jenis",
      header: () => <div className="py-2">Jenis Ujian</div>,
      cell: ({ row }: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${row.original.jenisUjian?.namaJenis === "Ujian Proposal"
            ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
            : row.original.jenisUjian?.namaJenis === "Ujian Hasil"
              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
              : row.original.jenisUjian?.namaJenis === "Ujian Skripsi"
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
            }`}
        >
          {row.getValue("jenis")}
        </span>
      ),
      size: 90,
    },

    {
      id: "waktu",
      header: () => <div className="py-2">Waktu & Ruangan</div>,
      cell: ({ row }: any) => {
        const jadwal = row.original.jadwalUjian;
        const mulai = row.original.waktuMulai?.slice(0, 5);
        const selesai = row.original.waktuSelesai?.slice(0, 5);
        const ruangan = row.original.ruangan?.namaRuangan;

        if (!jadwal) return <span className="text-gray-400">-</span>;

        return (
          <div className="text-sm space-y-1">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {new Date(jadwal).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Clock size={14} className="text-blue-500" />
              {mulai && selesai ? `${mulai} - ${selesai}` : "-"}
            </div>
            {ruangan && (
              <div className="text-xs font-medium text-primary dark:text-primary bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded inline-flex items-center gap-1">
                <MapPin size={12} /> {ruangan}
              </div>
            )}
          </div>
        );
      },
      size: 180,
    },


    {
      id: "status_penguji",
      header: () => <div className="text-center py-2">Nilai penguji</div>,
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
      size: 80,
    },

    {
      id: "actions",
      header: () => <div className="text-center py-2">Aksi</div>,
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
      <div className="flex items-center justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenRekap}
                className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30"
              >
                <Eye size={16} />
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
      <div className="flex items-center gap-2 mb-4 w-full md:justify-end">
        {/* Search bar */}
        <SearchInput
          placeholder="Search"
          className="flex-1 w-full md:flex-none md:w-[300px]"
          value={search}
          onChange={setSearch}
          disableUrlParams={true}
        />

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">


          {/* Filter Jenis Ujian */}
          <Select value={filterJenisUjian} onValueChange={setFilterJenisUjian}>
            <SelectTrigger className="h-9 w-[130px] sm:w-[200px]">
              <SelectValue placeholder="Jenis Ujian: Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Ujian</SelectItem>
              {jenisUjianList.map((jenis) => (
                <SelectItem key={jenis} value={jenis}>
                  {jenis}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


        </div>
      </div>


      <TableGlobal table={table} cols={cols} />


      {modal.openDetail && modal.selected && (
        <DetailDialog dispatchModal={dispatchModal} ujian={modal.selected} />
      )}
      {modal.openRekapitulasi && modal.selected && (
        <RekapitulasiNilaiModal
          dispatchModal={dispatchModal}
          ujian={modal.selected}
          rekapPenilaian={rekapPenilaian}
          rekapLoading={rekapLoading}
          currentDosenId={typeof currentDosenId === 'string' ? parseInt(currentDosenId) : currentDosenId}
          onRefresh={() => setRefreshKey((prev) => prev + 1)}
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

    </DataCard>
  );
}
