import {
  KomponenPenilaian,
  KomponenPenilaianResponse,
} from "@/types/KomponenPenilaian";

export async function getKomponenPenilaianByUjianByPeran(
  jenisUjianId: number,
  peran: string
): Promise<KomponenPenilaian[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/komponen-penilaian`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal fetch komponen penilaian");
    const json: KomponenPenilaianResponse = await res.json();
    let komponen = json.data.filter(
      (k: KomponenPenilaian) => Number(k.jenisUjianId) === Number(jenisUjianId)
    );

    // Filter berdasarkan peran
    if (peran === "ketua_penguji" || peran === "sekretaris_penguji") {
      komponen = komponen.filter(
        (k) => k.namaKomponen !== "Sikap/Presentasi_2"
      );
    } else if (peran === "penguji_1" || peran === "penguji_2") {
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
