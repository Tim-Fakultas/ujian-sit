import { JenisUjianResponse } from "@/types/JenisUjian";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ;
export async function getJenisUjian() {
  try {
    const response = await fetch(`${apiUrl}/jenis-ujian`, {
      next: { revalidate: 60 },
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
