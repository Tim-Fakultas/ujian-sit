"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function uploadDosenSignatureAction(formData: FormData) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) {
    throw new Error("Unauthorized");
  }

  const user = JSON.parse(userCookie);
  const dosenId = user.id;

  try {
    // Laravel usually implies method spoofing for PUT with files
    formData.append("_method", "PUT");

    const response = await fetch(`${apiUrl}/dosen/${dosenId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Upload TTD error response:", text);
      throw new Error(`Upload failed: ${response.status} - ${text}`);
    }

    // Paksa revalidasi cache Next.js agar data di server components diperbarui
    revalidatePath("/dosen/profile");
    revalidatePath("/(routes)/dosen/profile", "page");

    // Update cookie user agar data terbaru (termasuk url_ttd) tersedia di server components
    try {
      const { refreshUserAction } = await import("@/actions/auth");
      const updatedUser = await refreshUserAction();
      console.log(
        "Cookie user synced successfully after upload",
        updatedUser?.url_ttd,
      );
    } catch (e) {
      console.error("Failed to sync user cookie after upload:", e);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Upload TTD full error object:", error);
    throw new Error(error.message || "Gagal mengunggah tanda tangan");
  }
}

export async function getDosenSignatureAction() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) return null;

  try {
    const user = JSON.parse(userCookie);
    const userId = user.user_id || user.id;

    const response = await fetch(`${apiUrl}/dosen?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;
    const result = await response.json();

    if (result?.data && result.data.length > 0) {
      const d = result.data[0];
      return (
        d.urlTtd ||
        d.url_ttd ||
        d.ttd ||
        d.ttd_path ||
        d.ttd_url ||
        d.url_ttd_path ||
        d.path_ttd ||
        null
      );
    }

    return null;
  } catch (error) {
    console.error("Get Signature Error:", error);
    return null;
  }
}
