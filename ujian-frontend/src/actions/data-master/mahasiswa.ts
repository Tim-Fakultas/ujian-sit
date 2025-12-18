"use server";

"use server";

export async function getAllMahasiswa() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/mahasiswa`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal mengambil data mahasiswa");
    const data = await response.json();
    return data.data; // Ensure API returns { data: [] }
  } catch (error) {
    console.error("Error fetching all mahasiswa:", error);
    return [];
  }
}

export async function createMahasiswa(payload: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/mahasiswa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal membuat mahasiswa");
    return await response.json();
  } catch (error) {
    console.error("Error creating mahasiswa:", error);
    throw error;
  }
}

export async function updateMahasiswa(id: number, payload: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/mahasiswa/${id}`, {
      method: "PUT", // or PATCH, depending on API
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal update mahasiswa");
    return await response.json();
  } catch (error) {
    console.error("Error updating mahasiswa:", error);
    throw error;
  }
}

export async function deleteMahasiswa(id: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/mahasiswa/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Gagal menghapus mahasiswa");
    return await response.json();
  } catch (error) {
    console.error("Error deleting mahasiswa:", error);
    throw error;
  }
}

export async function updatePembimbingMahasiswa({
  mahasiswaId,
  pembimbing1,
  pembimbing2,
}: {
  mahasiswaId: number;
  pembimbing1: number;
  pembimbing2: number;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pembimbing1,
        pembimbing2,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Gagal update pembimbing mahasiswa");
    }
    return await response.json();
  } catch (error) {
    console.error("Error update pembimbing mahasiswa:", error);
    throw error;
  }
}

// Tambahkan fungsi getMahasiswaById
export async function getMahasiswaById(mahasiswaId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      throw new Error("Gagal mengambil data mahasiswa");
    }
    return await response.json();
  } catch (error) {
    console.error("Error get mahasiswa by id:", error);
    return null;
  }
}
