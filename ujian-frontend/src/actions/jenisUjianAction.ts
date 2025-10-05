"use server";

export async function getJenisUjian() {
  try {
    const res = await fetch("http://localhost:8000/api/jenis-ujian", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch jenis ujian: ${res.statusText}`);
    }

    const data = await res.json();

    // Kalau API Laravel return { data: [...] }
    return data.data ?? data;
  } catch (err) {
    console.error("Error getJenisUjian:", err);
    return [];
  }
}

export async function getJenisUjianById(id: number) {
  try {
    const res = await fetch(`http://localhost:8000/api/jenis-ujian/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch jenis ujian: ${res.statusText}`);
    }

    const json = await res.json();
    const data = json.data;

    // mapping ke struktur frontend
    return {
      id: data.id,
      namaJenis: data.namaJenis,
      deskripsi: data.deskripsi,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("Error getJenisUjianById:", err);
  }
}

export async function createJenisUjian(formData: FormData) {
  const namaJenis = String(formData.get("namaJenis") || "");
  const deskripsi = String(formData.get("deskripsi") || "");

  const res = await fetch("http://localhost:8000/api/jenis-ujian", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ namaJenis, deskripsi }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: data.message || "Gagal membuat jenis ujian",
    };
  }

  return { success: true };
}

export async function updateJenisUjian(id: number, formData: FormData) {
  const namaJenis = String(formData.get("namaJenis") || "");
  const deskripsi = String(formData.get("deskripsi") || "");

  const res = await fetch(`http://localhost:8000/api/jenis-ujian/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ namaJenis, deskripsi }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: data.message || "Gagal memperbarui jenis ujian",
    };
  }

  return { success: true };
}

export async function deleteJenisUjian(id: number) {
  const res = await fetch(`http://localhost:8000/api/jenis-ujian/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: data.message || "Gagal menghapus jenis ujian",
    };
  }

  return { success: true };
}
