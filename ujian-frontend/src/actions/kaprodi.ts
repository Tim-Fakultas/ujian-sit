"use server";

import { PengajuanRanpelResponse } from "@/types/RancanganPenelitian";
import { UjianResponse } from "@/types/Ujian";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getDashboardStats() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kaprodi/dashboard`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
} 

export async function getKaprodiPengajuanRanpel() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kaprodi/pengajuan-ranpel`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pengajuan ranpel");
    }

    const data: PengajuanRanpelResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching pengajuan ranpel:", error);
    return [];
  }
}

export async function getKaprodiJadwalUjian() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kaprodi/jadwal-ujian`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data: UjianResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching jadwal ujian:", error);
    return [];
  }
}

export async function approvePengajuanKaprodi(
  id: number,
  catatan: string | null,
) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_URL}/kaprodi/pengajuan-ranpel/${id}/approve`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ catatan_kaprodi: catatan }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to approve pengajuan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error approving pengajuan:", error);
    throw error;
  }
}

export async function rejectPengajuanKaprodi(
  id: number,
  catatan: string | null,
) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_URL}/kaprodi/pengajuan-ranpel/${id}/reject`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ catatan_kaprodi: catatan }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to reject pengajuan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error rejecting pengajuan:", error);
    throw error;
  }
}

export async function updateCatatanKaprodi(id: number, catatan: string | null) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_URL}/kaprodi/pengajuan-ranpel/${id}/catatan`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ catatan_kaprodi: catatan }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update catatan pengajuan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating catatan pengajuan:", error);
    throw error;
  }
}
