"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
    // Clear all auth cookies
    const cookieStore = await cookies();
    
    // Clear token (httpOnly)
    cookieStore.set("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0
    });

    // Clear user data
    cookieStore.set("user", "", {
        path: "/",
        maxAge: 0
    });

    // Clear role
    cookieStore.set("role", "", {
        path: "/",
        maxAge: 0
    });

    // Clear roles array
    cookieStore.set("roles", "", {
        path: "/",
        maxAge: 0
    });

    // Clear permissions array
    cookieStore.set("permissions", "", {
        path: "/",
        maxAge: 0
    });

    redirect("/login");
}