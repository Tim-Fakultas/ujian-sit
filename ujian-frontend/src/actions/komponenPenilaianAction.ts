"use server";

export async function getKomponenPenilaian() {
  try {
    const res = await fetch("http://localhost:8000/api/komponen-penilaian", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch komponen penilaian: ${res.statusText}`);
    }

    const data = await res.json();

    // Kalau API Laravel return { data: [...] }
    return data.data ?? data;
  } catch (err) {
    console.error("Error getKomponenPenilaian:", err);
    return [];
  }
}

export async function getKomponenPenilaianById(id: number) {
  try {
    const res = await fetch(
      `http://localhost:8000/api/komponen-penilaian/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Gagal fetch komponen penilaian: ${res.statusText}`);
    }

    const json = await res.json();
    const data = json.data;

    // mapping ke struktur frontend
    return {
      id: data.id,
      jenisUjianId: data.jenisUjianId,
      jenisUjian: data.jenisUjian,
      namaKomponen: data.namaKomponen,
      bobot: data.bobot,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("Error getKomponenPenilaianById:", err);
  }
}

export async function createKomponenPenilaian(formData: FormData) {
  const jenisUjianId = parseInt(String(formData.get("jenisUjianId") || "1"));
  const namaKomponen = String(formData.get("namaKomponen") || "");
  const bobot = parseInt(String(formData.get("bobot") || "0"));

  const res = await fetch("http://localhost:8000/api/komponen-penilaian", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jenisUjianId, namaKomponen, bobot }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: data.message || "Gagal membuat komponen penilaian",
    };
  }

  return { success: true };
}

export async function updateKomponenPenilaian(id: number, formData: FormData) {
  const jenisUjianId = parseInt(String(formData.get("jenisUjianId") || "1"));
  const namaKomponen = String(formData.get("namaKomponen") || "");
  const bobot = parseInt(String(formData.get("bobot") || "0"));

  const res = await fetch(
    `http://localhost:8000/api/komponen-penilaian/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jenisUjianId, namaKomponen, bobot }),
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: data.message || "Gagal memperbarui komponen penilaian",
    };
  }

  return { success: true };
}

export async function deleteKomponenPenilaian(id: number) {
  const res = await fetch(
    `http://localhost:8000/api/komponen-penilaian/${id}`,
    {
      method: "DELETE",
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: data.message || "Gagal menghapus komponen penilaian",
    };
  }

  return { success: true };
}
