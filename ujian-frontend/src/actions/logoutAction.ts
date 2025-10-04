"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
    // Clear both auth token and user data cookies
    const cookieStore = await cookies();
    
    cookieStore.set("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0
    });

    cookieStore.set("user", "", {
        path: "/",
        maxAge: 0
    });

    redirect("/login");
}