"use server";

export async function getPengajuan() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/pengajuan", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch pengajuan: ${res.statusText}`);
    }

    const data = await res.json();

    // Kalau API Laravel return { data: [...] }
    return data.data ?? data;
  } catch (err) {
    console.error("Error getPengajuan:", err);
    return [];
  }
}

export async function getPengajuanById(id: number) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/pengajuan/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal fetch pengajuan: ${res.statusText}`);
    }

    const json = await res.json();
    const data = json.data;

    // mapping ke struktur frontend
    return {
      id: data.id,
      judul_skripsi: data.judulSkripsi,
      keterangan: data.keterangan,
      tanggal_pengajuan: data.tanggalPengajuan,
      tanggal_disetujui: data.tanggalDisetujui,
      status: data.status,
      mahasiswa: data.mahasiswa,
    };
  } catch (err) {
    console.error("Error getPengajuan:", err);
  }
}


