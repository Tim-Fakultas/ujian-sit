import { DosenResponse } from "@/types/Dosen";

export async function getDosen(prodiId: number) {
  try {
    const response = await fetch(`http://localhost:8000/api/dosen`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dosen");
    }

    const data: DosenResponse = await response.json();
    // Filter dosen sesuai prodi, tapi tetap return dalam bentuk DosenResponse
    const filteredData = {
      data: data.data.filter((dosen) => dosen.prodi.id === prodiId),
    };
    return filteredData;
  } catch (error) {
    console.error("Error fetching dosen:", error);
    return { data: [] };
  }
}
