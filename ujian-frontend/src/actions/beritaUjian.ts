import { BeritaUjianResponse } from "@/types/BeritaUjian";

export async function getBeritaUjian(prodiId: number | undefined) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/ujian`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian ujian by prodi");
    }

    const data: BeritaUjianResponse = await response.json();
    const filteredData = data.data
      .filter(
        (ujian) =>
          ujian.mahasiswa.prodi.id === prodiId &&
          ujian.pendaftaranUjian.status === "selesai"
      )
      .sort((a, b) => {
        // Sort by jadwalUjian (desc), then waktuSelesai (desc)
        const jadwalA = new Date(a.jadwalUjian).getTime();
        const jadwalB = new Date(b.jadwalUjian).getTime();
        if (jadwalB !== jadwalA) {
          return jadwalB - jadwalA;
        }
        const selesaiA = new Date(a.waktuSelesai).getTime();
        const selesaiB = new Date(b.waktuSelesai).getTime();
        return selesaiB - selesaiA;
      });

    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian ujian by prodi:", error);
    return [];
  }
}

export async function getBeritaUjianByLulus(prodiId: number | undefined) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/ujian`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian ujian by prodi");
    }

    const data: BeritaUjianResponse = await response.json();
    const filteredData = data.data
      .filter(
        (ujian) =>
          ujian.mahasiswa.prodi.id === prodiId &&
          ujian.pendaftaranUjian.status === "selesai" &&
          ujian.hasil === "lulus"
      )
      .sort((a, b) => {
        // Sort by jadwalUjian first, then waktuSelesai
        const jadwalA = new Date(a.jadwalUjian).getTime();
        const jadwalB = new Date(b.jadwalUjian).getTime();
        if (jadwalB !== jadwalA) {
          return jadwalB - jadwalA;
        }
        const selesaiA = new Date(a.waktuSelesai).getTime();
        const selesaiB = new Date(b.waktuSelesai).getTime();
        return selesaiB - selesaiA;
      });
    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian ujian by prodi:", error);
    return [];
  }
}
