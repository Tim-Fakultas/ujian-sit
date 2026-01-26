"use server";
import { UjianResponse } from "@/types/Ujian";
import { z } from "zod";

import { cookies } from "next/headers";

// GET JADWAL UJIAN BY MAHASISWA ID
export async function getJadwalUjianByMahasiswaId(mahasiswaId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}/ujian`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian by mahasiswa");
    }

    const data: UjianResponse = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching ujian by mahasiswa:", error);
    return [];
  }
}

export async function getPreviousUjian(mahasiswaId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}/ujian?nama_jenis=Proposal`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian by mahasiswa");
    }

    const data: UjianResponse = await response.json();
    const prevUjian = data?.data || [];

    return prevUjian;

  } catch (error) {
    console.error("Error fetching ujian proposal:", error);
    return [];
  }
}

// GET JADWAL UJIAN BY PRODI
export async function getPenjadwalanUjianByProdi(prodiId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/ujian`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ujian by prodi");
    }

    const data: UjianResponse = await response.json();
    if (!data?.data?.length) return [];

    const filteredData = data.data
      .filter(
        (ujian) =>
          Number(ujian.mahasiswa?.prodi?.id) === Number(prodiId) &&
          (ujian.pendaftaranUjian?.status === "belum dijadwalkan" ||
            ujian.pendaftaranUjian?.status === "dijadwalkan")
      )
      .sort((a, b) => {
        // Urutkan "belum dijadwalkan" di atas
        const statusA = a.pendaftaranUjian?.status;
        const statusB = b.pendaftaranUjian?.status;

        if (statusA === "belum dijadwalkan" && statusB !== "belum dijadwalkan")
          return -1;
        if (statusA !== "belum dijadwalkan" && statusB === "belum dijadwalkan")
          return 1;

        // Sort by jadwalUjian (descending, terbaru di atas)
        const dateA = new Date(a.jadwalUjian ?? 0).getTime();
        const dateB = new Date(b.jadwalUjian ?? 0).getTime();
        return dateB - dateA;
      });
    console.log(filteredData)
    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian by prodi:", error);
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
    const filteredData = data.data
      .filter(
        (ujian) =>
          ujian.mahasiswa.prodi.id === prodiId &&
          ujian.pendaftaranUjian.status === "dijadwalkan"
      )
      .sort((a, b) => {
        // Sort by jadwalUjian (descending, terbaru di atas)
        const dateA = new Date(a.jadwalUjian ?? 0).getTime();
        const dateB = new Date(b.jadwalUjian ?? 0).getTime();
        return dateB - dateA;
      });
    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian ujian by prodi:", error);
    return [];
  }
}

// GET JADWAL UJIAN BY DOSEN PENGUJI
export async function getJadwalUjianDosen(dosenId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/ujian`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch ujian by dosen");
    }
    const data: UjianResponse = await response.json();
    // Filter where dosen found in penguji list
    const filteredData = data.data.filter((ujian) =>
      ujian.penguji?.some((p) => Number(p.id) === Number(dosenId))
    );
    // Sort by jadwalUjian
    return filteredData.sort((a, b) => {
      const dateA = new Date(a.jadwalUjian ?? 0).getTime();
      const dateB = new Date(b.jadwalUjian ?? 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching ujian by dosen:", error);
    return [];
  }
}

// GET JADWAL UJIAN BY PRODI & DOSEN
export async function getJadwalUjianByProdiByDosen({
  prodiId,
  dosenId,
}: {
  prodiId: number | undefined;
  dosenId: number | undefined;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const today = new Date().toISOString().split("T")[0];

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

        const pengujiFound = ujian.penguji?.some(
          (p) => Number(p.id) === Number(dosenId)
        );

        // const isToday = ujian.jadwalUjian?.startsWith(today);

        return prodiMatch && statusMatch && pengujiFound;
      })
      .sort((a, b) => {
        const dateA = new Date(a.jadwalUjian ?? 0).getTime();
        const dateB = new Date(b.jadwalUjian ?? 0).getTime();
        return dateB - dateA;
      });

    return filteredData;
  } catch (error) {
    console.error("Error fetching ujian by prodi and dosen:", error);
    return [];
  }
}

// Jadwal Ujian Schema
const JadwalUjianSchema = z.object({
  jadwalUjian: z.string().nonempty("Tanggal ujian wajib diisi"),
  waktuMulai: z.string().optional(),
  waktuSelesai: z.string().optional(),
  ruanganId: z.coerce.number().min(1, "Ruangan wajib diisi"),

  ketuaPenguji: z.coerce.number().min(1, "Ketua penguji wajib diisi"),
  sekretarisPenguji: z.coerce.number().min(1, "Sekretaris penguji wajib diisi"),
  penguji1: z.coerce.number().min(1, "Penguji 1 wajib diisi"),
  penguji2: z.coerce.number().min(1, "Penguji 2 wajib diisi"),
});

// Jadwalkan Ujian Action
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
    // Error handler
    if (!res.ok) {
      const text = await res.text();
      let errorMessage = "Gagal menjadwalkan ujian";

      try {
        const data = JSON.parse(text);
        if (data.errors) {
          // Ambil error pertama saja atau gabungkan
          const errorsVec = Object.values(data.errors).flat();
          let combined = errorsVec.join(", ");

          // Translate common field names / messages
          combined = combined
            .replace(/waktuMulai/gi, "Waktu Mulai")
            .replace(/waktuSelesai/gi, "Waktu Selesai")
            .replace(/The\s+/gi, "")
            .replace(/ field/gi, "")
            .replace(/ must be a date after /gi, " harus setelah ")
            .replace(
              / must match the format H:i./gi,
              " format waktu tidak valid."
            )
            .replace(/ must be different./gi, " harus berbeda.");

          errorMessage = combined;
        } else if (data.message) {
          errorMessage = data.message;
        }
      } catch (e) {
        console.error("Failed to parse error response:", e);
        errorMessage = "Gagal menjadwalkan ujian: " + text;
      }

      throw new Error(errorMessage);
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Gagal menjadwalkan ujian",
    };
  }
}

export async function setUjianSelesai(pendaftaranId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(
      `${apiUrl}/pendaftaran-ujian/${pendaftaranId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ status: "selesai" }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to set ujian selesai");
    }
    return await response.json();
  } catch (error) {
    console.error("Error setting ujian selesai:", error);
  }
}

export async function setUjianDijadwalkan(pendaftaranId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(
      `${apiUrl}/pendaftaran-ujian/${pendaftaranId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ status: "dijadwalkan" }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to set ujian selesai");
    }
    return await response.json();
  } catch (error) {
    console.error("Error setting ujian selesai:", error);
  }
}

export async function setUjianBelumDijadwalkan(pendaftaranId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(
      `${apiUrl}/pendaftaran-ujian/${pendaftaranId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ status: "belum dijadwalkan" }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to set ujian belum dijadwalkan");
    }
    return await response.json();
  } catch (error) {
    console.error("Error setting ujian belum dijadwalkan:", error);
  }
}
