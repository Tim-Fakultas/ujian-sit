import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define route access rules
const routePermissions: Record<string, string[]> = {
  "/superadmin": ["super admin"],
  "/dosen": ["dosen"],
  "/adminprodi": ["admin prodi"],
  "/mahasiswa": ["mahasiswa"],
  "/kaprodi": ["kaprodi"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware running for:", pathname);

  // Get user data from cookies/headers (adjust based on loginAction cookie names)
  const authCookie = request.cookies.get("token");
  const userCookie = request.cookies.get("user");

  console.log("Auth cookie:", authCookie ? "exists" : "missing");
  console.log("User cookie:", userCookie ? "exists" : "missing");

  // If no auth token, redirect to login
  if (
    !authCookie &&
    (pathname.startsWith("/superadmin") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/sekprodi") ||
      pathname.startsWith("/kaprodi") ||
      pathname.startsWith("/dosen") ||
      pathname.startsWith("/mahasiswa"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user data exists, check role permissions
  if (userCookie) {
    try {
      const userData = JSON.parse(userCookie.value);
      const userRole =
        userData.roles && userData.roles.length > 0
          ? userData.roles[0].name
          : null;

      // Check if current path requires specific role
      for (const [route, allowedRoles] of Object.entries(routePermissions)) {
        if (pathname.startsWith(route)) {
          if (!userRole || !allowedRoles.includes(userRole)) {
            // Redirect to appropriate dashboard based on user's actual role
            if (userRole === "super admin") {
              return NextResponse.redirect(new URL("/superadmin", request.url));
            } else if (userRole === "dosen") {
              return NextResponse.redirect(new URL("/dosen", request.url));
            } else if (userRole === "mahasiswa") {
              return NextResponse.redirect(new URL("/mahasiswa", request.url));
            } else if (userRole === "kaprodi") {
              return NextResponse.redirect(new URL("/kaprodi", request.url));
            } else if (userRole === "admin prodi") {
              return NextResponse.redirect(new URL("/adminprodi", request.url));
            } else {
              return NextResponse.redirect(new URL("/login", request.url));
            }
          }
        }
      }
    } catch (error) {
      // Invalid user data, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/superadmin/:path*",
    "/dosen/:path*",
    "/mahasiswa/:path*",
    "/kaprodi/:path*",
  ],
};
