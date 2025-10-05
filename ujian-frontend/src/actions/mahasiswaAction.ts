"use server";

export async function getMahasiswa() {
  try {
    const res = await fetch("http://localhost:8000/api/mahasiswa", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch mahasiswa: ${res.statusText}`);
    }

    const data = await res.json();

    // Kalau API Laravel return { data: [...] }
    return data.data ?? data;
  } catch (err) {
    console.error("Error getMahasiswa:", err);
    return [];
  }
}

export async function getMahasiswaById(id: number) {
  try {
    const res = await fetch(`http://localhost:8000/api/mahasiswa/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch mahasiswa: ${res.statusText}`);
    }

    const json = await res.json();
    const data = json.data;

    // mapping ke struktur frontend
    return {
      id: data.id,
      nama: data.nama,
      nim: data.nim,
      noHp: data.noHp,
      alamat: data.alamat,
      semester: data.semester,
      dosenPaId: data.dosenPaId,
      prodi: data.prodi,
      dosenPa: data.dosenPa,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("Error getMahasiswaById:", err);
  }
}

export async function createMahasiswa(formData: FormData) {
  const nama = String(formData.get("nama") || "");
  const nim = String(formData.get("nim") || "");
  const noHp = String(formData.get("noHp") || "");
  const alamat = String(formData.get("alamat") || "");
  const semester = parseInt(String(formData.get("semester") || "1"));
  const dosenPaId = parseInt(String(formData.get("dosenPaId") || "1"));
  const prodiId = parseInt(String(formData.get("prodiId") || "1"));

  const res = await fetch("http://localhost:8000/api/mahasiswa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nama,
      nim,
      noHp,
      alamat,
      semester,
      dosenPaId,
      prodiId,
    }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: data.message || "Gagal membuat mahasiswa",
    };
  }

  return { success: true };
}

export async function updateMahasiswa(id: number, formData: FormData) {
  const nama = String(formData.get("nama") || "");
  const nim = String(formData.get("nim") || "");
  const noHp = String(formData.get("noHp") || "");
  const alamat = String(formData.get("alamat") || "");
  const semester = parseInt(String(formData.get("semester") || "1"));
  const dosenPaId = parseInt(String(formData.get("dosenPaId") || "1"));
  const prodiId = parseInt(String(formData.get("prodiId") || "1"));

  const res = await fetch(`http://localhost:8000/api/mahasiswa/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nama,
      nim,
      noHp,
      alamat,
      semester,
      dosenPaId,
      prodiId,
    }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: data.message || "Gagal memperbarui mahasiswa",
    };
  }

  return { success: true };
}

export async function deleteMahasiswa(id: number) {
  const res = await fetch(`http://localhost:8000/api/mahasiswa/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: data.message || "Gagal menghapus mahasiswa",
    };
  }

  return { success: true };
}
