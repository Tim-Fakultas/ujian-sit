import { UjianResponse } from "@/types/Ujian";

export async function getBeritaUjian(prodiId: number) {
  try {
    const response = await fetch(`http://localhost:8000/api/ujian`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian ujian by prodi");
    }

    const data: UjianResponse = await response.json();
    const filteredData = data.data.filter(
      (ujian) =>
        ujian.mahasiswa.prodi.id === prodiId &&
        ujian.pendaftaranUjian.status === "selesai"
    );
    return { data: filteredData };
  } catch (error) {
    console.error("Error fetching ujian ujian by prodi:", error);
    return [];
  }
}
