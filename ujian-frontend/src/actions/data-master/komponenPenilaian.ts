import {
  KomponenPenilaian,
  KomponenPenilaianResponse,
} from "@/types/KomponenPenilaian";

export async function getKomponenPenilaianByUjianByPeran(
  jenisUjianId: number,
  peran: string
): Promise<KomponenPenilaian[]> {
  try {
    const res = await fetch("http://localhost:8000/api/komponen-penilaian", {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Gagal fetch komponen penilaian");
    const json: KomponenPenilaianResponse = await res.json();
    let komponen = json.data.filter(
      (k: KomponenPenilaian) => Number(k.jenisUjianId) === Number(jenisUjianId)
    );

    // Filter berdasarkan peran
    if (peran === "Ketua Penguji" || peran === "Sekretaris Penguji") {
      komponen = komponen.filter(
        (k) => k.namaKomponen !== "Sikap/Presentasi_2"
      );
    } else if (peran === "Penguji 1" || peran === "Penguji 2") {
      komponen = komponen.filter(
        (k) =>
          k.namaKomponen !== "Bimbingan" &&
          k.namaKomponen !== "Sikap/Presentasi_1"
      );
    }
    return komponen;
  } catch (err) {
    console.error("Error fetching komponen penilaian:", err);
    return [];
  }
}
