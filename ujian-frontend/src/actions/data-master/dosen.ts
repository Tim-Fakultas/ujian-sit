import { Dosen, DosenResponse } from "@/types/Dosen";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export async function getDosen(prodiId: number | undefined) {
  try {
    const response = await fetch(`${apiUrl}/dosen`, {
      next: { revalidate: 60 },
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
