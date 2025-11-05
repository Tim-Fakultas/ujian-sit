"use server";

import { revalidateTag } from "next/cache";

interface PendaftaranUjianResponse {
  data: Array<{
    id: number;
    mahasiswa: {
      id: number;
      nama: string;
      nim: string;
      prodiId: {
        id: number;
        namaProdi: string;
      };
    };
    ranpel: {
      id: number;
      judulPenelitian: string;
    };
    jenisUjian: {
      id: number;
      namaJenis: string;
    };
    tanggalPengajuan: string;
    tanggalDisetujui: string;
    status: string;
    berkas: File[];
    keterangan: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export async function getPendaftaranUjianByMahasiswaId(mahasiswaId: number) {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    const response = await fetch(
      `${API_URL}/mahasiswa/${mahasiswaId}/pendaftaran-ujian`,
      {
        cache: "no-store",
      }
    );

    // ✅ Jika backend balas 404, artinya belum ada data — jangan lempar error
    if (response.status === 404) {
      console.warn(
        `Tidak ada pendaftaran ujian untuk mahasiswa ID ${mahasiswaId}`
      );
      return []; // kembalikan array kosong
    }

    // Jika response gagal karena alasan lain
    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Gagal fetch pendaftaran ujian: ${response.status} - ${text}`
      );
    }

    // ✅ Jika response kosong tapi format JSON valid
    const data = await response.json();

    if (!data || !data.data) {
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching pendaftaran ujian:", error);
    return [];
  }
}

export async function getPendaftaranUjianDiterimaByProdi(prodiId: number) {
  try {
    const response = await fetch(`http://localhost:8000/api/ujian`, {
      next: { tags: ["pendaftaranUjian"], revalidate: 60 }, // cache 1 menit, tag untuk invalidation
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pendaftaran ujian by prodi");
    }

    const data = await response.json();
    // Sesuaikan filter agar hanya data dengan prodiId yang cocok dikembalikan
    // dan struktur return sesuai dengan API terbaru
    interface Ujian {
      mahasiswa?: {
        prodi?: {
          id: number;
        };
      };
    }

    const filteredData = data.data.filter(
      (ujian: Ujian) => ujian.mahasiswa?.prodi?.id === prodiId // prodiId dari mahasiswa
    );

    return filteredData;
  } catch (error) {
    console.error("Error fetching pendaftaran ujian by prodi:", error);
    return [];
  }
}

// actions/pendaftaranUjian.ts

export async function getPendaftaranUjianByProdi(prodiId: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/pendaftaran-ujian`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok)
      throw new Error("Failed to fetch pendaftaran ujian by prodi");

    const data: PendaftaranUjianResponse = await response.json();

    // Filter dan map sesuai tipe, lalu urutkan dari tanggal pengajuan terbaru
    const filteredData = data.data
      .filter((p) => p.mahasiswa?.prodiId?.id === prodiId)
      .filter((p) => p.status !== "selesai")
      .map((pendaftaran) => ({
        ...pendaftaran,
        berkas: Array.isArray(pendaftaran.berkas)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pendaftaran.berkas.map((b: any) => ({
              id: b.id,
              namaBerkas: b.namaBerkas,
              filePath: b.filePath,
              uploadedAt: b.uploadedAt,
              createdAt: b.createdAt,
              updatedAt: b.updatedAt,
            }))
          : [],
      }))
      .sort(
        (a, b) =>
          new Date(b.tanggalPengajuan.replace(" ", "T")).getTime() -
          new Date(a.tanggalPengajuan.replace(" ", "T")).getTime()
      );

    return filteredData;
  } catch (error) {
    console.error("Error fetching pendaftaran ujian by prodi:", error);
    return [];
  }
}

export async function createPendaftaranUjian({
  mahasiswaId,
  ranpelId,
  jenisUjianId,
  berkas,
  keterangan,
  status = "menunggu",
}: {
  mahasiswaId: number;
  ranpelId: number;
  jenisUjianId: number;
  berkas: File[];
  keterangan?: string;
  status?: string;
}) {
  try {
    const formData = new FormData();
    formData.append("ranpelId", ranpelId.toString());
    formData.append("jenisUjianId", jenisUjianId.toString());
    if (keterangan) {
      formData.append("keterangan", keterangan);
    }
    formData.append("status", status);
    berkas.forEach((file) => {
      formData.append("berkas[]", file);
    });

    const response = await fetch(
      `http://localhost:8000/api/mahasiswa/${mahasiswaId}/pendaftaran-ujian`,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      // Deteksi error body size
      if (
        errorText.includes("Body exceeded 1 MB limit") ||
        response.status === 413
      ) {
        throw new Error(
          "Body exceeded 1 MB limit. File terlalu besar, maksimal 1 MB per file."
        );
      }
      throw new Error(
        `Gagal submit pendaftaran ujian: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    revalidateTag("pendaftaranUjian");
    return result;
  } catch (error: unknown) {
    // Lempar error ke frontend agar bisa ditampilkan
    throw error;
  }
}

export async function updateStatusPendaftaranUjian(id: number, status: string) {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const response = await fetch(`${API_URL}/pendaftaran-ujian/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal update status: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error update status pendaftaran ujian:", error);
    throw error;
  }
}
