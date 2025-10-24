import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userCookie = req.cookies.get("user")?.value;
  const token = req.cookies.get("token")?.value;

  console.log("➡️ Path:", pathname);
  console.log("🔑 Token:", !!token);
  console.log("👤 User cookie:", userCookie ? "ada" : "tidak ada");

  // -----------------------------
  // 1️⃣ Kalau belum login tapi akses halaman role → redirect ke /login
  // -----------------------------
  const protectedRoutes = [
    "/admin",
    "/super-admin",
    "/kaprodi",
    "/sekprodi",
    "/dosen",
    "/mahasiswa",
  ];

  const isProtected = protectedRoutes.some((p) => pathname.startsWith(p));

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // -----------------------------
  // 2️⃣ Kalau sudah login tapi buka /login → redirect ke dashboard sesuai role
  // -----------------------------
  if (token && pathname.startsWith("/login")) {
    try {
      const user = userCookie ? JSON.parse(userCookie) : null;
      const role =
        user?.roles?.[0]?.name?.toLowerCase?.() ||
        user?.role?.toLowerCase?.() ||
        "user";

      const redirectMap: Record<string, string> = {
        "super admin": "/super-admin/dashboard",
        admin: "/admin/dashboard",
        "admin prodi": "/admin/dashboard",
        kaprodi: "/kaprodi/dashboard",
        sekprodi: "/sekprodi/dashboard",
        dosen: "/dosen/dashboard",
        mahasiswa: "/mahasiswa/dashboard",
      };

      const redirectUrl = redirectMap[role] || "/login";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    } catch (err) {
      console.error("Failed to parse user cookie:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // -----------------------------
  // 3️⃣ Role tidak sesuai (misal mahasiswa buka /admin)
  // -----------------------------
  if (token && userCookie && isProtected) {
    try {
      const user = JSON.parse(userCookie);
      const role: string =
        user?.roles?.[0]?.name?.toLowerCase?.() ||
        user?.role?.toLowerCase?.() ||
        "user";

      const allowedPrefixes: Record<string, string[]> = {
        "super admin": ["/super-admin"],
        admin: ["/admin"],
        "admin prodi": ["/admin"],
        kaprodi: ["/kaprodi"],
        sekprodi: ["/sekprodi"],
        dosen: ["/dosen"],
        mahasiswa: ["/mahasiswa"],
      };

      const isAllowed = allowedPrefixes[role]?.some((p) =>
        pathname.startsWith(p)
      );

      if (!isAllowed) {
        const redirectMap: Record<string, string> = {
          "super admin": "/super-admin/dashboard",
          admin: "/admin/dashboard",
          "admin prodi": "/admin/dashboard",
          kaprodi: "/kaprodi/dashboard",
          sekprodi: "/sekprodi/dashboard",
          dosen: "/dosen/dashboard",
          mahasiswa: "/mahasiswa/dashboard",
        };

        const redirectUrl = redirectMap[role] || "/login";
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    } catch (err) {
      console.error("Middleware user parse error:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // -----------------------------
  // Default → lanjutkan request
  // -----------------------------
  return NextResponse.next();
}

// 🔍 Middleware hanya aktif di halaman tertentu
export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/super-admin/:path*",
    "/kaprodi/:path*",
    "/sekprodi/:path*",
    "/dosen/:path*",
    "/mahasiswa/:path*",
  ],
};
