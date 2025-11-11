"use client";

import { useState, useEffect, useActionState, useMemo } from "react";
import { getRuangan } from "@/actions/data-master/ruangan";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  CalendarPlus,
  Filter,
  ListFilter,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { getMahasiswaById } from "@/actions/data-master/mahasiswa";
import { getJenisUjianColor, getStatusColor, truncateTitle } from "@/lib/utils";
import { jadwalkanUjianAction } from "@/actions/jadwalUjian";
import { Ujian } from "@/types/Ujian";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import revalidateAction from "@/actions/revalidate";
import { Dosen } from "@/types/Dosen";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function PendaftaranUjianTable({
  ujianList,
  dosen,
}: {
  ujianList: Ujian[];
  dosen: Dosen[];
}) {
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState<Ujian | null>(null);

  type MahasiswaDetail = {
    id: number | string;
    nama: string;
    pembimbing1?: { id: number | string; nama: string };
    pembimbing2?: { id: number | string; nama: string };
  };

  const [mahasiswaDetail, setMahasiswaDetail] =
    useState<MahasiswaDetail | null>(null);
  const [penguji1, setPenguji1] = useState<string>("");
  const [penguji2, setPenguji2] = useState<string>("");

  // State for ruangan
  const [ruanganList, setRuanganList] = useState<
    { id: number; namaRuangan: string }[]
  >([]);
  const [ruangan, setRuangan] = useState<string>("");
  // State untuk waktu mulai dan selesai
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");

  useEffect(() => {
    getRuangan().then((res) => {
      if (res && Array.isArray(res.data)) {
        setRuanganList(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (selected) {
      getMahasiswaById(Number(selected.mahasiswa.id)).then((res) =>
        setMahasiswaDetail(res?.data || null)
      );
    }
  }, [selected]);

  type JadwalkanUjianState = {
    success: boolean;
    message: string;
  };

  const jadwalkanUjianReducer = async (
    state: JadwalkanUjianState,
    formData: FormData
  ): Promise<JadwalkanUjianState> => {
    const result = await jadwalkanUjianAction(formData);
    revalidateAction("/sekprodi/daftar-ujian");
    return {
      success: result?.success ?? false,
      message:
        result && "message" in result && typeof result.message === "string"
          ? result.message
          : "",
    };
  };

  const [state, formAction] = useActionState(jadwalkanUjianReducer, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (!state) return;
    (async () => {
      const { toast } = await import("sonner");
      if (state.success) {
        toast.success("Ujian berhasil dijadwalkan!");
        setOpen(false);
      } else if (state.message) {
        // Mapping pesan error agar lebih user-friendly
        let userMessage = state.message;
        if (
          userMessage.includes(
            "waktu selesai field must be a date after waktu mulai"
          ) ||
          userMessage.includes("waktuSelesai") ||
          userMessage.toLowerCase().includes("must be a date after waktu mulai")
        ) {
          userMessage = "Waktu selesai ujian harus setelah waktu mulai.";
        }
        toast.error(userMessage);
      }
    })();
  }, [state]);

  // Reset penguji jika dialog ditutup
  useEffect(() => {
    if (!open) {
      setPenguji1("");
      setPenguji2("");
      setSelected(null);
      setMahasiswaDetail(null);
      setWaktuMulai("");
      setWaktuSelesai("");
    }
  }, [open]);

  // Otomatis set waktu selesai berdasarkan waktu mulai & jenis ujian
  useEffect(() => {
    if (!waktuMulai || !selected) {
      setWaktuSelesai("");
      return;
    }
    // Ambil durasi berdasarkan jenis ujian
    let durasiJam = 2;
    let durasiMenit = 0;
    if (selected.jenisUjian.namaJenis.toLowerCase().includes("skripsi")) {
      durasiJam = 1;
      durasiMenit = 30;
    }
    // Parse waktu mulai
    const [jam, menit] = waktuMulai.split(":").map(Number);
    const mulai = new Date();
    mulai.setHours(jam, menit, 0, 0);
    // Tambah durasi
    mulai.setHours(mulai.getHours() + durasiJam);
    mulai.setMinutes(mulai.getMinutes() + durasiMenit);
    // Format kembali ke "HH:MM"
    const pad = (n: number) => n.toString().padStart(2, "0");
    setWaktuSelesai(`${pad(mulai.getHours())}:${pad(mulai.getMinutes())}`);
  }, [waktuMulai, selected]);

  // Filter & Pagination State
  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  // Hapus sortTanggal
  // const [sortTanggal, setSortTanggal] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    const data = ujianList.filter((u) => {
      const matchNama = u.mahasiswa.nama
        .toLowerCase()
        .includes(filterNama.toLowerCase());
      const matchJenis =
        filterJenis === "all" ? true : u.jenisUjian.namaJenis === filterJenis;
      return matchNama && matchJenis;
    });

    return data;
  }, [ujianList, filterNama, filterJenis]);

  // Pagination
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Reset page ke 1 jika filter berubah
  useEffect(() => {
    setPage(1);
  }, [filterNama, filterJenis /*, sortTanggal*/]);

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-4">
        <div className="flex w-full sm:w-auto items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              placeholder="Search"
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="pl-10 w-full placeholder:text-xs text-xs h-8"
            />
          </div>
          {/* Filter jenis ujian dengan Popover, ukuran sama dengan search */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-xs font-medium w-full justify-between"
                >
                  <ListFilter size={16} className="mr-1" />
                  <span className="flex items-center">Filter</span>
                  <ChevronDown size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="py-2 px-3 border-b font-semibold text-xs text-muted-foreground">
                  Jenis Ujian
                </div>
                <div className="flex flex-col">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      filterJenis === "all" ? "bg-accent font-semibold" : ""
                    }`}
                    onClick={() => setFilterJenis("all")}
                  >
                    Semua
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      filterJenis === "Ujian Proposal"
                        ? "bg-accent font-semibold"
                        : ""
                    }`}
                    onClick={() => setFilterJenis("Ujian Proposal")}
                  >
                    Ujian Proposal
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      filterJenis === "Ujian Hasil"
                        ? "bg-accent font-semibold"
                        : ""
                    }`}
                    onClick={() => setFilterJenis("Ujian Hasil")}
                  >
                    Ujian Hasil
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-left px-3 py-2 text-xs rounded-none ${
                      filterJenis === "Ujian Skripsi"
                        ? "bg-accent font-semibold"
                        : ""
                    }`}
                    onClick={() => setFilterJenis("Ujian Skripsi")}
                  >
                    Ujian Skripsi
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="border rounded-sm overflow-auto">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-10">No</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Jenis Ujian</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-16">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((u, i) => (
                <TableRow key={u.id} className="hover:bg-gray-50 transition">
                  <TableCell className="text-center">
                    {(page - 1) * pageSize + i + 1}
                  </TableCell>
                  <TableCell>{u.mahasiswa.nama}</TableCell>
                  <TableCell>{truncateTitle(u.judulPenelitian, 40)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getJenisUjianColor(
                        u.jenisUjian.namaJenis
                      )}`}
                    >
                      {u.jenisUjian.namaJenis}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        u.pendaftaranUjian.status
                      )}`}
                    >
                      {u.pendaftaranUjian.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mx-auto"
                          aria-label="Aksi"
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(u);
                            setOpen(true);
                          }}
                          disabled={
                            u.pendaftaranUjian.status.toLowerCase() ===
                            "selesai"
                          }
                          className="text-xs"
                        >
                          <CalendarPlus className="mr-2" size={16} />
                          Jadwalkan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 italic py-6"
                >
                  Tidak ada data pendaftaran ujian.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {/* Custom Pagination with Dots */}
              {(() => {
                const pages = [];
                const maxShown = 5;
                let start = Math.max(1, page - 2);
                let end = Math.min(totalPage, page + 2);

                if (end - start < maxShown - 1) {
                  if (start === 1) {
                    end = Math.min(totalPage, start + maxShown - 1);
                  } else if (end === totalPage) {
                    start = Math.max(1, end - maxShown + 1);
                  }
                }

                // First page
                if (start > 1) {
                  pages.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        isActive={page === 1}
                        onClick={() => setPage(1)}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                  if (start > 2) {
                    pages.push(
                      <PaginationItem key="start-ellipsis">
                        <span className="px-2 text-gray-400">...</span>
                      </PaginationItem>
                    );
                  }
                }

                // Middle pages
                for (let i = start; i <= end; i++) {
                  pages.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i}
                        onClick={() => setPage(i)}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Last page
                if (end < totalPage) {
                  if (end < totalPage - 1) {
                    pages.push(
                      <PaginationItem key="end-ellipsis">
                        <span className="px-2 text-gray-400">...</span>
                      </PaginationItem>
                    );
                  }
                  pages.push(
                    <PaginationItem key={totalPage}>
                      <PaginationLink
                        isActive={page === totalPage}
                        onClick={() => setPage(totalPage)}
                      >
                        {totalPage}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                return pages;
              })()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                  aria-disabled={page === totalPage}
                  className={
                    page === totalPage ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {/* Dialog Jadwal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Jadwalkan Ujian
              {selected && (
                <span className="block text-sm font-normal text-muted-foreground mt-1">
                  {selected.mahasiswa.nama} &mdash;{" "}
                  {selected.jenisUjian.namaJenis}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Silakan lengkapi data jadwal ujian berikut.
            </DialogDescription>
          </DialogHeader>
          <div className="border-b my-2" />
          {selected && mahasiswaDetail && (
            <form action={formAction} className="space-y-4">
              <input
                type="hidden"
                name="ujianId"
                value={String(selected?.id ?? "")}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block">Ketua Penguji</Label>
                  <Input
                    type="text"
                    value={mahasiswaDetail.pembimbing1?.nama || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label className="mb-1 block">Sekretaris Penguji</Label>
                  <Input
                    type="text"
                    value={mahasiswaDetail.pembimbing2?.nama || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block">Tanggal Ujian</Label>
                  <Input
                    type="date"
                    name="jadwalUjian"
                    required
                    placeholder="Pilih tanggal"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <Label className="mb-1 block">Waktu Mulai</Label>
                    <Input
                      type="time"
                      name="waktuMulai"
                      required
                      value={waktuMulai}
                      onChange={(e) => setWaktuMulai(e.target.value)}
                      placeholder="08:00"
                    />
                  </div>
                  <div className="w-1/2">
                    <Label className="mb-1 block">Waktu Selesai</Label>
                    <Input
                      type="time"
                      name="waktuSelesai"
                      required
                      value={waktuSelesai}
                      readOnly
                      tabIndex={-1}
                      className="bg-[#f3f4f6] text-muted-foreground"
                    />
                    <span className="text-xs text-muted-foreground block mt-1">
                      Otomatis diisi sesuai jenis ujian
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Ruangan</Label>
                <select
                  name="ruanganId"
                  value={ruangan}
                  onChange={(e) => setRuangan(e.target.value)}
                  required
                  className="w-full border rounded px-2 py-2 bg-background"
                >
                  <option value="" disabled>
                    Pilih Ruangan
                  </option>
                  {ruanganList.map((r) => (
                    <option key={r.id} value={String(r.id)}>
                      {r.namaRuangan}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1 block">Dosen Penguji 1</Label>
                  <Select
                    value={penguji1}
                    onValueChange={setPenguji1}
                    name="penguji1"
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Dosen" />
                    </SelectTrigger>
                    <SelectContent>
                      {dosen
                        .filter((d) => String(d.id) !== penguji2)
                        .map((d) => (
                          <SelectItem key={d.id} value={String(d.id)}>
                            {d.nama}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block">Dosen Penguji 2</Label>
                  <Select
                    value={penguji2}
                    onValueChange={setPenguji2}
                    name="penguji2"
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Dosen" />
                    </SelectTrigger>
                    <SelectContent>
                      {dosen
                        .filter((d) => String(d.id) !== penguji1)
                        .map((d) => (
                          <SelectItem key={d.id} value={String(d.id)}>
                            {d.nama}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full mt-2 transition hover:bg-primary/90"
                disabled={
                  !penguji1 ||
                  !penguji2 ||
                  !ruangan ||
                  penguji1 === "" ||
                  penguji2 === "" ||
                  ruangan === "" ||
                  penguji1 === penguji2 // prevent duplicate penguji
                }
              >
                Simpan Jadwal
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
