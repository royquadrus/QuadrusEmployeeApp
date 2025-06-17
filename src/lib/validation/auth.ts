import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(4, 'Password must be at least 4 characters')
        .max(100, 'Password is too long'),
});

export const registerSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(4, 'Password must be at least 4 characters')
        .max(100, 'Password is too long'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Paswords don't match",
    path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export const updatePasswordSchema = z.object({
    newPassword: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;