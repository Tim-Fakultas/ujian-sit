import {
  KomponenPenilaian,
  KomponenPenilaianResponse,
} from "@/types/KomponenPenilaian";

export async function getAllKomponenPenilaian() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/komponen-penilaian`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal fetch komponen penilaian");
    const json: KomponenPenilaianResponse = await res.json();
    return json.data;
  } catch (err) {
    console.error("Error fetching all komponen penilaian:", err);
    return [];
  }
}

export async function createKomponenPenilaian(payload: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/komponen-penilaian`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal membuat komponen penilaian");
    return await response.json();
  } catch (error) {
    console.error("Error creating komponen penilaian:", error);
    throw error;
  }
}

export async function updateKomponenPenilaian(id: number, payload: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/komponen-penilaian/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal update komponen penilaian");
    return await response.json();
  } catch (error) {
    console.error("Error updating komponen penilaian:", error);
    throw error;
  }
}

export async function deleteKomponenPenilaian(id: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/komponen-penilaian/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal hapus komponen penilaian");
    return await response.json();
  } catch (error) {
    console.error("Error deleting komponen penilaian:", error);
    throw error;
  }
}

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
