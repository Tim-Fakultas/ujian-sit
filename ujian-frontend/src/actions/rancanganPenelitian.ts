"use server";

import { RancanganPenelitian } from "@/types/RancanganPenelitian";

export async function createRancanganPenelitian(
  mahasiswaId: number,
  data: RancanganPenelitian
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}/ranpel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to create rancangan penelitian");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating rancangan penelitian:", error);
    throw error;
  }
}



export async function updateJudulRancanganPenelitian(
  mahasiswaId: number,
  ranpelId: number,
  data: Partial<RancanganPenelitian>
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(
      `${apiUrl}/mahasiswa/${mahasiswaId}/ranpel/${ranpelId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update rancangan penelitian");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating rancangan penelitian:", error);
    throw error;
  }
}

