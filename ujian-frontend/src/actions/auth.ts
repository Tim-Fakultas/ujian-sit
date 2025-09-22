"use server";

import { z } from "zod";
import { authenticate, createSession, destroySession } from "@/lib/authHelper";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({ username, password });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const user = authenticate(username, password);
  if (!user) {
    return { error: "Username atau password salah" };
  }

  createSession(user.username, user.role);
  return { success: true, role: user.role };
}

export async function logoutAction() {
  destroySession();
  return { success: true };
}
