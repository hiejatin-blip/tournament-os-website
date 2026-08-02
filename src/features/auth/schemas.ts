import { z } from "zod";

/* ============================================================================
   TOURNAMENT OS — AUTH VALIDATION SCHEMAS (Zod)
   Single source of truth for all auth form validation. Used by the
   React Hook Form + shadcn Form refactor of the auth pages.
   ============================================================================ */

const EMAIL = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address.");

const PASSWORD = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .max(128, "Password must be under 128 characters.");

export const loginSchema = z.object({
  email: EMAIL,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(24, "Username must be under 24 characters.")
      .regex(/^[a-zA-Z0-9_.-]+$/, "Only letters, numbers, dots, dashes and underscores."),
    displayName: z.string().max(40, "Keep it under 40 characters.").optional(),
    email: EMAIL,
    password: PASSWORD,
    confirmPassword: z.string().min(1, "Please confirm your password."),
    region: z.string().min(1, "Pick a region."),
    agree: z.boolean().refine((v) => v === true, "Please accept the Code of Conduct to continue."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type SignupValues = z.infer<typeof signupSchema>;

export const forgotSchema = z.object({
  email: EMAIL,
});
export type ForgotValues = z.infer<typeof forgotSchema>;

export const resetSchema = z
  .object({
    password: PASSWORD,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type ResetValues = z.infer<typeof resetSchema>;

export const verifySchema = z.object({
  code: z
    .string()
    .length(6, "Enter the 6-digit code.")
    .regex(/^\d+$/, "Digits only."),
});
export type VerifyValues = z.infer<typeof verifySchema>;
