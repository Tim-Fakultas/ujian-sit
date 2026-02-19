import { useState, useEffect, useMemo } from "react";
import { Ujian } from "@/types/Ujian";
import { getPenilaianByUjianId } from "@/actions/penilaian";
import { useUrlFilter } from "@/hooks/use-url-filter";
import { useDebounce } from "@/hooks/use-debounce";

export function useRekapitulasiNilaiTable(data: Ujian[]) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<Ujian | null>(null);
  const [penilaian, setPenilaian] = useState<any[]>([]);

  // Search state managed locally with debounce
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);

  // Filter states managed by URL
  // Note: we cast the return string to the specific union type
  const [jenisFilter, setJenisFilter] = useUrlFilter("jenis", "all") as [
    "all" | "proposal" | "hasil" | "skripsi",
    (val: string) => void,
    boolean,
  ];

  const [hasilFilter, setHasilFilter] = useUrlFilter("hasil", "all") as [
    "all" | "lulus" | "tidak lulus",
    (val: string) => void,
    boolean,
  ];

  // Fetch penilaian when detail modal opens
  useEffect(() => {
    if (openDialog && selected?.id) {
      getPenilaianByUjianId(selected.id).then((data) => setPenilaian(data));
    } else {
      setPenilaian([]);
    }
  }, [openDialog, selected?.id]);

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
      const judul = item.judulPenelitian?.toLowerCase() ?? "";
      const searchLower = (debouncedQ || "").toLowerCase();
      const matchSearch =
        nama.includes(searchLower) || judul.includes(searchLower);

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
  }, [data, debouncedQ, jenisFilter, hasilFilter]);

  // Handler
  const handleDetail = (ujian: Ujian) => {
    setSelected(ujian);
    setOpenDialog(true);
  };

  // Process/Group Penilaian for Rekap View
  const pengujiRekap = useMemo(() => {
    if (!penilaian || penilaian.length === 0) return [];

    const pengujiMap: Record<
      number,
      { nama: string; nidn: string; total: number }
    > = {};

    penilaian.forEach((p) => {
      if (!pengujiMap[p.dosenId]) {
        pengujiMap[p.dosenId] = {
          nama: p.dosen?.nama || "-",
          nidn: p.dosen?.nidn || "-",
          total: 0,
        };
      }
      const bobot = p.komponenPenilaian?.bobot ?? 0;
      pengujiMap[p.dosenId].total += ((p.nilai ?? 0) * bobot) / 100;
    });

    return Object.values(pengujiMap);
  }, [penilaian]);

  return {
    // Data
    filteredData,
    penilaian,
    pengujiRekap,

    // State
    openDialog,
    setOpenDialog,
    selected,
    q,
    setQ,
    jenisFilter,
    setJenisFilter,
    hasilFilter,
    setHasilFilter,

    // Handlers
    handleDetail,
  };
}
