"use server";

import { CatatanUjianResponse } from "@/types/Catatan";

export async function getCatatanByUjianId(ujianId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiUrl}/catatan/ujian/${ujianId}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch catatan");
    }
    const data: CatatanUjianResponse = await res.json();
    if (data?.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching catatan:", error);
  }
}

export async function postCatatanByUjianId(ujianId: number | null, catatan: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/ujian/${ujianId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ catatan }),
      
    });
    if (!res.ok) {
        throw new Error("Failed to post catatan");
    }
    return await res.json();
  } catch (error) {
    console.error("Error posting catatan:", error);
  }
}
