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

  const { nip_nim, password, remember } = validatedFields.data;

  let data: any = null;
  let res;

  try {
    res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ nip_nim, password, remember }),
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
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 6; // 30 days or 6 hours

  // Token disimpan di httpOnly cookie — aman dari XSS
  cookieStore.set("token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge,
  });

  // Enrichment: Ambil data lengkap dari tabel relasi (dosen/mahasiswa)
  let enrichedUser = normalizedUser;
  try {
    // Kirim token dan maxAge secara eksplisit agar cookie user durasinya
    // sama dengan cookie token (mempertimbangkan opsi remember).
    const freshUser = await refreshUserAction(data.access_token, maxAge);
    if (freshUser) {
      enrichedUser = freshUser;
    }
  } catch (e) {
    console.error("Enrichment during login failed:", e);
  }

  // User data disimpan di cookie biasa (non-httpOnly) agar bisa dibaca server components
  cookieStore.set("user", JSON.stringify(enrichedUser), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge,
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

  // Kembalikan enriched user data ke client agar disimpan di localStorage via Zustand store
  return {
    success: true,
    user: enrichedUser,
    redirectTo: routes[role] || "/login",
  };
}

export async function getCurrentUserAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token) {
    return { user: null, token: null, isAuthenticated: false };
  }

  // Jika cookie user sudah ada, gunakan langsung (cepat)
  if (userCookie) {
    try {
      const user: User = JSON.parse(userCookie);
      if (user && user.nama) {
        return { user, token, isAuthenticated: true };
      }
    } catch {
      // Cookie rusak, lanjut ke fallback
    }
  }

  // Fallback: fetch data lengkap dari API dan update cookie user
  // Terjadi saat: session lama (sebelum cookie user di-set), atau cookie user corrupt
  try {
    const freshUser = await refreshUserAction();
    if (freshUser) {
      return { user: freshUser as User, token, isAuthenticated: true };
    }
    return { user: null, token: null, isAuthenticated: false };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("user");

  redirect("/login");
}

