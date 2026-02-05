"use server";

export async function getAllPeminatan(prodi_id?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const url = prodi_id ? `${apiUrl}/peminatan?prodi_id=${prodi_id}` : `${apiUrl}/peminatan`;
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal mengambil data peminatan");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching peminatan:", error);
    return [];
  }
}

export async function createPeminatan(payload: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/peminatan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal membuat peminatan");
    return await response.json();
  } catch (error) {
    console.error("Error creating peminatan:", error);
    throw error;
  }
}

export async function updatePeminatan(id: number, payload: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/peminatan/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal update peminatan");
    return await response.json();
  } catch (error) {
    console.error("Error updating peminatan:", error);
    throw error;
  }
}

export async function deletePeminatan(id: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/peminatan/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal menghapus peminatan");
    return await response.json();
  } catch (error) {
    console.error("Error deleting peminatan:", error);
    throw error;
  }
}
