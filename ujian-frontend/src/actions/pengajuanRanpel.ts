"use server";

import { PengajuanRanpelResponse } from "@/types/RancanganPenelitian";

interface Status {
  status: "diverifikasi" | "ditolak" | "menunggu" | "diterima";
}

// MAHASISWA FUNCTIONS
export async function getPengajuanRanpelByMahasiswaId(userId?: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/mahasiswa/${userId}/pengajuan-ranpel`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data: PengajuanRanpelResponse = await response.json();

    return data.data;
  } catch (error) {
    console.error("Error fetching pengajuan ranpel:", error);
    return [];
  }
}

export async function getPengajuanRanpelByMahasiswaIdByStatus(userId?: number) {
  try {
    const response = await fetch("http://localhost:8000/api/pengajuan-ranpel", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pengajuan");
    }

    const data: PengajuanRanpelResponse = await response.json();

    let filteredData = data.data;

    if (userId) {
      filteredData = filteredData.filter(
        (pengajuan) =>
          pengajuan.mahasiswa?.id === userId && pengajuan.status === "diterima"
      );
    } else {
      filteredData = filteredData.filter(
        (pengajuan) => pengajuan.status === "diterima"
      );
    }

    return filteredData;
  } catch (error) {
    console.error("Error fetching pengajuan ranpel:", error);
    return [];
  }
}

//  DOSEN PA FUNCTIONS
export async function getPengajuanRanpelByDosenPA(dosenId?: number) {
  try {
    const response = await fetch("http://localhost:8000/api/pengajuan-ranpel", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pengajuan");
    }

    const data: PengajuanRanpelResponse = await response.json();

    let filteredData = data.data;

    if (dosenId) {
      filteredData = filteredData.filter(
        (pengajuan) => pengajuan.mahasiswa?.dosenPa?.id === dosenId
      );
    }

    // Urutkan berdasarkan tanggalPengajuan (terbaru di atas)
    filteredData = filteredData.sort((a, b) => {
      const tglA = new Date(a.tanggalPengajuan).getTime();
      const tglB = new Date(b.tanggalPengajuan).getTime();
      return tglB - tglA;
    });

    return filteredData;
  } catch (error) {
    console.error("Error fetching pengajuan ranpel by dosen PA:", error);
    return [];
  }
}

// KAPRODI FUNCTIONS
export async function getPengajuanRanpelByProdi(prodiId?: number) {
  try {
    const response = await fetch("http://localhost:8000/api/pengajuan-ranpel", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pengajuan");
    }

    const data: PengajuanRanpelResponse = await response.json();

    // Filter by diverifikasi status first
    let filteredData = data.data.filter(
      (pengajuan) => pengajuan.status !== "menunggu"
    );

    if (prodiId) {
      filteredData = filteredData.filter(
        (pengajuan) => pengajuan.mahasiswa?.prodi?.id === prodiId
      );
    }

    // Sort by tanggalPengajuan (terbaru di atas)
    filteredData = filteredData.sort((a, b) => {
      const tglA = new Date(a.tanggalPengajuan).getTime();
      const tglB = new Date(b.tanggalPengajuan).getTime();
      return tglB - tglA;
    });

    return filteredData;
  } catch (error) {
    console.error("Error fetching pengajuan ranpel by prodi:", error);
    return [];
  }
}

// DOSEN PA & KAPRODI FUNCTIONS
export async function updateStatusPengajuanRanpel(
  mahasiswaId: number,
  pengajuanId: number,
  data: Status
) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/mahasiswa/${mahasiswaId}/pengajuan-ranpel/${pengajuanId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update pengajuan ranpel status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating pengajuan ranpel status:", error);
    throw error;
  }
}
