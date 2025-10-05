"use server";

export async function getDosen() {
  try {
    const res = await fetch("http://localhost:8000/api/dosen", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch dosen: ${res.statusText}`);
    }

    const data = await res.json();

    // Kalau API Laravel return { data: [...] }
    return data.data ?? data;
  } catch (err) {
    console.error("Error getDosen:", err);
    return [];
  }
}

export async function getDosenById(id: number) {
  try {
    const res = await fetch(`http://localhost:8000/api/dosen/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch dosen: ${res.statusText}`);
    }

    const json = await res.json();
    const data = json.data;

    // mapping ke struktur frontend
    return {
      id: data.id,
      nama: data.nama,
      nidn: data.nidn,
      noHp: data.noHp,
      alamat: data.alamat,
      prodi: data.prodi,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("Error getDosenById:", err);
  }
}

export async function createDosen(formData: FormData) {
  const nama = String(formData.get("nama") || "");
  const nidn = String(formData.get("nidn") || "");
  const noHp = String(formData.get("noHp") || "");
  const alamat = String(formData.get("alamat") || "");
  const prodiId = parseInt(String(formData.get("prodiId") || "1"));

  const res = await fetch("http://localhost:8000/api/dosen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, nidn, noHp, alamat, prodiId }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return { success: false, message: data.message || "Gagal membuat dosen" };
  }

  return { success: true };
}

export async function updateDosen(id: number, formData: FormData) {
  const nama = String(formData.get("nama") || "");
  const nidn = String(formData.get("nidn") || "");
  const noHp = String(formData.get("noHp") || "");
  const alamat = String(formData.get("alamat") || "");
  const prodiId = parseInt(String(formData.get("prodiId") || "1"));

  const res = await fetch(`http://localhost:8000/api/dosen/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, nidn, noHp, alamat, prodiId }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return { success: false, message: data.message || "Gagal memperbarui dosen" };
  }

  return { success: true };
}

export async function deleteDosen(id: number) {
  const res = await fetch(`http://localhost:8000/api/dosen/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return { success: false, message: data.message || "Gagal menghapus dosen" };
  }

  return { success: true };
}   