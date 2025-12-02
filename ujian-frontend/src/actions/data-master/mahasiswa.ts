"use server";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function updatePembimbingMahasiswa({
  mahasiswaId,
  pembimbing1,
  pembimbing2,
}: {
  mahasiswaId: number;
  pembimbing1: number;
  pembimbing2: number;
}) {
  try {
    const response = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pembimbing1,
        pembimbing2,
      }),
      next: { revalidate: 60 },
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
