// src/app/page.tsx
// app/page.tsx (misal halaman root atau login)
import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/actions/loginAction";

export default async function Home() {
  const { token, user } = await getCurrentUserAction();

  // Jika user sudah login (ada token di cookies)
  if (token && user) {
    // Redirect sesuai role
    redirect(`/${user.role || "mahasiswa"}/dashboard`);
  }

  // Jika belum login, tetap render halaman login
  redirect("/login");
}
