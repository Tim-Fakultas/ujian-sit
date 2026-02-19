// src/app/page.tsx
// app/page.tsx (misal halaman root atau login)
import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/actions/auth";

export default async function Home() {
  const { token, user } = await getCurrentUserAction();

  // Jika user sudah login (ada token di cookies)
  if (token && user) {
    const routes: Record<string, string> = {
      "super admin": "/super-admin/dashboard",
      admin: "/admin/dashboard",
      "admin prodi": "/admin/dashboard",
      kaprodi: "/kaprodi/dashboard",
      sekprodi: "/sekprodi/dashboard",
      dosen: "/dosen/dashboard",
      mahasiswa: "/mahasiswa/dashboard",
    };

    const role = user.role || "mahasiswa";
    redirect(routes[role] || "/login");
  }

  // Jika belum login, tetap render halaman login
  redirect("/login");
}
