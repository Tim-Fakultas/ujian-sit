/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { User } from "@/types/Auth";
import { loginSchema } from "@/lib/validations/auth";

export async function loginAction(formData: FormData) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Validate with Zod server-side
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Data input tidak valid.",
    };
  }

  const { nip_nim, password } = validatedFields.data;

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
      message: data.message || "Username / Password salah",
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
          no_hp: m.noHp || m.no_hp || m.phone,
          alamat: m.alamat || m.address,
          semester: m.semester,
          ipk: m.ipk,
          status: m.status,
          angkatan: m.angkatan,
          user_id: m.userId || m.user_id,
          prodi: m.prodi, // {id, nama} from resource
          peminatan: m.peminatan,
          url_ktm: m.urlKtm || m.url_ktm,
          url_transkrip_nilai: m.urlTranskripNilai || m.url_transkrip_nilai,
          url_bukti_lulus_metopen: m.urlBuktiLulusMetopen || m.url_bukti_lulus_metopen,
          email: m.user?.email || newUser.email,
          // map pembimbing if needed
        };
      }
    } else if (["dosen", "kaprodi", "sekprodi", "admin prodi", "admin"].includes(role)) {
      // Logic for Dosen & Staff roles
      // 1. Try to fetch as Dosen first if they have a Dosen ID (staleUser.id for dosen role is dosen.id)
      // For Kaprodi/Admin, staleUser.id is user.id, so we might need a different way to find dosen_id
      // but if the login returned the dosen_id as 'id', it works.
      // Let's assume if it's 'dosen' role, 'id' is dosen_id.
      // If it's other roles, 'id' is user_id.

      let res;
      if (role === "dosen") {
        res = await fetchWithToken(`/dosen/${staleUser.id}`);
      } else {
        // Find if this user has a dosen profile
        // Backend DosenController usually has an index or we can try to find by user_id
        // Actually, let's just fetch /user first to get user details
        const userRes = await fetchWithToken(`/user`);
        if (userRes) {
          newUser = { ...newUser, ...userRes };
          // If the backend AuthController.getUserDataByRole returned prodi, it's already there
          if (userRes.prodi_id && !newUser.prodi) {
            const prodiRes = await fetchWithToken(`/prodi/${userRes.prodi_id}`);
            if (prodiRes?.data) {
              newUser.prodi = {
                ...prodiRes.data,
                nama: prodiRes.data.nama || prodiRes.data.namaProdi || prodiRes.data.nama_prodi,
              };
            }
          }
        }

        // Try to fetch Dosen data if user_id is known
        const dosenListRes = await fetchWithToken(`/dosen?user_id=${staleUser.user_id || staleUser.id}`);
        if (dosenListRes && dosenListRes.data && dosenListRes.data.length > 0) {
          const d = dosenListRes.data[0];
          newUser = {
            ...newUser,
            id: d.id,
            nama: d.nama,
            nidn: d.nidn,
            nip: d.nip,
            no_hp: d.noHp,
            alamat: d.alamat,
            tempat_tanggal_lahir: d.tempatTanggalLahir,
            pangkat: d.pangkat,
            golongan: d.golongan,
            jabatan: d.jabatan,
            tmt_fst: d.tmtFst,
            foto: d.foto,
            prodi: d.prodi || newUser.prodi,
            user_id: d.userId,
          };
        }
        return newUser;
      }

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
          tempat_tanggal_lahir: d.tempatTanggalLahir,
          pangkat: d.pangkat,
          golongan: d.golongan,
          jabatan: d.jabatan,
          tmt_fst: d.tmtFst,
          foto: d.foto,
          prodi: d.prodi,
          user_id: d.userId,
        };
      }
    } else {
      // Logic for others
      const userRes = await fetchWithToken(`/user`);
      if (userRes) {
        newUser = { ...newUser, ...userRes };
      }
    }

    // Log the refreshed user data for debugging

    // Refresh the cookie (only works in Server Actions / Route Handlers)
    // When called from a Server Component during render, cookies().set() throws or warns.
    try {
      const canSetCookies = !!cookieStore.set;
      if (canSetCookies) {
        cookieStore.set("user", JSON.stringify(newUser), {
          httpOnly: false,
          path: "/",
          maxAge: 60 * 60 * 6,
        });
      }
    } catch (e: any) {
      // Ssssh! We expect this might fail in some Next.js render contexts.
      // The updated newUser is still returned and used by the caller.
    }

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
