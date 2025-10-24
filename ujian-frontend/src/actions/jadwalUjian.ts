"use server";
import { UjianResponse } from "@/types/Ujian";
import { z } from "zod";

export async function getJadwalUjianByMahasiswaId(mahasiswaId: number) {
  try {
    const response = await fetch(`http://localhost:8000/api/ujian`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian by mahasiswa");
    }

    const data: UjianResponse = await response.json();
    if (!data?.data?.length) return [];

    // Filter ujian berdasarkan mahasiswaId dan status dijadwalkan
    const filteredData = data.data.filter(
      (ujian) =>
        Number(ujian.mahasiswa?.id) === Number(mahasiswaId) &&
        ujian.pendaftaranUjian?.status === "dijadwalkan"
    );

    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian by mahasiswa:", error);
    return [];
  }
}

export async function getJadwalaUjianByProdi(prodiId: number) {
  try {
    const response = await fetch(`http://localhost:8000/api/ujian`, {
      cache: "no-store",
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
    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian ujian by prodi:", error);
    return [];
  }
}

export async function getJadwalUjianByProdiByDosen({
  prodiId,
  dosenId,
}: {
  prodiId: number | undefined;
  dosenId: number | undefined;
}) {
  try {
    const response = await fetch(`http://localhost:8000/api/ujian`, {
      cache: "no-store",
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

import { cookies } from "next/headers";

const JadwalUjianSchema = z.object({
  jadwalUjian: z.string().nonempty("Tanggal ujian wajib diisi"),
  waktuMulai: z.string().nonempty("Waktu mulai wajib diisi"),
  waktuSelesai: z.string().nonempty("Waktu selesai wajib diisi"),
  ruanganId: z.coerce.number().min(1, "Ruangan wajib diisi"),
  penguji1: z.coerce.number().min(1, "Dosen penguji 1 wajib diisi"),
  penguji2: z.coerce.number().min(1, "Dosen penguji 2 wajib diisi"),
});

export async function jadwalkanUjianAction(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = JadwalUjianSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ||
        "Form tidak valid";
      throw new Error(firstError);
    }

    const {
      jadwalUjian,
      ruanganId,
      waktuMulai,
      waktuSelesai,
      penguji1,
      penguji2,
    } = parsed.data;

    // Validasi agar tidak NaN
    const ruanganIdNum = Number(ruanganId);
    const penguji1Num = Number(penguji1);
    const penguji2Num = Number(penguji2);

    if (
      isNaN(ruanganIdNum) ||
      isNaN(penguji1Num) ||
      isNaN(penguji2Num) ||
      ruanganIdNum < 1 ||
      penguji1Num < 1 ||
      penguji2Num < 1
    ) {
      throw new Error(
        "Input tidak valid: pastikan ruangan dan dosen penguji dipilih."
      );
    }

    const ujianId = formData.get("ujianId");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login ulang.");
    }

    const res = await fetch(`http://localhost:8000/api/ujian/${ujianId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        jadwalUjian,
        ruanganId: ruanganIdNum,
        waktuMulai,
        waktuSelesai,
        penguji1: penguji1Num,
        penguji2: penguji2Num,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.errors) {
          let combined = Object.values(data.errors).flat().join(", ");
          combined = combined
            .replaceAll("The ", "")
            .replaceAll(" field and ", " dan ")
            .replaceAll(" must be different.", " harus berbeda.");
          throw new Error(combined);
        }
        throw new Error(data.message || "Gagal menjadwalkan ujian");
      } catch {
        throw new Error("Gagal menjadwalkan ujian: " + text);
      }
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("❌ Error jadwalkan ujian:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Gagal menjadwalkan ujian",
    };
  }
}
