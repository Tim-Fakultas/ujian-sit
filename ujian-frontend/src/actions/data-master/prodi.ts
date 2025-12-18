"use server";

export async function getAllProdi() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/prodi`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch prodi");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching prodi:", error);
    return [];
  }
}
