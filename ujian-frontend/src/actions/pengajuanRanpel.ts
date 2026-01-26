"use server";

import { PengajuanRanpelResponse } from "@/types/RancanganPenelitian";

interface Status {
  status: "diverifikasi" | "ditolak" | "menunggu" | "diterima";
}

// MAHASISWA FUNCTIONS
export async function getPengajuanRanpelByMahasiswaId(userId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(
      `${apiUrl}/mahasiswa/${userId}/pengajuan-ranpel`,
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/pengajuan-ranpel`, {
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/pengajuan-ranpel`, {
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/pengajuan-ranpel`, {
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
  data: { status: Status["status"]; keterangan?: string; catatanKaprodi?: string; skipDateUpdate?: boolean }
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(
      `${apiUrl}/mahasiswa/${mahasiswaId}/pengajuan-ranpel/${pengajuanId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: data.status,
          ...(data.status === "ditolak" && !data.skipDateUpdate ? {
            tanggal_ditolak: new Date().toLocaleDateString('sv-SE') + " " + new Date().toLocaleTimeString('sv-SE')
          } : {}),
          ...(data.status === "diterima" && !data.skipDateUpdate ? {
            tanggal_diterima: new Date().toLocaleDateString('sv-SE') + " " + new Date().toLocaleTimeString('sv-SE')
          } : {}),
          ...(data.status === "diverifikasi" && !data.skipDateUpdate ? {
            tanggal_diverifikasi: new Date().toLocaleDateString('sv-SE') + " " + new Date().toLocaleTimeString('sv-SE')
          } : {}),
          ...(data.keterangan ? { keterangan: data.keterangan } : {}),
          ...(data.catatanKaprodi ? { catatan_kaprodi: data.catatanKaprodi } : {}),
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const body = await response.text();
      let errorMessage = `Failed to update pengajuan ranpel status (${response.status} ${response.statusText})`;
      try {
        const json = JSON.parse(body);
        if (json.message) errorMessage += `: ${json.message}`;
        if (json.errors) errorMessage += `: ${JSON.stringify(json.errors)}`;
      } catch {
        errorMessage += `: ${body}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating pengajuan ranpel status:", error);
    throw error;
  }
}

// DELETE FUNCTION
export async function deletePengajuanRanpel(
  mahasiswaId: number,
  pengajuanId: number
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(
      `${apiUrl}/mahasiswa/${mahasiswaId}/pengajuan-ranpel/${pengajuanId}`,
      {
        method: "DELETE",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const body = await response.text();
      let errorMessage = `Failed to delete pengajuan ranpel (${response.status} ${response.statusText})`;
      try {
        const json = JSON.parse(body);
        if (json.message) errorMessage += `: ${json.message}`;
      } catch {
        errorMessage += `: ${body}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting pengajuan ranpel:", error);
    throw error;
  }
}
