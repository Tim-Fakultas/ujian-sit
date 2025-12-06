import { Dosen, DosenResponse } from "@/types/Dosen";

export async function getDosen(prodiId: number | undefined) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/dosen`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dosen");
    }

    const data: DosenResponse = await response.json();
    const filteredData: Dosen[] = data.data.filter(
      (dosen) => dosen.prodi.id === prodiId
    );
    return filteredData;
  } catch (error) {
    console.error("Error fetching dosen:", error);
    return [];
  }
}
