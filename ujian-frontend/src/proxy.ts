import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mapping role ke dashboard default
const dashboardRoutes: Record<string, string> = {
  "super admin": "/super-admin/dashboard",
  admin: "/admin/dashboard",
  "admin prodi": "/admin/dashboard",
  kaprodi: "/kaprodi/dashboard",
  sekprodi: "/sekprodi/dashboard",
  dosen: "/dosen/dashboard",
  mahasiswa: "/mahasiswa/dashboard",
};

// Mapping route prefix ke allowed roles
const routeRoles: Record<string, string[]> = {
  "/super-admin": ["super admin"],
  "/admin": ["admin", "admin prodi"],
  "/kaprodi": ["kaprodi"],
  "/sekprodi": ["sekprodi"],
  "/dosen": ["dosen"],
  "/mahasiswa": ["mahasiswa"],
};

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Redirect ke dashboard jika sudah login dan akses /login
  if (pathname === "/login") {
    if (token) {
      // Token ada tapi role tidak diketahui di proxy (user ada di localStorage client)
      // Redirect ke halaman default, client akan handle redirect ke dashboard yang tepat
      return NextResponse.redirect(
        new URL("/mahasiswa/dashboard", request.url),
      );
    }
    return NextResponse.next();
  }

  // 2. Cek apakah route ini protected
  const matchedPrefix = Object.keys(routeRoles).find((prefix) =>
    pathname.startsWith(prefix),
  );

  if (matchedPrefix) {
    // Jika tidak ada token, redirect ke login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token ada — izinkan akses
    // Role-based guard dilakukan di client/layout level
    // karena user data ada di localStorage (tidak bisa dibaca proxy)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/super-admin/:path*",
    "/admin/:path*",
    "/kaprodi/:path*",
    "/sekprodi/:path*",
    "/dosen/:path*",
    "/mahasiswa/:path*",
  ],
};
