// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value; // misal kamu simpan role juga di cookie

  const { pathname } = req.nextUrl;

  // Kalau sudah login dan mau ke /login → redirect ke dashboard sesuai role
  if (token && pathname === "/login") {
    const dashboardPath = `/${role || "mahasiswa"}/dashboard`;
    return NextResponse.redirect(new URL(dashboardPath, req.url));
  }

  // Kalau belum login tapi mau akses route privat → arahkan ke login
  if (!token && pathname.startsWith("/mahasiswa")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/mahasiswa/:path*",
    "/dosen/:path*",
    "/sekprodi/:path*",
    "/kaprodi/:path*",
  ],
};
