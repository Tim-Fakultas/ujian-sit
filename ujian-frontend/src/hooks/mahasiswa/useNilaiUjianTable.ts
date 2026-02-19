import { useState, useEffect, useMemo } from "react";
import { Ujian } from "@/types/Ujian";
import { BeritaUjian } from "@/types/BeritaUjian";
import { getPenilaianByUjianId } from "@/actions/penilaian";
import {
  generateSuratLulusPdf,
  generateBeritaAcaraPdf,
  generateDaftarHadirPdf,
  generateRekapNilaiPdf,
} from "@/utils/mahasiswa/pdfUtils";

export function useNilaiUjianTable(data: Ujian[]) {
  // -- State --
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<BeritaUjian | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [penilaian, setPenilaian] = useState<any[]>([]);

  // State untuk modal catatan
  const [openCatatanDialog, setOpenCatatanDialog] = useState(false);
  const [selectedCatatan, setSelectedCatatan] = useState<string>("");

  // Search & Filter (Local State, no params)
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState<
    "all" | "proposal" | "hasil" | "skripsi"
  >("all");
  const [hasilFilter, setHasilFilter] = useState<
    "all" | "lulus" | "tidak lulus"
  >("all");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // -- Effects --
  // Ambil penilaian ketika modal detail dibuka
  useEffect(() => {
    if (openDialog && selected?.id) {
      getPenilaianByUjianId(selected.id).then((d) => setPenilaian(d));
    }
  }, [openDialog, selected?.id]);

  // Reset page ke 1 saat search atau filter berubah
  useEffect(() => {
    setPage(1);
  }, [search, jenisFilter, hasilFilter]);

  // -- Computed --
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
      const judul = item.judulPenelitian?.toLowerCase() ?? "";
      const q = search.toLowerCase();
      const matchSearch = nama.includes(q) || judul.includes(q);

      let matchJenis = true;
      if (jenisFilter !== "all") {
        const jenis = item.jenisUjian?.namaJenis?.toLowerCase() ?? "";
        matchJenis = jenis.includes(jenisFilter);
      }

      let matchHasil = true;
      if (hasilFilter !== "all") {
        matchHasil = (item.hasil?.toLowerCase() ?? "") === hasilFilter;
      }

      return matchSearch && matchJenis && matchHasil;
    });
  }, [data, search, jenisFilter, hasilFilter]);

  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    return filteredData.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredData, page, pageSize]);

  // -- Handlers --
  const handleDetail = (ujian: BeritaUjian) => {
    setSelected(ujian);
    setOpenDialog(true);
  };

  const handleDownloadSuratLulus = (item: BeritaUjian) => {
    generateSuratLulusPdf(item);
  };

  const handleDownloadBeritaAcara = (item: BeritaUjian) => {
    generateBeritaAcaraPdf(item);
  };

  const handleDownloadDaftarHadir = (item: BeritaUjian) => {
    generateDaftarHadirPdf(item);
  };

  const handleDownloadRekapNilai = () => {
    generateRekapNilaiPdf(data);
  };

  return {
    // State
    openDialog,
    setOpenDialog,
    selected,
    setSelected,
    penilaian,
    openCatatanDialog,
    setOpenCatatanDialog,
    selectedCatatan,
    setSelectedCatatan,

    // Filters
    search,
    setSearch,
    jenisFilter,
    setJenisFilter,
    hasilFilter,
    setHasilFilter,

    // Pagination
    page,
    setPage,
    totalPage,
    pageSize,

    // Data
    filteredData,
    paginatedData,

    // Handlers
    handleDetail,
    handleDownloadSuratLulus,
    handleDownloadBeritaAcara,
    handleDownloadDaftarHadir,
    handleDownloadRekapNilai,
  };
}
