"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { User } from "@/types/Auth";

// ?LOGIN ACTION
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

  if (!res.ok || !data.success) {
    return { success: false, message: data.message || "Login gagal" };
  }

  // ✅ Ambil role dari root response
  const role =
    typeof data.role === "string"
      ? data.role.toLowerCase()
      : Array.isArray(data.roles)
      ? data.roles[0]?.toLowerCase()
      : "user";

  // ✅ Normalisasi roles menjadi object array
  const normalizedRoles = Array.isArray(data.roles)
    ? data.roles.map((r: string, i: number) => ({
        id: i + 1,
        name: r,
      }))
    : [];

  // ✅ Gabungkan user + role + roles
  const normalizedUser: User = {
    ...data.user,
    role,
    roles: normalizedRoles,
  };

  // ✅ Simpan user dan token ke cookies
  const cookieStore = await cookies();
  cookieStore.set("user", JSON.stringify(normalizedUser), {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 6, // 6 jam
  });

  cookieStore.set("token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 6,
  });

  console.log("✅ Saved user in cookie:", normalizedUser);

  // 🚀 Redirect sesuai role
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

// ===============================
//? GET CURRENT USER ACTION
// ===============================
export async function getCurrentUserAction() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const tokenCookie = cookieStore.get("token")?.value;

  if (!userCookie || !tokenCookie) {
    return { user: null, token: null, isAuthenticated: false };
  }

  try {
    const user: User = JSON.parse(userCookie);
    console.log("✅ Parsed user in getCurrentUserAction:", user);
    return { user, token: tokenCookie, isAuthenticated: true };
  } catch (error) {
    console.error("❌ Failed to parse user cookie:", error);
    return { user: null, token: null, isAuthenticated: false };
  }
}
