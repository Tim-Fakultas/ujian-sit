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

  // simpan token di cookie (httpOnly biar aman)
  cookies().set("token", data.access_token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  // simpan user di cookie biasa (kalau mau diakses di client)
  cookies().set("user", JSON.stringify(data.user), { path: "/" });

  return { success: true, user: data.user };
}
