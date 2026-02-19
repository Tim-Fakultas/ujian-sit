import { cookies } from "next/headers";
import type { User } from "@/types/Auth";

/**
 * Mengambil auth state dari server cookie:
 * - Token dari httpOnly cookie (aman dari XSS)
 * - User data dari cookie biasa (non-httpOnly, di-set saat login)
 *
 * Digunakan di Server Components / Layouts.
 */
export async function getAuthFromCookies(): Promise<{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token) {
    return { user: null, token: null, isAuthenticated: false };
  }

  try {
    const user: User | null = userCookie ? JSON.parse(userCookie) : null;
    return { user, token, isAuthenticated: true };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
}
