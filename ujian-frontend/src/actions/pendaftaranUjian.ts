"use server";

import { cookies } from "next/headers";

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
        next: { revalidate: 0 },
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
    return []; // tetap kembalikan [] agar frontend aman
  }
}

export async function getPendaftaranUjianByProdi(prodiId: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/pendaftaran-ujian`,
      {
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch pendaftaran ujian by prodi");
    }

    const data: PendaftaranUjianResponse = await response.json();
    const filteredData = data.data.filter(
      (pendaftaran) => pendaftaran.mahasiswa.prodiId.id === prodiId
    );
    return filteredData;
  } catch (error) {
    console.error("Error fetching pendaftaran ujian by prodi:", error);
    return [];
  }
}

export async function getLoggedInUser() {
  try {
    const cookieStore = cookies(); // Hapus 'await'
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      return null;
    }

    return JSON.parse(userCookie.value);
  } catch (error) {
    console.error("Error getting logged in user:", error);
    return null;
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
    return result;
  } catch (error: any) {
    // Lempar error ke frontend agar bisa ditampilkan
    throw error;
  }
}
