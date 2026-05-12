"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateMahasiswaProfileAction(data: {
  ipk?: number;
  semester?: number;
  email?: string;
  alamat?: string;
  no_hp?: string;
  nim?: string;
  nama?: string;
  prodi_id?: number;
  peminatan_id?: number;
  url_ktm?: string;
  url_transkrip_nilai?: string;
  url_bukti_lulus_metopen?: string;
  url_sertifikat_bta?: string;
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) {
    throw new Error("Unauthorized");
  }

  const user = JSON.parse(userCookie);
  const mahasiswaId = user.id;

  // Check if email is being changed
  const shouldSendEmail = data.email && data.email !== user.email;

  const payload: any = {
    ...data,
    noHp: data.no_hp,
    peminatanId: data.peminatan_id,
    prodiId: data.prodi_id,
    alamat: data.alamat,
    ipk: data.ipk,
    semester: data.semester,
  };

  // Only include email if it changed
  if (!shouldSendEmail) {
    delete payload.email;
  }

  // Explicitly delete prohibited or redundant fields
  delete payload.nim;
  delete payload.nama;
  delete payload.prodi_id;
  delete payload.peminatan_id;
  delete payload.no_hp;
  delete payload.prodiId;

  try {
    const response = await fetch(`${apiUrl}/mahasiswa/${mahasiswaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Update profile error response:", responseData);

      if (response.status === 422) {
        const errorMessage = responseData.message || "Validasi gagal";
        const errorDetails = responseData.errors
          ? JSON.stringify(responseData.errors)
          : "";
        return { success: false, error: `${errorMessage} ${errorDetails}` };
      }

      throw new Error(
        `Update failed: ${response.status} - ${JSON.stringify(responseData)}`,
      );
    }

    revalidatePath("/mahasiswa/profile");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
}
