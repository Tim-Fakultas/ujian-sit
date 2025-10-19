import { ruanganResponse } from "@/types/ruangan";

export async function getRuangan(prodiId: number) {
  try {
    const response = await fetch(`http://localhost:8000/api/ruangan`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ruangan");
    }

    const data: ruanganResponse = await response.json();
    // Filter ruangan sesuai prodi, tapi tetap return dalam bentuk ruanganResponse
    const filteredData = {
      data: data.data.filter((ruangan) => ruangan.prodi.id === prodiId),
    };
    return filteredData;
  } catch (error) {
    console.error("Error fetching ruangan:", error);
    return { data: [] };
  }
}
