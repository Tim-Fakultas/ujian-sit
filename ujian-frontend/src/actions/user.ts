"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { refreshUserAction } from "./auth";

export async function updateUserProfileAction(data: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) {
    return { success: false, message: "Unauthorized" };
  }

  const user = JSON.parse(userCookie);
  const role = user.role?.toLowerCase();
  const userId = user.id;

  let endpoint = "";
  let payload = { ...data };

  // Mapping role to endpoint
  if (role === "mahasiswa") {
    endpoint = `/mahasiswa/${userId}`;
    // Normalize fields for student
    payload = {
      ...payload,
      noHp: data.no_hp,
      peminatanId: data.peminatan_id,
      prodiId: data.prodi_id,
    };
    
    // Clean up internal fields
    delete payload.no_hp;
    delete payload.peminatan_id;
    delete payload.prodi_id;
    delete payload.nim;
    delete payload.nama;
  } else {
    // Dosen, Kaprodi, Sekprodi, Admin
    endpoint = `/dosen/${userId}`;
    
    // Normalize fields for staff/dosen
    payload = {
      ...payload,
      noHp: data.no_hp,
      tempatTanggalLahir: data.tempat_tanggal_lahir,
      tmtFst: data.tmt_fst,
    };

    delete payload.no_hp;
    delete payload.tempat_tanggal_lahir;
    delete payload.tmt_fst;
    delete payload.nip_nim;
    delete payload.nidn;
    delete payload.nip;
    delete payload.nama;
  }

  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
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
      return { 
        success: false, 
        message: responseData.message || "Gagal memperbarui profil",
        errors: responseData.errors 
      };
    }

    // Refresh user data in cookie
    await refreshUserAction();

    // Revalidate relevant paths
    revalidatePath("/mahasiswa/profile");
    revalidatePath("/dosen/profile");
    revalidatePath("/admin/profile");
    revalidatePath("/kaprodi/profile");
    revalidatePath("/sekprodi/profile");
    revalidatePath("/super-admin/profile");

    return { success: true, message: "Profil berhasil diperbarui" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: "Terjadi kesalahan sistem" };
  }
}
