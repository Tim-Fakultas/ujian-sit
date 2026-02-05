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
    const url = `${apiUrl}/mahasiswa/${mahasiswaId}/ranpel/${ranpelId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update rancangan penelitian. URL: ${url}. Status: ${response.status}. Response: ${errorText}`);
      throw new Error(`Failed to update rancangan penelitian: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating rancangan penelitian:", error);
    throw error;
  }
}

export async function getRanpelByMahasiswaId(mahasiswaId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}/ranpel`);

    if (!res.ok) {
      throw new Error("Failed to fetch rancangan penelitian");
    }

    const data: RancanganPenelitian = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching rancangan penelitian:", error);
    throw error;
  }
}
