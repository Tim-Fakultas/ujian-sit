import { z } from "zod";

export const loginSchema = z.object({
    nip_nim: z.string().min(1, "Username wajib diisi"),
    password: z.string().min(1, "Password wajib diisi"),
    remember: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
