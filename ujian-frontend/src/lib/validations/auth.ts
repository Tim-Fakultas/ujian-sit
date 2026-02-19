import { z } from "zod";

export const loginSchema = z.object({
  nip_nim: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
  remember: z
    .union([z.boolean(), z.string()])
    .transform((v) => v === true || v === "on")
    .optional(),
});

export const loginClientSchema = loginSchema.extend({
  remember: z.boolean().default(false).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
