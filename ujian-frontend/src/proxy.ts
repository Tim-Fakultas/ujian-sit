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

  // 1. Jika sudah login dan mencoba akses /login, redirect ke dashboard yang sesuai
  if (pathname === "/login") {
    if (token) {
      // Coba baca role dari cookie user untuk redirect yang tepat
      try {
        const userCookieRaw = request.cookies.get("user")?.value;
        if (userCookieRaw) {
          const userCookie = JSON.parse(decodeURIComponent(userCookieRaw));
          const role = (userCookie?.role || "").toLowerCase();
          const dest = dashboardRoutes[role];
          if (dest) {
            return NextResponse.redirect(new URL(dest, request.url));
          }
        }
      } catch {
        // Cookie tidak bisa di-parse, fallback ke root
      }
      // Fallback: redirect ke root agar page.tsx yang handle redirect
      return NextResponse.redirect(new URL("/", request.url));
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
