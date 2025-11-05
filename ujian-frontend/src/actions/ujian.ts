import { UjianResponse } from "@/types/Ujian";

export async function getJadwalUjianByMahasiswaIdByHasil(mahasiswaId: number) {
  try {
    const response = await fetch(`http://localhost:8000/api/ujian`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian by mahasiswa");
    }

    const data: UjianResponse = await response.json();
    if (!data?.data?.length) return [];

    // Filter ujian berdasarkan mahasiswaId dan status dijadwalkan
    const filteredData = data.data.filter(
      (ujian) =>
        Number(ujian.mahasiswa?.id) === Number(mahasiswaId) &&
        ujian.pendaftaranUjian?.status === "selesai" &&
        ujian.hasil === "lulus"
    );

    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian by mahasiswa:", error);
    return [];
  }
}
