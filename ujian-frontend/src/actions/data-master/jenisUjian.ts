import { JenisUjianResponse } from "@/types/JenisUjian";

export async function getJenisUjian() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/jenis-ujian`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch jenis ujian");
    }

    const data: JenisUjianResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching jenis ujian:", error);
    return [];
  }
}

export async function createJenisUjian(payload: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/jenis-ujian`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to create jenis ujian");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating jenis ujian:", error);
    throw error;
  }
}

export async function updateJenisUjian(id: number, payload: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/jenis-ujian/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to update jenis ujian");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating jenis ujian:", error);
    throw error;
  }
}

export async function deleteJenisUjian(id: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/jenis-ujian/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to delete jenis ujian");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting jenis ujian:", error);
    throw error;
  }
}
