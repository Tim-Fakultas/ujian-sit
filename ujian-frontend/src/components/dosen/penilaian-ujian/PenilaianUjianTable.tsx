"use client";
import React, { useState } from "react";
import {
  MoreVertical,
  Eye,
  Pencil,
  NotebookPen,
  Gavel,
  Clock,
  MapPin,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataCard } from "@/components/common/DataCard";
import SearchInput from "@/components/common/Search";
import TableGlobal from "@/components/tableGlobal";
import { HadirUjian } from "@/types/DaftarKehadiran";
import { usePenilaianUjianTable } from "@/hooks/dosen/usePenilaianUjianTable";
import { JadwalUjianTableProps } from "@/types/props/Ujian";
import { sudahHadir, getPengujiList } from "@/lib/ujian/helpers"; // Keep helpers
import { keputusanOptions } from "@/lib/ujian/constants";

// Modals - Import from original location for now
import PenilaianModal from "@/app/(routes)/dosen/penilaian-ujian/PenilaianModal";
import CatatanSheet from "@/app/(routes)/dosen/penilaian-ujian/CatatanSheet";
import KeputusanSheet from "@/app/(routes)/dosen/penilaian-ujian/KeputusanSheet";
import DaftarHadirDialog from "@/app/(routes)/dosen/penilaian-ujian/DaftarHadirDialog";
import DetailDialog from "@/app/(routes)/dosen/penilaian-ujian/DetailDialog";
import RekapitulasiNilaiModal from "@/app/(routes)/dosen/penilaian-ujian/RekapitulasiNilaiModal";

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
              (p: any) => p.id === Number(currentDosenId),
            )?.peran;
            const isKetua = roleSaya === "ketua_penguji";
            const isSekretaris = roleSaya === "sekretaris_penguji";

            // cek sekretaris hadir
            const sekretaris = ujian.penguji?.find(
              (p: any) => p.peran === "sekretaris_penguji",
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

function StatusPenilaianPenguji({
  ujianId,
  penguji,
  onOpenRekap,
  submittedDosenIds,
  loadingPenilaianMap,
}: {
  ujianId: number;
  penguji: any[];
  onOpenRekap: () => void;
  submittedDosenIds: Set<number>;
  loadingPenilaianMap: boolean;
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

export default function PenilaianUjianTable({
  jadwalUjian,
  currentDosenId,
}: JadwalUjianTableProps) {
  const hook = usePenilaianUjianTable(jadwalUjian, currentDosenId);

  const jenisUjianList = ["Seminar Proposal", "Ujian Hasil", "Ujian Skripsi"];

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
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            row.original.jenisUjian?.namaJenis === "Ujian Proposal"
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
                year: "numeric",
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
            hook.dispatchModal({ type: "OPEN_REKAP", ujian: row.original })
          }
          submittedDosenIds={hook.penilaianMap[row.original.id] || new Set()}
          loadingPenilaianMap={hook.loadingPenilaianMap}
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
          dispatchModal={hook.dispatchModal}
          currentDosenId={currentDosenId}
          hadirData={hook.hadirData}
        />
      ),
      size: 90,
    },
  ];

  // TableGlobal component expects a table instance or config
  // Constructing a table object similar to before
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPage = Math.ceil(hook.filteredData.length / pageSize);
  const paginatedData = hook.filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize,
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
      rows: hook.filteredData.map((item, idx) => ({
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
          value={hook.search}
          onChange={hook.setSearch}
          disableUrlParams={true}
        />

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Filter Jenis Ujian */}
          <Select
            value={hook.filterJenisUjian}
            onValueChange={hook.setFilterJenisUjian}
          >
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

      {/* Modals */}
      {/* Modals */}
      {hook.modal.selected && (
        <PenilaianModal
          open={hook.modal.openPenilaian}
          onClose={() => hook.dispatchModal({ type: "CLOSE_PENILAIAN" })}
          ujian={hook.modal.selected}
          currentDosenId={currentDosenId}
        />
      )}

      <CatatanSheet
        openCatatan={hook.modal.openCatatan}
        setOpenCatatan={(v) =>
          !v && hook.dispatchModal({ type: "CLOSE_CATATAN" })
        }
        selected={hook.modal.selected}
        ujian={hook.modal.selected!} // Force non-null as it should be open only when selected
        catatanText={hook.catatanText}
        setCatatanText={hook.setCatatanText}
        handleSaveCatatan={hook.handleSaveCatatan}
      />

      {hook.modal.selected && (
        <KeputusanSheet
          openKeputusan={hook.modal.openKeputusan}
          setOpenKeputusan={(v) =>
            !v && hook.dispatchModal({ type: "CLOSE_KEPUTUSAN" })
          }
          selected={hook.modal.selected}
          ujian={hook.modal.selected}
          keputusanOptions={keputusanOptions}
          keputusanChoice={hook.modal.keputusanChoice}
          setKeputusanChoice={(id) =>
            hook.dispatchModal({
              type: "SET_KEPUTUSAN_CHOICE",
              keputusanChoice: id,
            })
          }
          handleSetKeputusan={hook.handleSetKeputusan}
        />
      )}

      {hook.modal.selected && hook.modal.openDaftarHadir && (
        <DaftarHadirDialog
          openDaftarHadir={hook.modal.openDaftarHadir}
          setOpenDaftarHadir={(v) =>
            !v && hook.dispatchModal({ type: "CLOSE_DAFTAR_HADIR" })
          }
          ujian={hook.modal.selected}
          currentDosenId={currentDosenId || null}
          handleHadir={hook.handleHadir}
          hadirLoading={hook.hadirLoading}
          getPengujiList={getPengujiList}
          sudahHadir={(uId, dId) => sudahHadir(uId, dId, hook.hadirData)}
        />
      )}

      {hook.modal.selected && hook.modal.openDetail && (
        <DetailDialog
          dispatchModal={hook.dispatchModal}
          ujian={hook.modal.selected}
        />
      )}

      {hook.modal.selected && hook.modal.openRekapitulasi && (
        <RekapitulasiNilaiModal
          dispatchModal={hook.dispatchModal}
          rekapPenilaian={hook.rekapPenilaian}
          rekapLoading={hook.rekapLoading}
          ujian={hook.modal.selected}
          currentDosenId={currentDosenId}
          onRefresh={() => hook.setRefreshKey((prev) => prev + 1)}
        />
      )}
    </DataCard>
  );
}
