import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;
  const { pathname } = request.nextUrl;

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

  // 1. Redirect to dashboard if already logged in and accessing /login
  if (pathname === "/login") {
    if (token) {
      let role = "mahasiswa";
      try {
        if (userCookie) {
          const user = JSON.parse(userCookie);
          role = user.role?.toLowerCase() || "mahasiswa";
        }
      } catch (e) {
        // ignore parse error
      }

      const target = dashboardRoutes[role] || "/mahasiswa/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // Mapping route prefix ke allowed roles
  const routeRoles: Record<string, string[]> = {
    "/super-admin": ["super admin"],
    "/admin": ["admin", "admin prodi"],
    "/kaprodi": ["kaprodi"],
    "/sekprodi": ["sekprodi"],
    "/dosen": ["dosen"],
    "/mahasiswa": ["mahasiswa"],
  };

  // Check if current path is a protected route
  const matchedPrefix = Object.keys(routeRoles).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (matchedPrefix) {
    // If not authenticated, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      // Optional: save return url usually
      return NextResponse.redirect(loginUrl);
    }

    let role = "";
    try {
      if (userCookie) {
        const user = JSON.parse(userCookie);
        role = user.role?.toLowerCase() || "";
      }
    } catch (e) {
      // invalid cookie
    }

    const allowedRoles = routeRoles[matchedPrefix];

    // Check if user's role is allowed for this route
    if (!allowedRoles.includes(role)) {
      // Unauthorized: Redirect to their own dashboard if possible
      const properDashboard = dashboardRoutes[role];
      if (properDashboard) {
        return NextResponse.redirect(new URL(properDashboard, request.url));
      } else {
        // If role doesn't have a dashboard (weird state), force login or unauthorized
        // Maybe clear cookies? But middleware can't easily clear cookies without returning response with headers
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
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
