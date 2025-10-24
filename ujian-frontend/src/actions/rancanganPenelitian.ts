"use server";

import { RancanganPenelitian } from "@/types/RancanganPenelitian";

export async function createRancanganPenelitian(
  mahasiswaId: number,
  data: RancanganPenelitian
) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/mahasiswa/${mahasiswaId}/ranpel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create rancangan penelitian");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating rancangan penelitian:", error);
    throw error;
  }
}
