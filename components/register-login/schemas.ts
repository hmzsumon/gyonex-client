// ── Zod schemas & types ─────────────────────────────────────
import { z } from "zod";

/* ── password ─────────────────────────────────────────────── */
export const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters")
  .max(15, "Must be at most 15 characters")
  .regex(/[a-z]/, "Include a lowercase letter")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/\d/, "Include a number")
  .regex(/[^A-Za-z0-9]/, "Include a special character");

/* ── sign in ──────────────────────────────────────────────── */
export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Required"),
});
export type SignInValues = z.infer<typeof signInSchema>;

/* ── register ─────────────────────────────────────────────── */
export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Required"),
    country: z.string().trim().min(1, "Required"),
    phone: z
      .string()
      .trim()
      .min(6, "Enter a valid phone number (with dial code)"),
    email: z.string().trim().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
    partnerCode: z.string().optional().or(z.literal("")),
    // boolean input & output; must be true
    notUSTaxPayer: z.boolean().refine((v) => v === true, {
      message: "Please confirm the declaration",
    }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
