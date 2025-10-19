"use server";

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
    const response = await fetch(
      `http://localhost:8000/api/mahasiswa/${mahasiswaId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pembimbing1,
          pembimbing2,
        }),
      }
    );
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
    const response = await fetch(
      `http://localhost:8000/api/mahasiswa/${mahasiswaId}`,
      { next: { revalidate: 0 } }
    );
    if (!response.ok) {
      throw new Error("Gagal mengambil data mahasiswa");
    }
    return await response.json();
  } catch (error) {
    console.error("Error get mahasiswa by id:", error);
    return null;
  }
}
