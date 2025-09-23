import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(20, "Username maksimal 20 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
