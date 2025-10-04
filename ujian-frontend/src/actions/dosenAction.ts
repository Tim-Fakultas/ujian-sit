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
      nip: data.nip,
      email: data.email,
      prodi: data.prodi,
    };
  } catch (err) {
    console.error("Error getDosenById:", err);
  }
}
}

export async function createDosen(formData: FormData) {
  const nama = String(formData.get("nama") || "");
  const nip = String(formData.get("nip") || "");
  const email = String(formData.get("email") || "");
  const prodi = String(formData.get("prodi") || "");

  const res = await fetch("http://localhost:8000/api/dosen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, nip, email, prodi }),
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
  const nip = String(formData.get("nip") || "");
  const email = String(formData.get("email") || "");
  const prodi = String(formData.get("prodi") || "");

  const res = await fetch(`http://localhost:8000/api/dosen/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, nip, email, prodi }),
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