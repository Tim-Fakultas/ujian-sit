import { BeritaUjianResponse } from "@/types/BeritaUjian";
import { Ujian, UjianResponse } from "@/types/Ujian";

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
          ujian.pendaftaranUjian.status === "selesai",
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

export async function getRekapitulasiNilaiUjian(prodiId: number | undefined) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/ujian`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian ujian by prodi");
    }

    const data: UjianResponse = await response.json();
    const filteredData = data.data
      .filter(
        (ujian) =>
          (ujian.mahasiswa.prodi.id === prodiId &&
            ujian.pendaftaranUjian.status === "dijadwalkan") ||
          ujian.pendaftaranUjian.status === "selesai"
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

export async function getUjianByMahasiswa(mahasiswaId: number | undefined) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/ujian`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian ujian by prodi");
    }

    const data: UjianResponse = await response.json();
    const filteredData = data.data
      .filter(
        (ujian) =>
          ujian.mahasiswa.id === mahasiswaId &&
          (ujian.pendaftaranUjian.status === "dijadwalkan" ||
            ujian.pendaftaranUjian.status === "selesai"),
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
    console.error("Error fetching ujian ujian by mahasiswa:", error);
    return [];
  }
}

export async function getUjianForAdmin() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/ujian`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all ujian for admin");
    }

    const data: UjianResponse = await response.json();
    const filteredData = data.data
      .filter(
        (ujian) =>
          ujian.pendaftaranUjian.status === "dijadwalkan" ||
          ujian.pendaftaranUjian.status === "selesai",
      )
      .sort((a, b) => {
        const jadwalA = new Date(a.jadwalUjian).getTime();
        const jadwalB = new Date(b.jadwalUjian).getTime();
        return jadwalB - jadwalA;
      });
    return filteredData;
  } catch (error) {
    console.error("Error fetching all ujian for admin:", error);
    return [];
  }
}
