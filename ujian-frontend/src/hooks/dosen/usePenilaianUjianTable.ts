import { useState, useEffect, useReducer, useMemo } from "react";
import { showToast } from "@/components/ui/custom-toast";
import { getHadirUjian, setHadirUjian } from "@/actions/daftarHadirUjian";
import { getPenilaianByUjianId, getAllPenilaian } from "@/actions/penilaian"; // Check import paths, some might be from different actions
import {
  modalReducer,
  initialModalState,
} from "@/app/(routes)/dosen/penilaian-ujian/jadwalUjianModalReducer"; // Keep this for now or move
import { Dosen } from "@/types/Dosen";
import { PenilaianItem } from "@/types/Penilaian";
import { HadirUjian } from "@/types/DaftarKehadiran";
import { Ujian } from "@/types/Ujian";
import { useDebounce } from "@/hooks/use-debounce";
import { useUrlFilter } from "@/hooks/use-url-filter";
import { keputusanOptions } from "@/lib/ujian/constants";

// Fix imports if actions are in different files
import { postCatatanByUjianId as postCatatan } from "@/actions/catatan";
import { postKeputusanByUjianId as postKeputusan } from "@/actions/keputusan";

export function usePenilaianUjianTable(
  jadwalUjian: Ujian[],
  currentDosenId: number | undefined,
) {
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

  // Search & Filter
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [filterJenisUjian, setFilterJenisUjian] = useUrlFilter("jenis", "all");

  const [penilaianMap, setPenilaianMap] = useState<Record<number, Set<number>>>(
    {},
  );
  const [loadingPenilaianMap, setLoadingPenilaianMap] = useState(true);

  // Filter Logic
  const filteredData = useMemo(() => {
    return dataUjian.filter((ujian) => {
      let matchPeran = true; // Logic removed in original? kept true
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
  }, [dataUjian, debouncedSearch, filterJenisUjian]);

  // Fetch Hadir Data
  useEffect(() => {
    getHadirUjian().then((data) => setHadirData(data ?? []));
  }, []);

  // Fetch Rekap Data
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
            const pengujiFound = modal?.selected?.penguji.find(
              (p) => p.id === item.dosenId,
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

          const jabatanOrder = [
            "Ketua Penguji",
            "Sekretaris Penguji",
            "Penguji I",
            "Penguji II",
          ];
          const arr = Object.values(group).sort(
            (a, b) =>
              jabatanOrder.indexOf(a.jabatan) - jabatanOrder.indexOf(b.jabatan),
          );
          setRekapPenilaian(arr);
        })
        .finally(() => setRekapLoading(false));
    } else {
      setRekapPenilaian([]);
    }
  }, [modal.openRekapitulasi, modal.selected, refreshKey]);

  // Set Catatan Text when modal opens
  useEffect(() => {
    if (modal.openCatatan && modal.selected) {
      setCatatanText(modal.selected.catatan ?? "");
    }
  }, [modal.openCatatan, modal.selected]);

  // Fetch Penilaian Map
  useEffect(() => {
    let mounted = true;
    getAllPenilaian().then((data) => {
      if (mounted) {
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

  // Handlers
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

  const handleSaveCatatan = async () => {
    try {
      await postCatatan(modal.selected?.id ?? null, catatanText);

      setDataUjian((prev) =>
        prev.map((u) =>
          u.id === modal.selected?.id ? { ...u, catatan: catatanText } : u,
        ),
      );

      showToast.success("Catatan disimpan.");
      dispatchModal({ type: "CLOSE_CATATAN" });
    } catch (e) {
      console.error(e);
      showToast.error("Gagal menyimpan catatan.");
    }
  };

  const handleSetKeputusan = async (ujianId: number, keputusanId: number) => {
    const opt = keputusanOptions.find((o) => o.id === keputusanId);
    const label = opt ? opt.label : String(keputusanId);

    if (modal.selected) {
      dispatchModal({
        type: "OPEN_KEPUTUSAN",
        ujian: { ...modal.selected, hasil: label },
        keputusanChoice: keputusanId,
      });
    }

    try {
      await postKeputusan(ujianId, keputusanId);
      showToast.success("Keputusan berhasil disimpan.");
    } catch (err) {
      console.error("Gagal menyimpan keputusan:", err);
      showToast.error("Gagal menyimpan keputusan.");
    }
  };

  return {
    // Data
    filteredData,
    hadirData,
    rekapPenilaian,
    rekapLoading,
    penilaianMap,
    loadingPenilaianMap,

    // State
    search,
    setSearch,
    filterJenisUjian,
    setFilterJenisUjian,
    modal,
    dispatchModal,
    catatanText,
    setCatatanText,
    hadirLoading,

    // Handlers
    handleHadir,
    handleSaveCatatan,
    handleSetKeputusan,
    setRefreshKey,
  };
}
