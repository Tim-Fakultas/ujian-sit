"use server";

import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const nip_nim = String(formData.get("nip_nim") || "");
  const password = String(formData.get("password") || "");

  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nip_nim, password }),
    cache: "no-store",
  });

  const data = await res.json();

  // kalau gagal login
  if (!res.ok || !data.success) {
    return { success: false, message: data.message || "Login gagal" };
  }

  // ✅ Normalisasi struktur roles agar cocok dengan frontend & middleware
  const normalizedUser = {
    ...data.user,
    roles:
      data.user.roles && data.user.roles.length > 0
        ? data.user.roles
        : data.roles?.map((r: string, index: number) => ({
            id: index + 1,
            name: r,
            guard_name: "web",
          })),
  };

  // Simpan token di cookie (httpOnly agar aman)
  cookies().set("token", data.access_token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  // Simpan user di cookie biasa (agar bisa diakses client)
  cookies().set("user", JSON.stringify(normalizedUser), { path: "/" });

  return {
    success: true,
    user: normalizedUser,
    access_token: data.access_token,
  };
}
