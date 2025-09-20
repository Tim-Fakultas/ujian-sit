"use server";

export async function getPengajuan() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/pengajuan", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch pengajuan: ${res.statusText}`);
    }

    const data = await res.json();

    // Kalau API Laravel return { data: [...] }
    return data.data ?? data;
  } catch (err) {
    console.error("Error getPengajuan:", err);
    return [];
  }
}
