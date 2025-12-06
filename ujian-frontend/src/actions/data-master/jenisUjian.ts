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
    return { data: [] };
  }
}
