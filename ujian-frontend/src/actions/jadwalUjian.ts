"use server";
import { UjianResponse } from "@/types/Ujian";
import { z } from "zod";

export async function getJadwalaUjianByProdi(prodiId: number) {
  try {
    const response = await fetch(`http://localhost:8000/api/ujian`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian ujian by prodi");
    }

    const data: UjianResponse = await response.json();
    const filteredData = data.data.filter(
      (ujian) =>
        ujian.mahasiswa.prodi.id === prodiId &&
        ujian.pendaftaranUjian.status === "dijadwalkan"
    );
    return { data: filteredData };
  } catch (error) {
    console.error("Error fetching ujian ujian by prodi:", error);
    return [];
  }
}

export async function getJadwalUjianByProdiByDosen({
  prodiId,
  dosenId,
}: {
  prodiId: number;
  dosenId: number;
}) {
  try {
    const response = await fetch(`http://localhost:8000/api/ujian`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian by prodi and dosen");
    }

    const data: UjianResponse = await response.json();
    if (!data?.data?.length) return [];

    // 🔧 Pastikan semua ID jadi number agar tidak gagal dibandingkan
    const filteredData = data.data
      .filter((ujian) => {
        const prodiMatch =
          Number(ujian.mahasiswa?.prodi?.id) === Number(prodiId);
        const statusMatch = ujian.pendaftaranUjian?.status === "dijadwalkan";
        return prodiMatch && statusMatch;
      })
      .map((ujian) => {
        let peran: string | null = null;
        const dosenIdNum = Number(dosenId);

        if (Number(ujian.ketuaPenguji?.id) === dosenIdNum)
          peran = "Ketua Penguji";
        else if (Number(ujian.sekretarisPenguji?.id) === dosenIdNum)
          peran = "Sekretaris Penguji";
        else if (Number(ujian.penguji1?.id) === dosenIdNum) peran = "Penguji 1";
        else if (Number(ujian.penguji2?.id) === dosenIdNum) peran = "Penguji 2";

        return { ...ujian, peranPenguji: peran };
      })
      // 🚀 tampilkan hanya ujian yang memang relevan dengan dosen tsb
      .filter((ujian) => ujian.peranPenguji !== null);
    console.log(
      "🔎 Filter result:",
      filteredData.map((u) => ({
        id: u.id,
        nama: u.mahasiswa?.nama,
        peran: u.peranPenguji,
      }))
    );

    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian by prodi and dosen:", error);
    return [];
  }
}

// ✅ Schema validasi input
const JadwalUjianSchema = z.object({
  pendaftaranUjianId: z.coerce
    .number()
    .min(1, "ID pendaftaran ujian tidak valid"),
  mahasiswaId: z.coerce.number().min(1, "ID mahasiswa tidak valid"),
  jenisUjianId: z.coerce.number().min(1, "ID jenis ujian tidak valid"),
  tanggalUjian: z.string().nonempty("Tanggal ujian wajib diisi"),
  waktuMulai: z.string().nonempty("Waktu mulai wajib diisi"),
  waktuSelesai: z.string().nonempty("Waktu selesai wajib diisi"),
  ruangan: z.string().min(3, "Nama ruangan minimal 3 karakter"),
  ketuaPenguji: z.coerce.number().min(1, "Ketua penguji tidak valid"),
  sekretarisPenguji: z.coerce.number().min(1, "Sekretaris penguji tidak valid"),
  penguji1: z.coerce.number().min(1, "Dosen penguji 1 wajib diisi"),
  penguji2: z.coerce.number().min(1, "Dosen penguji 2 wajib diisi"),
});


export async function jadwalkanUjianAction(formData: FormData) {
  try {
    // 1️⃣ Ambil dan ubah formData jadi object biasa
    const rawData = Object.fromEntries(formData.entries());
    console.log("📦 Raw form data:", rawData);

    // 2️⃣ Validasi pakai Zod
    const parsed = JadwalUjianSchema.safeParse(rawData);
    if (!parsed.success) {
      console.error("❌ Validasi gagal:", parsed.error.flatten().fieldErrors);
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ||
        "Form tidak valid";
      throw new Error(firstError);
    }

    const {
      pendaftaranUjianId,
      mahasiswaId,
      jenisUjianId,
      tanggalUjian,
      waktuMulai,
      waktuSelesai,
      ruangan,
      ketuaPenguji,
      sekretarisPenguji,
      penguji1,
      penguji2,
    } = parsed.data;

    // 3️⃣ Tentukan hari otomatis
    const hariMap: Record<string, string> = {
      sunday: "minggu",
      monday: "senin",
      tuesday: "selasa",
      wednesday: "rabu",
      thursday: "kamis",
      friday: "jumat",
      saturday: "sabtu",
    };
    const jsDay = new Date(tanggalUjian)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const hariUjian = hariMap[jsDay] || jsDay;

    // 4️⃣ Format waktu & jadwal ujian
    const waktuMulaiWithSeconds =
      waktuMulai.length === 5 ? `${waktuMulai}:00` : waktuMulai;
    const jadwalUjian = `${tanggalUjian}T${waktuMulaiWithSeconds}`;

    console.log("✅ Data final yang dikirim ke backend:", {
      pendaftaranUjianId,
      mahasiswaId,
      jenisUjianId,
      jadwalUjian,
      waktuMulai,
      waktuSelesai,
      ruangan,
      ketuaPenguji,
      sekretarisPenguji,
      penguji1,
      penguji2,
      hariUjian,
    });

    // 5️⃣ POST ke API ujian
    const ujianRes = await fetch("http://localhost:8000/api/ujian", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pendaftaranUjianId,
        mahasiswaId,
        jenisUjianId,
        jadwalUjian,
        waktuMulai,
        waktuSelesai,
        ruangan,
        ketuaPenguji,
        sekretarisPenguji,
        penguji1,
        penguji2,
        hariUjian,
      }),
      cache: "no-store",
    });

    if (!ujianRes.ok) {
      const text = await ujianRes.text();
      throw new Error(`Gagal menjadwalkan ujian: ${text}`);
    }

    // 6️⃣ Update status pendaftaran ujian
    const updateRes = await fetch(
      `http://localhost:8000/api/pendaftaran-ujian/${pendaftaranUjianId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dijadwalkan" }),
        cache: "no-store",
      }
    );

    if (!updateRes.ok) {
      const text = await updateRes.text();
      throw new Error(`Gagal update status: ${text}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error("❌ Error jadwalkan ujian:", err);
    return { success: false, message: err.message || "Terjadi kesalahan" };
  }
}
