"use server";

import { PendaftaranUjianResponse } from "@/types/PendaftaranUjian";
import { Ujian } from "@/types/Ujian";

// MAHASISWA
//* GET
export async function getPendaftaranUjianByMahasiswaId(mahasiswaId: number) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(
      `${API_URL}/mahasiswa/${mahasiswaId}/pendaftaran-ujian`,
      {
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      console.warn(
        `Tidak ada pendaftaran ujian untuk mahasiswa ID ${mahasiswaId}`
      );
      return [];
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Gagal fetch pendaftaran ujian: ${response.status} - ${text}`
      );
    }

    const data: PendaftaranUjianResponse = await response.json();
    const sortedData = data.data.sort((a, b) => {
      return (
        new Date(b.tanggalPengajuan.replace(" ", "T")).getTime() -
        new Date(a.tanggalPengajuan.replace(" ", "T")).getTime()
      );
    });
    

    if (!sortedData && !data.data) {
      return [];
    }

    return sortedData;
  } catch (error) {
    console.error("Error fetching pendaftaran ujian:", error);
    return [];
  }
}

// SEKPRODI
//* GET


// ADMIN
//* GET
export async function getPendaftaranUjianByProdi(prodiId: number) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/pendaftaran-ujian`, {
      cache: "no-store",
    });

    if (!response.ok)
      throw new Error("Failed to fetch pendaftaran ujian by prodi");

    const data: PendaftaranUjianResponse = await response.json();

    const filteredData = data.data
      .filter((p) => p.mahasiswa?.prodiId?.id === prodiId)
      .filter((p) => p.status === "menunggu")
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

// ADMIN
//* POST
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
      `${apiUrl}/mahasiswa/${mahasiswaId}/pendaftaran-ujian`,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (
        errorText.includes("Body exceeded 5 MB limit") ||
        response.status === 413
      ) {
        throw new Error(
          "Body exceeded 5 MB limit. File terlalu besar, maksimal 5 MB per file."
        );
      }
      throw new Error(
        `Gagal submit pendaftaran ujian: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error: unknown) {
    console.log(error);
  }
}

// ADMIN / SEKPRODI
//* PUT
export async function updateStatusPendaftaranUjian(
  id: number,
  status: string,
  keterangan?: string
) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const body: Record<string, string> = { status };
    if (keterangan) {
      body.keterangan = keterangan;
    }

    const response = await fetch(`${API_URL}/pendaftaran-ujian/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
    }

    return await response.json();
  } catch (error) {
    console.log("Error update status pendaftaran ujian:", error);
  }
}



