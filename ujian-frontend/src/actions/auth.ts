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

  const res = await fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nip_nim, password }),
  });

  // 🔥 1. Handle RATE LIMIT 429 (tanpa parsing JSON)
  if (res.status === 429) {
    return {
      success: false,
      message: "Terlalu banyak percobaan login. Silakan coba lagi nanti.",
    };
  }

  // 🔥 2. Coba parse JSON, kalau gagal -> berarti HTML (error Laravel)
  try {
    data = await res.json();
  } catch (err) {
    // Ini terjadi kalau response HTML dari Laravel
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

  // ================================
  // ⬇️ Kalau sukses login baru lanjut
  // ================================
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