export async function refreshUserAction(
  providedToken?: string,
  maxAge?: number,
) {
  const cookieStore = await cookies();
  const token = providedToken || cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

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

  try {
    // Fetch user data dari backend untuk mendapatkan data terbaru
    const userRes = await fetchWithToken(`/user`);
    if (!userRes) return null;

    const role =
      typeof userRes.role === "string"
        ? userRes.role.toLowerCase()
        : Array.isArray(userRes.roles) && userRes.roles.length > 0
          ? typeof userRes.roles[0] === "string"
            ? userRes.roles[0].toLowerCase()
            : (
                userRes.roles[0]?.name ||
                userRes.roles[0]?.nama ||
                ""
              ).toLowerCase()
          : "";

    const normalizedRoles = Array.isArray(userRes.roles)
      ? userRes.roles.map((r: any, i: number) =>
          typeof r === "string"
            ? { id: i + 1, name: r.toLowerCase() }
            : {
                id: r.id || i + 1,
                name: (r.name || r.nama || "").toLowerCase(),
              },
        )
      : [];

    let newUser: any = {
      ...userRes,
      role,
      roles: normalizedRoles,
      is_default_password:
        userRes.is_default_password ?? userRes.isDefaultPassword,
    };

    if (role === "mahasiswa") {
      const res = await fetchWithToken(`/mahasiswa?user_id=${userRes.id}`);
      if (res?.data && res.data.length > 0) {
        const m = res.data[0];
        newUser = {
          ...newUser,
          id: m.id,
          nama: m.nama,
          nim: m.nim,
          no_hp: m.noHp || m.no_hp || m.phone,
          alamat: m.alamat || m.address || m.alamat_domisili,
          semester: m.semester,
          ipk: m.ipk,
          status: m.status,
          angkatan: m.angkatan,
          user_id: m.userId || m.user_id,
          prodi: m.prodi,
          peminatan: m.peminatan,
          dosen_pa:
            m.dosenPA || m.dosen_pa || m.dosenPa || m.pembimbing_akademik,
          pembimbing1: m.pembimbing1 || m.pembimbing_1,
          pembimbing2: m.pembimbing2 || m.pembimbing_2,
          url_ktm: m.urlKtm || m.url_ktm,
          url_transkrip_nilai: m.urlTranskripNilai || m.url_transkrip_nilai,
          url_bukti_lulus_metopen:
            m.urlBuktiLulusMetopen || m.url_bukti_lulus_metopen,
          url_sertifikat_bta: m.urlSertifikatBta || m.url_sertifikat_bta,
          email: m.user?.email || newUser.email,
        };
      }
    } else if (
      ["dosen", "kaprodi", "sekprodi", "admin prodi", "admin"].includes(role)
    ) {
      if (role === "dosen") {
        const res = await fetchWithToken(`/dosen?user_id=${userRes.id}`);
        if (res?.data && res.data.length > 0) {
          const d = res.data[0];
          newUser = {
            ...newUser,
            id: d.id,
            nama: d.nama,
            nidn: d.nidn,
            nip: d.nip,
            no_hp: d.noHp || d.no_hp || d.phone,
            alamat: d.alamat || d.address || d.alamat_domisili,
            tempat_tanggal_lahir:
              d.tempatTanggalLahir || d.tempat_tanggal_lahir,
            pangkat: d.pangkat || d.pangkat_golongan,
            golongan: d.golongan,
            jabatan: d.jabatan || d.jabatan_fungsional,
            tmt_fst: d.tmtFst || d.tmt_fst,
            foto: d.foto,
            prodi: d.prodi
              ? {
                  ...d.prodi,
                  nama: d.prodi.nama || d.prodi.nama_prodi || d.prodi.namaProdi,
                }
              : newUser.prodi,
            user_id: d.userId || d.user_id,
            url_ttd:
              d.urlTtd ||
              d.url_ttd ||
              d.ttd ||
              d.ttd_path ||
              d.ttd_url ||
              d.url_ttd_path ||
              d.path_ttd,
          };
        }
      } else {
        // Kaprodi, Sekprodi, Admin, etc.
        // Jika prodi ada tapi tidak punya field 'nama' standar, normalisasi dulu
        if (newUser.prodi && !newUser.prodi.nama) {
          newUser.prodi = {
            ...newUser.prodi,
            nama:
              newUser.prodi.nama_prodi ||
              newUser.prodi.namaProdi ||
              newUser.prodi.nama,
          };
        }

        // Jika prodi belum ada sama sekali, coba ambil dari endpoint prodi
        if (userRes.prodi_id && (!newUser.prodi || !newUser.prodi.nama)) {
          const prodiRes = await fetchWithToken(`/prodi/${userRes.prodi_id}`);
          if (prodiRes?.data) {
            newUser.prodi = {
              ...prodiRes.data,
              nama:
                prodiRes.data.nama ||
                prodiRes.data.namaProdi ||
                prodiRes.data.nama_prodi,
            };
          }
        }

        const dosenListRes = await fetchWithToken(
          `/dosen?user_id=${userRes.id}`,
        );
        if (dosenListRes?.data && dosenListRes.data.length > 0) {
          const d = dosenListRes.data[0];
          newUser = {
            ...newUser,
            id: d.id,
            nama: d.nama,
            nidn: d.nidn,
            nip: d.nip,
            no_hp: d.noHp || d.no_hp || d.phone,
            alamat: d.alamat || d.address || d.alamat_domisili,
            tempat_tanggal_lahir:
              d.tempatTanggalLahir || d.tempat_tanggal_lahir,
            pangkat: d.pangkat || d.pangkat_golongan,
            golongan: d.golongan,
            jabatan: d.jabatan || d.jabatan_fungsional,
            tmt_fst: d.tmtFst || d.tmt_fst,
            foto: d.foto,
            prodi: d.prodi
              ? {
                  ...d.prodi,
                  nama: d.prodi.nama || d.prodi.nama_prodi || d.prodi.namaProdi,
                }
              : d.prodi || newUser.prodi,
            user_id: d.userId || d.user_id,
            url_ttd:
              d.urlTtd ||
              d.url_ttd ||
              d.ttd ||
              d.ttd_path ||
              d.ttd_url ||
              d.url_ttd_path ||
              d.path_ttd,
          };
        }
      }
    }

    // Update cookie user dengan data terbaru
    // maxAge disamakan dengan cookie token agar tidak expired duluan
    const cookieMaxAge = maxAge ?? 60 * 60 * 6; // default 6 jam
    try {
      cookieStore.set("user", JSON.stringify(newUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: cookieMaxAge,
      });
    } catch {
      // Mungkin gagal di beberapa konteks render Next.js, tidak apa-apa
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/change-password`,
      {
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
      },
    );

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
