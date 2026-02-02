/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { User } from "@/types/Auth";

export async function loginAction(formData: FormData) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const nip_nim = String(formData.get("nip_nim") || "");
  const password = String(formData.get("password") || "");

  let data: any = null;
  let res;

  try {
    res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nip_nim, password }),
    });
  } catch (error) {
    console.error("Login fetch error:", error);
    return {
      success: false,
      message: "Gagal terhubung ke server backend. Pastikan server nyala.",
    };
  }

  // 1. Handle RATE LIMIT 429
  if (res.status === 429) {
    return {
      success: false,
      message: "Terlalu banyak percobaan login. Silakan coba lagi nanti.",
    };
  }

  // 2. Parse JSON
  try {
    data = await res.json();
  } catch {
    return {
      success: false,
      message: "Terjadi kesalahan server. Coba lagi nanti.",
    };
  }

  if (!res.ok || !data.success) {
    return {
      success: false,
      message: "Username / Password salah",
    };
  }

  // Success login
  const role =
    typeof data.role === "string"
      ? data.role.toLowerCase()
      : Array.isArray(data.roles)
        ? data.roles[0]?.toLowerCase()
        : "user";

  const normalizedRoles = Array.isArray(data.roles)
    ? data.roles.map((r: string, i: number) => ({ id: i + 1, name: r }))
    : [];

  const normalizedUser: User = {
    ...data.user,
    role,
    roles: normalizedRoles,
    is_default_password: data.is_default_password,
  };

  const cookieStore = await cookies();
  cookieStore.set("user", JSON.stringify(normalizedUser), {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 6,
  });

  cookieStore.set("token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 6,
  });

  const routes: Record<string, string> = {
    "super admin": "/super-admin/dashboard",
    admin: "/admin/dashboard",
    "admin prodi": "/admin/dashboard",
    kaprodi: "/kaprodi/dashboard",
    sekprodi: "/sekprodi/dashboard",
    dosen: "/dosen/dashboard",
    mahasiswa: "/mahasiswa/dashboard",
  };

  return redirect(routes[role] || "/login");
}

export async function getCurrentUserAction() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const tokenCookie = cookieStore.get("token")?.value;

  if (!userCookie || !tokenCookie) {
    return { user: null, token: null, isAuthenticated: false };
  }

  try {
    const user: User = JSON.parse(userCookie);
    return { user, token: tokenCookie, isAuthenticated: true };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("user");
  cookieStore.delete("token");

  redirect("/login");
}

export async function refreshUserAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) {
    return null;
  }

  try {
    const staleUser = JSON.parse(userCookie); // User structure from login
    // Get role safely
    const role =
      staleUser.role ||
      (staleUser.roles && staleUser.roles.length > 0
        ? staleUser.roles[0].name
        : "");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Helper fetcher
    const fetchWithToken = async (path: string) => {
      try {
        const res = await fetch(`${apiUrl}${path}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });
        if (!res.ok) return null;

        const text = await res.text();
        return text ? JSON.parse(text) : null;
      } catch (e) {
        console.error("Fetch error:", path, e);
        return null;
      }
    };

    let newUser: any = { ...staleUser };

    if (role === "mahasiswa") {
      // Logic for Mahasiswa: fetch /mahasiswa/{id} (Note: staleUser.id is the mahasiswa ID)
      const res = await fetchWithToken(`/mahasiswa/${staleUser.id}`);
      if (res && res.data) {
        const m = res.data;
        // Map Resource fields (camelCase) to Auth fields (snake_case/mixed)
        newUser = {
          ...newUser,
          id: m.id,
          nama: m.nama,
          nim: m.nim,
          no_hp: m.noHp,
          alamat: m.alamat,
          semester: m.semester,
          ipk: m.ipk,
          status: m.status,
          angkatan: m.angkatan,
          user_id: m.userId,
          prodi: m.prodi, // {id, nama} from resource
          peminatan: m.peminatan,
          // map pembimbing if needed
        };
      }
    } else if (role === "dosen") {
      // Logic for Dosen
      const res = await fetchWithToken(`/dosen/${staleUser.id}`);
      if (res && res.data) {
        const d = res.data;
        newUser = {
          ...newUser,
          id: d.id,
          nama: d.nama,
          nidn: d.nidn,
          nip: d.nip,
          no_hp: d.noHp,
          alamat: d.alamat,
          prodi: d.prodi,
          user_id: d.userId,
        };
      }
    } else {
      // Logic for Admin/Others (fetch /user)
      const userRes = await fetchWithToken(`/user`);
      if (userRes) {
        newUser = {
          ...newUser,
          ...userRes, // update basic info like name/email
          // prodi_id might be here, fetch prodi if needed
        };

        // If prodi_id exists, fetch prodi detail
        if (userRes.prodi_id) {
          const prodiRes = await fetchWithToken(`/prodi/${userRes.prodi_id}`);
          if (prodiRes && prodiRes.data) {
            // The ProdiResource returns {id, nama_prodi, ...}
            // We assign it to prodi
            newUser.prodi = prodiRes.data;
          }
        }
      }
    }

    // Refresh the cookie
    cookieStore.set("user", JSON.stringify(newUser), {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 6,
    });

    return newUser;
  } catch (error) {
    console.error("Failed to refresh user data:", error);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function changePasswordAction(data: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, message: "Unauthenticated" };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirmation: data.confirm_password,
      }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      if (res.status === 422) {
        return {
          success: false,
          message: responseData.message || "Validasi gagal",
          errors: responseData.errors,
        };
      }
      return {
        success: false,
        message: responseData.message || "Gagal mengubah password",
      };
    }

    return { success: true, message: "Password berhasil diubah" };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, message: "Terjadi kesalahan sistem" };
  }
}
