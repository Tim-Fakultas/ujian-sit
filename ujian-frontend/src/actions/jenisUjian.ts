import { JenisUjianResponse } from "@/types/JenisUjian";

export async function getJenisUjian() {
  try {
    const response = await fetch(`http://localhost:8000/api/jenis-ujian`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch jenis ujian");
    }

    const data: JenisUjianResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching jenis ujian:", error);
    return { data: [] };
  }
}
