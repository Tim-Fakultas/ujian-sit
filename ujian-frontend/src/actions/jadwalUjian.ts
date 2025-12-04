"use server";
import { UjianResponse } from "@/types/Ujian";
import { z } from "zod";

import { cookies } from "next/headers";

export async function getJadwalUjianByMahasiswaId(mahasiswaId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/ujian`, {
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
        ujian.pendaftaranUjian?.status !== "menunggu"
    );

    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian by mahasiswa:", error);
    return [];
  }
}

export async function getJadwalUjianByProdi(prodiId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/ujian`);

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/ujian`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian by prodi and dosen");
    }

    const data: UjianResponse = await response.json();
    if (!data?.data?.length) return [];

    const filteredData = data.data
      .filter((ujian) => {
        const prodiMatch =
          Number(ujian.mahasiswa?.prodi?.id) === Number(prodiId);

        const statusMatch = ujian.pendaftaranUjian?.status === "dijadwalkan";

        // 🔥 CARI penguji yang perannya cocok dengan dosen ini
        const pengujiFound = ujian.penguji?.find(
          (p) => Number(p.id) === Number(dosenId)
        );

        return prodiMatch && statusMatch && pengujiFound;
      })
      .map((ujian) => {
        // ketahui peran spesifik dosen tersebut
        const pengujiFound = ujian.penguji.find(
          (p) => Number(p.id) === Number(dosenId)
        );

        let peran = null;
        switch (pengujiFound?.peran) {
          case "ketua_penguji":
            peran = "Ketua Penguji";
            break;
          case "sekretaris_penguji":
            peran = "Sekretaris Penguji";
            break;
          case "penguji_1":
            peran = "Penguji 1";
            break;
          case "penguji_2":
            peran = "Penguji 2";
            break;
          default:
            peran = null;
        }

        return { ...ujian, peranPenguji: peran };
      })
      .filter((ujian) => ujian.peranPenguji !== null);

    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian by prodi and dosen:", error);
    return [];
  }
}

const JadwalUjianSchema = z.object({
  jadwalUjian: z.string().nonempty("Tanggal ujian wajib diisi"),
  waktuMulai: z.string().nonempty("Waktu mulai wajib diisi"),
  waktuSelesai: z.string().nonempty("Waktu selesai wajib diisi"),
  ruanganId: z.coerce.number().min(1, "Ruangan wajib diisi"),

  ketuaPenguji: z.coerce.number().min(1, "Ketua penguji wajib diisi"),
  sekretarisPenguji: z.coerce.number().min(1, "Sekretaris penguji wajib diisi"),
  penguji1: z.coerce.number().min(1, "Penguji 1 wajib diisi"),
  penguji2: z.coerce.number().min(1, "Penguji 2 wajib diisi"),
});

export async function jadwalkanUjianAction(formData: FormData) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = JadwalUjianSchema.safeParse(rawData);

    if (!parsed.success) {
      const first =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ||
        "Form tidak valid";
      throw new Error(first);
    }

    const {
      jadwalUjian,
      waktuMulai,
      waktuSelesai,
      ruanganId,
      ketuaPenguji,
      sekretarisPenguji,
      penguji1,
      penguji2,
    } = parsed.data;

    const ruanganIdNum = Number(ruanganId);

    const ujianId = formData.get("ujianId");
    if (!ujianId) throw new Error("ID ujian tidak ditemukan.");

    // Ambil token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Token tidak ditemukan. Silakan login ulang.");

    // ==========================
    // PENGIRIMAN FORMAT BARU 🔥
    // ==========================
    const payload = {
      jadwalUjian,
      waktuMulai,
      waktuSelesai,
      ruanganId: ruanganIdNum,
      penguji: [
        { peran: "ketua_penguji", dosenId: Number(ketuaPenguji) },
        { peran: "sekretaris_penguji", dosenId: Number(sekretarisPenguji) },
        { peran: "penguji_1", dosenId: Number(penguji1) },
        { peran: "penguji_2", dosenId: Number(penguji2) },
      ],
    };

    const res = await fetch(`${apiUrl}/ujian/${ujianId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      
      body: JSON.stringify(payload),
    });

    // Error handler
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
    return {
      success: false,
      message: err instanceof Error ? err.message : "Gagal menjadwalkan ujian",
    };
  }
}
